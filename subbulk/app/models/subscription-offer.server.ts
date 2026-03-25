import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import prisma from "../db.server";

export type PlanIntervalConfig = {
  interval: "DAY" | "WEEK" | "MONTH";
  intervalCount: number;
  label: string;
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

/** Tạo Selling plan group trên Shopify + lưu DB. */
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
      productVariantIds: [],
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
    throw new Error("Không tạo được selling plan group");
  }

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
