ALTER TABLE "WidgetSettings"
ADD COLUMN "fontFamily" TEXT NOT NULL DEFAULT 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
ADD COLUMN "borderRadiusPx" INTEGER NOT NULL DEFAULT 6,
ADD COLUMN "borderThicknessPx" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "showSavingsBadge" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showCompareAtPrice" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "showSubscriptionDetails" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "customCssEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "customCss" TEXT NOT NULL DEFAULT '';
