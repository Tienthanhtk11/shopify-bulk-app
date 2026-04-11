import type { ActionFunctionArgs } from "@remix-run/node";
import {
  deleteShopSessions,
  minimizeMerchantRetentionData,
  recordMerchantEvent,
  redactCustomerComplianceData,
  scrubMerchantProfile,
  wipeOperationalShopData,
} from "../models/merchant.server";
import { summarizeShopRedactPayload } from "../services/compliance.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);
  const summary = summarizeShopRedactPayload(payload);

  console.log(`Received ${topic} webhook for ${shop}`);

  await wipeOperationalShopData(shop);
  await scrubMerchantProfile(shop);
  await redactCustomerComplianceData(shop);
  await minimizeMerchantRetentionData(shop);
  await deleteShopSessions(shop);
  await recordMerchantEvent({
    shopDomain: shop,
    type: "compliance.shop_redact",
    source: "webhook",
    severity: "attention",
    payload: summary,
  });

  return new Response();
};