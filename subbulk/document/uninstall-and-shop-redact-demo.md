# set shop for demo:

export SHOP_DOMAIN="test5-9191.myshopify.com"

# Snapshot DB for shop 5

export SHOP_DOMAIN="test5-9191.myshopify.com"
cd /home/krizpham/thanhpt-stack && docker compose exec -T postgres psql -v SHOP_DOMAIN="$SHOP_DOMAIN" -U subbulk -d subbulk <<'SQL'
\pset pager off
SELECT 'merchant' AS section, "shopDomain", status, "installedAt", "uninstalledAt", email, "updatedAt"
FROM "Merchant"
WHERE "shopDomain" = :'SHOP_DOMAIN';

SELECT 'sessions' AS section, shop, count(*) AS session_count
FROM "Session"
WHERE shop = :'SHOP_DOMAIN'
GROUP BY shop;

SELECT 'widget_settings' AS section, count(*) AS rows
FROM "WidgetSettings"
WHERE shop = :'SHOP_DOMAIN';

SELECT 'widget_enabled_products' AS section, count(*) AS rows
FROM "WidgetEnabledProduct"
WHERE shop = :'SHOP_DOMAIN';

SELECT 'subscription_rules' AS section, count(*) AS rows
FROM "SubscriptionRule"
WHERE shop = :'SHOP_DOMAIN';

SELECT 'subscription_offers' AS section, count(*) AS rows
FROM "SubscriptionOffer"
WHERE shop = :'SHOP_DOMAIN';

SELECT 'latest_events' AS section, me.type, me.source, me.severity, me."createdAt", me."payloadJson"
FROM "MerchantEvent" me
JOIN "Merchant" m ON m.id = me."merchantId"
WHERE m."shopDomain" = :'SHOP_DOMAIN'
ORDER BY me."createdAt" DESC
LIMIT 10;
SQL

# Realtime log: 
cd /home/krizpham/thanhpt-stack && docker compose logs -f shopify_app | grep -i 'test5-9191\|uninstalled\|shop/redact\|customers/redact\|customers/data_request\|SHOP_REDACT\|APP_UNINSTALLED'

# Trigger shop/redact 
cd /home/krizpham/shopify-bulk-app/subbulk && set -a && source .env && set +a && shopify app webhook trigger \
  --topic shop/redact \
  --api-version 2025-04 \
  --address https://app.thanhpt.online/webhooks/shop/redact \
  --client-id "$SHOPIFY_API_KEY" \
  --client-secret "$SHOPIFY_API_SECRET"

# Check log after redact

cd /home/krizpham/thanhpt-stack && docker compose logs --tail=120 shopify_app | grep -i 'shop/redact\|SHOP_REDACT\|Received SHOP_REDACT\|compliance.shop_redact\|test5-9191'