import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import prisma from "../db.server";

export type PlanIntervalConfig = {
  interval: "DAY" | "WEEK" | "MONTH";
  intervalCount: number;
  label: string;
  name?: string;
  description?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
};

export async function listOffers(shop: string) {
  return prisma.subscriptionOffer.findMany({
    where: { shop },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getOffer(shop: string, id: string) {
  return prisma.subscriptionOffer.findFirst({ where: { shop, id } });
}

export async function deleteOffer(shop: string, id: string) {
  return prisma.subscriptionOffer.deleteMany({ where: { shop, id } });
}

/** Fetch up to 250 product variant GIDs so selling plans can be attached precisely. */
export async function fetchProductVariantGids(
  admin: AdminApiContext,
  productGid: string,
): Promise<string[]> {
  const res = await admin.graphql(
    `#graphql
    query SubBulkProductVariants($id: ID!) {
      product(id: $id) {
        id
        variants(first: 250) {
          nodes { id }
        }
      }
    }`,
    { variables: { id: productGid } },
  );
  const json = await res.json();
  if (!json.data?.product?.id) {
    throw new Error("Product was not found in Shopify. Check the Product GID.");
  }
  const nodes = json.data.product.variants?.nodes ?? [];
  return nodes
    .map((n: { id?: string }) => n?.id)
    .filter((id: string | undefined): id is string => Boolean(id));
}

/**
 * SubBulk supports one-time purchase and subscription together.
 * Some stores end up with `requiresSellingPlan: true` after group creation,
 * which makes the normal purchase button appear sold out on the storefront.
 */
export async function ensureProductAllowsOneTimePurchase(
  admin: AdminApiContext,
  productGid: string,
) {
  const res = await admin.graphql(
    `#graphql
    query SubBulkProductRequiresPlan($id: ID!) {
      product(id: $id) {
        id
        requiresSellingPlan
      }
    }`,
    { variables: { id: productGid } },
  );
  const json = await res.json();
  const requires = json.data?.product?.requiresSellingPlan === true;
  if (!requires) return;

  const upd = await admin.graphql(
    `#graphql
    mutation SubBulkProductAllowOnetime($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id requiresSellingPlan }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        input: { id: productGid, requiresSellingPlan: false },
      },
    },
  );
  const uj = await upd.json();
  const errs = uj.data?.productUpdate?.userErrors ?? [];
  if (errs.length) {
    throw new Error(
      errs.map((e: { message: string }) => e.message).join("; "),
    );
  }
}

/** Create a selling plan group in Shopify and persist it locally. */
export async function createOfferWithSellingPlans(
  admin: AdminApiContext,
  shop: string,
  input: {
    title: string;
    productGid: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    planIntervals: PlanIntervalConfig[];
  },
) {
  const variantGids = await fetchProductVariantGids(admin, input.productGid);
  if (!variantGids.length) {
    throw new Error("The product has no variants, so the selling plan could not be created.");
  }

  const planIntervals = input.planIntervals.length
    ? input.planIntervals
    : [{ interval: "MONTH" as const, intervalCount: 1, label: "1 month" }];

  const merchantCode = `subbulk-${Date.now()}`;
  const groupName = input.title.trim() || "SubBulk subscribe & save";

  const pricingPolicies =
    input.discountType === "PERCENTAGE"
      ? [
          {
            fixed: {
              adjustmentType: "PERCENTAGE",
              adjustmentValue: { percentage: input.discountValue },
            },
          },
        ]
      : [
          {
            fixed: {
              adjustmentType: "FIXED_AMOUNT",
              adjustmentValue: { fixedValue: input.discountValue },
            },
          },
        ];

  const sellingPlansToCreate = planIntervals.map((p, idx) => ({
    name: `${groupName} — ${p.label}`,
    options: [p.label],
    category: "SUBSCRIPTION",
    position: idx + 1,
    billingPolicy: {
      recurring: {
        interval: p.interval,
        intervalCount: p.intervalCount,
      },
    },
    deliveryPolicy: {
      recurring: {
        interval: p.interval,
        intervalCount: p.intervalCount,
        preAnchorBehavior: "ASAP",
        intent: "FULFILLMENT_BEGIN",
      },
    },
    inventoryPolicy: { reserve: "ON_SALE" },
    pricingPolicies,
  }));

  const variables = {
    input: {
      name: groupName,
      merchantCode,
      options: ["Deliver every"],
      description: "Created by SubBulk",
      sellingPlansToCreate,
    },
    resources: {
      productIds: [input.productGid],
      productVariantIds: variantGids,
    },
  };

  const res = await admin.graphql(
    `#graphql
    mutation SubBulkCreateSellingPlanGroup($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
      sellingPlanGroupCreate(input: $input, resources: $resources) {
        sellingPlanGroup {
          id
          sellingPlans(first: 20) {
            nodes { id name }
          }
        }
        userErrors { field message }
      }
    }`,
    { variables },
  );

  const json = await res.json();
  const payload = json.data?.sellingPlanGroupCreate;
  const errors = payload?.userErrors ?? [];
  if (errors.length) {
    throw new Error(errors.map((e: { message: string }) => e.message).join("; "));
  }

  const group = payload?.sellingPlanGroup;
  if (!group?.id) {
    throw new Error("Unable to create the selling plan group.");
  }

  await ensureProductAllowsOneTimePurchase(admin, input.productGid);

  const plans = group.sellingPlans?.nodes ?? [];
  const defaultSellingPlanGid = plans[0]?.id ?? null;

  const offer = await prisma.subscriptionOffer.create({
    data: {
      shop,
      title: input.title,
      productGid: input.productGid,
      sellingPlanGroupGid: group.id,
      defaultSellingPlanGid,
      discountType: input.discountType,
      discountValue: String(input.discountValue),
      planIntervalsJson: JSON.stringify(planIntervals),
    },
  });

  return { offer, sellingPlanGroupId: group.id, plans };
}

export async function updateOfferDefaultPlan(
  shop: string,
  offerId: string,
  defaultSellingPlanGid: string,
) {
  return prisma.subscriptionOffer.updateMany({
    where: { shop, id: offerId },
    data: { defaultSellingPlanGid },
  });
}
