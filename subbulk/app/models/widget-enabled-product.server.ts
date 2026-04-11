import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import prisma from "../db.server";
import {
  fetchProductTitle,
  setProductBooleanMetafield,
  setProductJsonMetafield,
} from "../lib/shopify-metafields.server";

export async function listWidgetEnabledProducts(shop: string) {
  return prisma.widgetEnabledProduct.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });
}

export type WidgetEnabledProductRow = Awaited<
  ReturnType<typeof listWidgetEnabledProducts>
>[number];

export async function isWidgetEnabledForProduct(
  shop: string,
  productGid: string,
) {
  const row = await prisma.widgetEnabledProduct.findFirst({
    where: { shop, productGid },
    select: { id: true },
  });
  return Boolean(row);
}

export async function addWidgetEnabledProduct(
  admin: AdminApiContext,
  shop: string,
  productGid: string,
) {
  if (!productGid.startsWith("gid://shopify/Product/")) {
    throw new Error("Product GID is invalid.");
  }
  const title = await fetchProductTitle(admin, productGid);
  const mf = await setProductBooleanMetafield(
    admin,
    productGid,
    "subbulk_widget_enabled",
    true,
  );
  if (!mf.ok) throw new Error(mf.error);

  await prisma.widgetEnabledProduct.upsert({
    where: {
      shop_productGid: { shop, productGid },
    },
    create: {
      shop,
      productGid,
      productTitle: title,
    },
    update: {
      productTitle: title ?? undefined,
    },
  });
}

export async function removeWidgetEnabledProduct(
  admin: AdminApiContext,
  shop: string,
  rowId: string,
) {
  const row = await prisma.widgetEnabledProduct.findFirst({
    where: { shop, id: rowId },
  });
  if (!row) throw new Error("Record not found.");
  const mf = await setProductBooleanMetafield(
    admin,
    row.productGid,
    "subbulk_widget_enabled",
    false,
  );
  if (!mf.ok) throw new Error(mf.error);
  await prisma.widgetEnabledProduct.delete({ where: { id: row.id } });
}

export async function syncWidgetEnabledProducts(
  admin: AdminApiContext,
  shop: string,
  desiredProductGids: string[],
) {
  const desired = new Set(desiredProductGids);
  const rows = await listWidgetEnabledProducts(shop);

  for (const row of rows) {
    if (desired.has(row.productGid)) continue;
    await removeWidgetEnabledProduct(admin, shop, row.id);
  }

  for (const productGid of desiredProductGids) {
    await addWidgetEnabledProduct(admin, shop, productGid);
  }
}

export function validateBulkPricingJson(raw: string): {
  ok: true;
  normalized: string;
} | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, normalized: "[]" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "JSON is invalid." };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Bulk pricing must be a JSON array." };
  }
  for (const row of parsed) {
    if (!row || typeof row !== "object") {
      return { ok: false, error: "Each row must be an object." };
    }
    const o = row as Record<string, unknown>;
    const bp = Number(o.qtyBreakpoint);
    const pad = Number(o.priceAfterDiscount);
    if (!Number.isFinite(bp) || bp < 1) {
      return { ok: false, error: "qtyBreakpoint must be a number greater than or equal to 1." };
    }
    if (!Number.isFinite(pad) || pad < 0) {
      return { ok: false, error: "priceAfterDiscount must be a valid number." };
    }
    if (
      o.bulkPrice != null &&
      o.bulkPrice !== "" &&
      !Number.isFinite(Number(o.bulkPrice))
    ) {
      return { ok: false, error: "bulkPrice, when provided, must be numeric." };
    }
  }
  return { ok: true, normalized: JSON.stringify(parsed) };
}

export async function saveProductBulkPricing(
  admin: AdminApiContext,
  shop: string,
  productGid: string,
  jsonRaw: string,
) {
  if (!productGid.startsWith("gid://shopify/Product/")) {
    throw new Error("Product GID is invalid.");
  }
  const inList = await prisma.widgetEnabledProduct.findFirst({
    where: { shop, productGid },
  });
  if (!inList) {
    throw new Error("The product is not currently in the widget list.");
  }
  const v = validateBulkPricingJson(jsonRaw);
  if (!v.ok) throw new Error(v.error);
  const mf = await setProductJsonMetafield(
    admin,
    productGid,
    "bulk_pricing",
    v.normalized,
  );
  if (!mf.ok) throw new Error(mf.error);
  /* Keep the storefront widget enabled. Each product owns its own bulk-pricing metafield. */
  const keepOn = await setProductBooleanMetafield(
    admin,
    productGid,
    "subbulk_widget_enabled",
    true,
  );
  if (!keepOn.ok) throw new Error(keepOn.error);
}
