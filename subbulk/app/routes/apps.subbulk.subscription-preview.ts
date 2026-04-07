import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { isValidAppProxyRequest } from "../lib/app-proxy-signature.server";
import prisma from "../db.server";
import { findRuleCoveringProduct } from "../models/subscription-rule.server";
import { getOrCreateWidgetSettings } from "../models/widget-settings.server";

async function hasSubbulkPlanForProduct(shop: string, productId: string | null) {
  if (!productId || !/^\d+$/.test(productId)) return null;

  const productGid = `gid://shopify/Product/${productId}`;
  const rule = await findRuleCoveringProduct(shop, productGid);
  if (rule?.defaultSellingPlanGid) return true;

  const offer = await prisma.subscriptionOffer.findFirst({
    where: {
      shop,
      productGid,
      sellingPlanGroupGid: { not: null },
      defaultSellingPlanGid: { not: null },
    },
    select: { id: true },
  });

  return Boolean(offer);
}

/**
 * App Proxy: storefront (cùng domain myshopify.com) fetch JSON preview %/fixed
 * sau khi merchant lưu "Discount subscription mặc định" trong admin app.
 * URL: GET /apps/subbulk/subscription-preview
 *
 * Không dùng authenticate.public.appProxy: nó load offline session + refresh token;
 * khi refresh lỗi Remix trả 500 dù HMAC hợp lệ. Endpoint này chỉ cần HMAC + shop.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (!(await isValidAppProxyRequest(request))) {
    return json(
      { ok: false, error: "invalid_proxy_signature" },
      { status: 401 },
    );
  }
  const shop =
    new URL(request.url).searchParams.get("shop")?.toLowerCase().trim() ?? "";
  const productId = new URL(request.url).searchParams.get("productId")?.trim() ?? null;
  if (!shop.endsWith(".myshopify.com")) {
    return json({ ok: false, error: "invalid_shop" }, { status: 400 });
  }

  let ws;
  try {
    ws = await getOrCreateWidgetSettings(shop);
  } catch (e) {
    console.error("[subscription-preview] getOrCreateWidgetSettings", shop, e);
    return json(
      { ok: false, error: "database_unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
  const isFixed = ws.defaultSubscriptionDiscountType === "FIXED";
  const num = Number(ws.defaultSubscriptionDiscountValue);
  const safe = Number.isFinite(num) && num >= 0 ? num : 0;
  const productHasSubscriptionPlan = await hasSubbulkPlanForProduct(shop, productId);
  const preview = isFixed
    ? {
        discountMode: "fixed" as const,
        subscriptionPercent: 0,
        subscriptionFixed: safe,
      }
    : {
        discountMode: "percent" as const,
        subscriptionPercent: safe,
        subscriptionFixed: 0,
      };

  return json(
    {
      ok: true,
      preview,
      widgetSettings: {
        showWidgetOnProductPage: ws.showWidgetOnProductPage,
        productHasSubscriptionPlan,
        buyMoreHeading: ws.buyMoreHeading,
        purchaseOptionsLabel: ws.purchaseOptionsLabel,
        primaryColorHex: ws.primaryColorHex,
        accentGreenHex: ws.accentGreenHex,
        fontFamily: ws.fontFamily,
        borderRadiusPx: ws.borderRadiusPx,
        borderThicknessPx: ws.borderThicknessPx,
        showSavingsBadge: ws.showSavingsBadge,
        showCompareAtPrice: ws.showCompareAtPrice,
        showSubscriptionDetails: ws.showSubscriptionDetails,
        customCssEnabled: ws.customCssEnabled,
        customCss: ws.customCss,
        subscriptionFooter: ws.subscriptionFooter,
        freeShippingNote: ws.freeShippingNote,
      },
    },
    {
      headers: {
        /* Tránh CDN/browser giữ % cũ sau khi merchant đổi discount trong admin */
        "Cache-Control": "private, no-store",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
};
