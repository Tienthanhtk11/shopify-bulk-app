import type { LoaderFunctionArgs } from "@remix-run/node";
import prisma from "../db.server";
import { findRuleCoveringProduct } from "../models/subscription-rule.server";

/**
 * API công khai cho theme block cũ "Purchase Options Widget"
 * (subscription-bulk-app / star_rating.liquid): fetch từ storefront tới appBaseUrl.
 * Bắt buộc CORS * để trình duyệt trên myshopify.com không chặn.
 */
function json(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Cache-Control", "public, max-age=60");
  return Response.json(data, { ...init, headers });
}

function normalizeShop(shop: string | null) {
  if (!shop) return null;
  const normalized = shop.trim().toLowerCase();
  if (!normalized.endsWith(".myshopify.com")) return null;
  return normalized;
}

type LegacyInterval = {
  id: string;
  label: string;
  billingIntervalUnit: string;
  billingIntervalCount: number;
  discountType: string;
  discountValue: string | null;
  sellingPlanGid: string | null;
  isDefault: boolean;
};

type LegacyOffer = {
  id: string;
  name: string;
  displayLabel: string | null;
  showOneTimePurchase: boolean;
  defaultPurchaseOption: string;
  purchaseOptionMode: string;
  productId: string | null;
  variantId: string | null;
  intervals: LegacyInterval[];
};

function mapOfferToLegacy(offer: {
  id: string;
  title: string;
  productGid: string;
  defaultSellingPlanGid: string | null;
  discountType: string;
  discountValue: string;
  planIntervalsJson: string;
}): LegacyOffer | null {
  if (!offer.defaultSellingPlanGid) return null;

  let firstLabel = "Subscribe";
  let billingUnit = "MONTH";
  let billingCount = 1;
  try {
    const raw = JSON.parse(offer.planIntervalsJson || "[]");
    if (Array.isArray(raw) && raw[0] && typeof raw[0] === "object") {
      const row = raw[0] as {
        label?: string;
        interval?: string;
        intervalCount?: number;
      };
      if (row.label) firstLabel = String(row.label);
      if (row.interval) billingUnit = String(row.interval);
      if (row.intervalCount != null)
        billingCount = Math.max(1, Number(row.intervalCount) || 1);
    }
  } catch {
    /* keep defaults */
  }

  const discountTypeUpper =
    offer.discountType === "FIXED" || offer.discountType === "FIXED_AMOUNT"
      ? "FIXED_AMOUNT"
      : "PERCENTAGE";

  const intervals: LegacyInterval[] = [
    {
      id: `${offer.id}-interval-0`,
      label: firstLabel,
      billingIntervalUnit: billingUnit,
      billingIntervalCount: billingCount,
      discountType: discountTypeUpper,
      discountValue: offer.discountValue,
      sellingPlanGid: offer.defaultSellingPlanGid,
      isDefault: true,
    },
  ];

  return {
    id: offer.id,
    name: offer.title,
    displayLabel: null,
    showOneTimePurchase: true,
    defaultPurchaseOption: "ONE_TIME",
    purchaseOptionMode: "HYBRID",
    productId: offer.productGid,
    variantId: null,
    intervals,
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(request.url);
  const shopDomain = normalizeShop(url.searchParams.get("shop"));
  const productId = url.searchParams.get("productId")?.trim();

  if (!shopDomain || !productId) {
    return json(
      { ok: false, error: "shop (xxx.myshopify.com) and productId are required." },
      { status: 400 },
    );
  }

  const productGid = `gid://shopify/Product/${productId}`;

  const widgetRow = await prisma.widgetSettings.findUnique({
    where: { shop: shopDomain },
  });

  const rule = await findRuleCoveringProduct(shopDomain, productGid);
  let offers: LegacyOffer[] = [];
  if (rule?.defaultSellingPlanGid) {
    const mapped = mapOfferToLegacy({
      id: rule.id,
      title: rule.title,
      productGid,
      defaultSellingPlanGid: rule.defaultSellingPlanGid,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      planIntervalsJson: rule.planIntervalsJson,
    });
    if (mapped) offers = [mapped];
  }

  if (offers.length === 0) {
    const offerRows = await prisma.subscriptionOffer.findMany({
      where: {
        shop: shopDomain,
        productGid,
        sellingPlanGroupGid: { not: null },
      },
      orderBy: { updatedAt: "desc" },
    });
    offers = offerRows
      .map(mapOfferToLegacy)
      .filter((o): o is LegacyOffer => o !== null);
  }

  return json({
    ok: true,
    shop: shopDomain,
    widgetSettings: {
      isEnabled: true,
      subscriptionWidgetTitle:
        widgetRow?.purchaseOptionsLabel ?? "Purchase options",
      bulkPricingTableTitle: widgetRow?.buyMoreHeading ?? "Buy more, save more",
      showSavingsBadge: true,
      showCompareAtPrice: true,
      showSubscriptionPricePreview: true,
      customCssEnabled: false,
      customCss: null,
    },
    publishedAt: null,
    revision: null,
    offers,
    rules: [],
  });
};
