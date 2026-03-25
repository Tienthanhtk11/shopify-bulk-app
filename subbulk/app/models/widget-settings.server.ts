import prisma from "../db.server";

export async function getOrCreateWidgetSettings(shop: string) {
  const existing = await prisma.widgetSettings.findUnique({ where: { shop } });
  if (existing) return existing;
  return prisma.widgetSettings.create({ data: { shop } });
}

export async function updateWidgetSettings(
  shop: string,
  data: {
    buyMoreHeading?: string;
    purchaseOptionsLabel?: string;
    primaryColorHex?: string;
    accentGreenHex?: string;
    subscriptionFooter?: string;
    freeShippingNote?: string;
  },
) {
  await getOrCreateWidgetSettings(shop);
  return prisma.widgetSettings.update({
    where: { shop },
    data,
  });
}
