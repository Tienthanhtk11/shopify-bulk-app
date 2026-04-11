import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import prisma from "../db.server";
import { listWidgetEnabledProducts } from "./widget-enabled-product.server";
import type { PlanIntervalConfig } from "./subscription-offer.server";
import {
  ensureProductAllowsOneTimePurchase,
  fetchProductVariantGids,
} from "./subscription-offer.server";

export type ProductScope = "WIDGET_ENABLED" | "EXPLICIT";

export async function getSubscriptionRule(shop: string) {
  return prisma.subscriptionRule.findUnique({ where: { shop } });
}

export function parseExplicitGids(json: string): string[] {
  try {
    const raw = JSON.parse(json || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (x): x is string =>
        typeof x === "string" && x.startsWith("gid://shopify/Product/"),
    );
  } catch {
    return [];
  }
}

/** Product GIDs that should be attached to the rule's selling plan group. */
export async function resolveRuleProductGids(
  shop: string,
  scope: ProductScope,
  explicitProductGidsJson: string,
): Promise<string[]> {
  if (scope === "EXPLICIT") {
    return parseExplicitGids(explicitProductGidsJson);
  }
  const rows = await listWidgetEnabledProducts(shop);
  return rows.map((r) => r.productGid);
}

export async function findRuleCoveringProduct(shop: string, productGid: string) {
  const rule = await getSubscriptionRule(shop);
  if (!rule?.sellingPlanGroupGid) return null;

  if (rule.productScope === "EXPLICIT") {
    const gids = parseExplicitGids(rule.explicitProductGidsJson);
    return gids.includes(productGid) ? rule : null;
  }

  const row = await prisma.widgetEnabledProduct.findUnique({
    where: { shop_productGid: { shop, productGid } },
  });
  return row ? rule : null;
}

async function fetchVariantGidsForProducts(
  admin: AdminApiContext,
  productGids: string[],
): Promise<{ productGid: string; variantGids: string[] }[]> {
  const out: { productGid: string; variantGids: string[] }[] = [];
  for (const gid of productGids) {
    const variantGids = await fetchProductVariantGids(admin, gid);
    if (variantGids.length) {
      out.push({ productGid: gid, variantGids });
    }
  }
  return out;
}

async function queryGroupProductIds(
  admin: AdminApiContext,
  groupGid: string,
): Promise<string[]> {
  const res = await admin.graphql(
    `#graphql
    query SubBulkGroupProducts($id: ID!) {
      sellingPlanGroup(id: $id) {
        id
        products(first: 250) {
          nodes { id }
        }
      }
    }`,
    { variables: { id: groupGid } },
  );
  const json = await res.json();
  const nodes = json.data?.sellingPlanGroup?.products?.nodes ?? [];
  return nodes
    .map((n: { id?: string }) => n?.id)
    .filter((id: string | undefined): id is string => Boolean(id));
}

function buildSellingPlansToCreate(
  groupName: string,
  planIntervals: PlanIntervalConfig[],
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
) {
  const discountLabel =
    discountType === "PERCENTAGE"
      ? `${discountValue}% off`
      : `$${discountValue} off`;

  return planIntervals.map((p, idx) => {
    const resolvedDiscountType = p.discountType ?? discountType;
    const resolvedDiscountValue =
      typeof p.discountValue === "number" ? p.discountValue : discountValue;
    const resolvedDiscountLabel =
      resolvedDiscountType === "PERCENTAGE"
        ? `${resolvedDiscountValue}% off`
        : `$${resolvedDiscountValue} off`;

    const pricingPolicies =
      resolvedDiscountType === "PERCENTAGE"
        ? [
            {
              fixed: {
                adjustmentType: "PERCENTAGE",
                adjustmentValue: { percentage: resolvedDiscountValue },
              },
            },
          ]
        : [
            {
              fixed: {
                adjustmentType: "FIXED_AMOUNT",
                adjustmentValue: { fixedValue: resolvedDiscountValue },
              },
            },
          ];

    return {
      name:
        p.name?.trim() ||
        `${groupName} — ${p.label} (${resolvedDiscountLabel || discountLabel})`,
      options: [p.label],
      category: "SUBSCRIPTION",
      description: p.description?.trim() || undefined,
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
    };
  });
}

