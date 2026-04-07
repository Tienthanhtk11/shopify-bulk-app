import prisma from "../db.server";

export async function getOrCreateWidgetSettings(shop: string) {
  const existing = await prisma.widgetSettings.findUnique({ where: { shop } });
  if (existing) return existing;
  return prisma.widgetSettings.create({
    data: {
      shop,
      showWidgetOnProductPage: false,
    },
  });
}

export async function updateWidgetSettings(
  shop: string,
  data: {
    showWidgetOnProductPage?: boolean;
    buyMoreHeading?: string;
    purchaseOptionsLabel?: string;
    primaryColorHex?: string;
    accentGreenHex?: string;
    fontFamily?: string;
    borderRadiusPx?: number;
    borderThicknessPx?: number;
    showSavingsBadge?: boolean;
    showCompareAtPrice?: boolean;
    showSubscriptionDetails?: boolean;
    customCssEnabled?: boolean;
    customCss?: string;
    subscriptionFooter?: string;
    freeShippingNote?: string;
    defaultSubscriptionDiscountType?: string;
    defaultSubscriptionDiscountValue?: string;
  },
) {
  await getOrCreateWidgetSettings(shop);
  return prisma.widgetSettings.update({
    where: { shop },
    data,
  });
}
