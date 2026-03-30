import type { ActionFunctionArgs } from "@remix-run/node";
import {
  recordMerchantEvent,
  scrubMerchantProfile,
  wipeOperationalShopData,
} from "../models/merchant.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  await wipeOperationalShopData(shop);
  await scrubMerchantProfile(shop);
  await recordMerchantEvent({
    shopDomain: shop,
    type: "compliance.shop_redact",
    source: "webhook",
    severity: "attention",
    payload,
  });

  return new Response();
};