/** Sync the selling plan group's product list with the desired set. */
export async function syncRuleProductsOnShopify(
  admin: AdminApiContext,
  sellingPlanGroupGid: string,
  desiredProductGids: string[],
) {
  const desired = new Set(desiredProductGids);
  const current = await queryGroupProductIds(admin, sellingPlanGroupGid);
  const currentSet = new Set(current);

  const toAdd = desiredProductGids.filter((id) => !currentSet.has(id));
  const toRemove = current.filter((id) => !desired.has(id));

  if (toRemove.length) {
    const variantRows = await fetchVariantGidsForProducts(admin, toRemove);
    const productVariantIds = variantRows.flatMap((row) => row.variantGids);

    if (productVariantIds.length) {
      const removeVariants = await admin.graphql(
        `#graphql
        mutation SubBulkSPGRemoveVariants($id: ID!, $productVariantIds: [ID!]!) {
          sellingPlanGroupRemoveProductVariants(
            id: $id
            productVariantIds: $productVariantIds
          ) {
            userErrors { field message }
          }
        }`,
        {
          variables: {
            id: sellingPlanGroupGid,
            productVariantIds,
          },
        },
      );
      const rvj = await removeVariants.json();
      const removeVariantErrors =
        rvj.data?.sellingPlanGroupRemoveProductVariants?.userErrors ?? [];
      if (removeVariantErrors.length) {
        throw new Error(
          removeVariantErrors
            .map((e: { message: string }) => e.message)
            .join("; "),
        );
      }
    }

    const rm = await admin.graphql(
      `#graphql
      mutation SubBulkSPGRemoveProducts($id: ID!, $productIds: [ID!]!) {
        sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
          userErrors { field message }
        }
      }`,
      { variables: { id: sellingPlanGroupGid, productIds: toRemove } },
    );
    const rj = await rm.json();
    const errs = rj.data?.sellingPlanGroupRemoveProducts?.userErrors ?? [];
    if (errs.length) {
      throw new Error(
        errs.map((e: { message: string }) => e.message).join("; "),
      );
    }
  }

  if (toAdd.length) {
    const add = await admin.graphql(
      `#graphql
      mutation SubBulkSPGAddProducts($id: ID!, $productIds: [ID!]!) {
        sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {
          userErrors { field message }
        }
      }`,
      {
        variables: {
          id: sellingPlanGroupGid,
          productIds: toAdd,
        },
      },
    );
    const aj = await add.json();
    const e1 = aj.data?.sellingPlanGroupAddProducts?.userErrors ?? [];
    if (e1.length) {
      throw new Error(e1.map((e: { message: string }) => e.message).join("; "));
    }

    const variantRows = await fetchVariantGidsForProducts(admin, toAdd);
    const productVariantIds = variantRows.flatMap((row) => row.variantGids);
    if (productVariantIds.length) {
      const addVariants = await admin.graphql(
        `#graphql
        mutation SubBulkSPGAddVariants($id: ID!, $productVariantIds: [ID!]!) {
          sellingPlanGroupAddProductVariants(
            id: $id
            productVariantIds: $productVariantIds
          ) {
            userErrors { field message }
          }
        }`,
        {
          variables: {
            id: sellingPlanGroupGid,
            productVariantIds,
          },
        },
      );
      const avj = await addVariants.json();
      const e2 =
        avj.data?.sellingPlanGroupAddProductVariants?.userErrors ?? [];
      if (e2.length) {
        throw new Error(
          e2.map((e: { message: string }) => e.message).join("; "),
        );
      }
    }
  }

  for (const gid of new Set([...toAdd, ...toRemove])) {
    await ensureProductAllowsOneTimePurchase(admin, gid);
  }
}

export async function deleteSellingPlanGroupOnShopify(
  admin: AdminApiContext,
  groupGid: string,
) {
  const res = await admin.graphql(
    `#graphql
    mutation SubBulkSPGDelete($id: ID!) {
      sellingPlanGroupDelete(id: $id) {
        deletedSellingPlanGroupId
        userErrors { field message }
      }
    }`,
    { variables: { id: groupGid } },
  );
  const json = await res.json();
  const errs = json.data?.sellingPlanGroupDelete?.userErrors ?? [];
  if (errs.length) {
    throw new Error(errs.map((e: { message: string }) => e.message).join("; "));
  }
}

/**
 * Tạo mới selling plan group trên Shopify cho rule (nhiều sản phẩm).
 * Gọi khi chưa có group hoặc merchant bấm "Tạo lại nhóm".
 */
export async function createShopifyGroupForRule(
  admin: AdminApiContext,
  input: {
    title: string;
    planSelectorLabel: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    planIntervals: PlanIntervalConfig[];
    productGids: string[];
  },
) {
  if (!input.productGids.length) {
    throw new Error(
      "No products are currently in the rule scope. Add products to Widget Products, or choose explicit products, then try again.",
    );
  }

  const planIntervals = input.planIntervals.length
    ? input.planIntervals
    : [{ interval: "MONTH" as const, intervalCount: 1, label: "1 month" }];

  const groupName = input.title.trim() || "SubBulk subscribe & save";
  const merchantCode = `subbulk-rule-${Date.now()}`;
  const optionLabel = (input.planSelectorLabel || "Deliver every").trim();

  const sellingPlansToCreate = buildSellingPlansToCreate(
    groupName,
    planIntervals,
    input.discountType,
    input.discountValue,
  );

  const variantRows = await fetchVariantGidsForProducts(
    admin,
    input.productGids,
  );
  const productIds = variantRows.map((r) => r.productGid);
  const productVariantIds = variantRows.flatMap((r) => r.variantGids);

  const variables = {
    input: {
      name: groupName,
      merchantCode,
      options: [optionLabel],
      description: "Created by SubBulk (subscription rule)",
      sellingPlansToCreate,
    },
    resources: {
      productIds,
      productVariantIds,
    },
  };

  const res = await admin.graphql(
    `#graphql
    mutation SubBulkRuleCreateSPG($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
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

  for (const gid of input.productGids) {
    await ensureProductAllowsOneTimePurchase(admin, gid);
  }

  const plans = group.sellingPlans?.nodes ?? [];
  const defaultSellingPlanGid = plans[0]?.id ?? null;

  return {
    sellingPlanGroupGid: group.id as string,
    defaultSellingPlanGid,
  };
}

/** After widget product changes, sync membership when the rule uses WIDGET_ENABLED. */
export async function syncWidgetScopeRuleToShopify(
  admin: AdminApiContext,
  shop: string,
) {
  const rule = await getSubscriptionRule(shop);
  if (!rule?.sellingPlanGroupGid || rule.productScope !== "WIDGET_ENABLED") {
    return;
  }
  const desired = await resolveRuleProductGids(
    shop,
    "WIDGET_ENABLED",
    rule.explicitProductGidsJson,
  );
  await syncRuleProductsOnShopify(admin, rule.sellingPlanGroupGid, desired);
}
