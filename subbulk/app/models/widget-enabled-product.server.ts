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
    throw new Error("Product GID không hợp lệ.");
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
  if (!row) throw new Error("Không tìm thấy bản ghi.");
  const mf = await setProductBooleanMetafield(
    admin,
    row.productGid,
    "subbulk_widget_enabled",
    false,
  );
  if (!mf.ok) throw new Error(mf.error);
  await prisma.widgetEnabledProduct.delete({ where: { id: row.id } });
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
    return { ok: false, error: "JSON không hợp lệ." };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Bulk pricing phải là mảng JSON." };
  }
  for (const row of parsed) {
    if (!row || typeof row !== "object") {
      return { ok: false, error: "Mỗi phần tử phải là object." };
    }
    const o = row as Record<string, unknown>;
    const bp = Number(o.qtyBreakpoint);
    const pad = Number(o.priceAfterDiscount);
    if (!Number.isFinite(bp) || bp < 1) {
      return { ok: false, error: "qtyBreakpoint phải là số ≥ 1." };
    }
    if (!Number.isFinite(pad) || pad < 0) {
      return { ok: false, error: "priceAfterDiscount phải là số hợp lệ." };
    }
    if (
      o.bulkPrice != null &&
      o.bulkPrice !== "" &&
      !Number.isFinite(Number(o.bulkPrice))
    ) {
      return { ok: false, error: "bulkPrice (nếu có) phải là số." };
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
    throw new Error("Product GID không hợp lệ.");
  }
  const inList = await prisma.widgetEnabledProduct.findFirst({
    where: { shop, productGid },
  });
  if (!inList) {
    throw new Error("Sản phẩm chưa nằm trong danh sách widget.");
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
  /* Đảm bảo storefront vẫn thấy widget: mỗi sản phẩm có metafield JSON bulk riêng (owner = productGid). */
  const keepOn = await setProductBooleanMetafield(
    admin,
    productGid,
    "subbulk_widget_enabled",
    true,
  );
  if (!keepOn.ok) throw new Error(keepOn.error);
}
