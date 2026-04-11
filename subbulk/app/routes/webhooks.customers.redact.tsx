import type { ActionFunctionArgs } from "@remix-run/node";
import {
  recordMerchantEvent,
  redactCustomerComplianceData,
} from "../models/merchant.server";
import { summarizeCustomersRedactPayload } from "../services/compliance.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);
  const summary = summarizeCustomersRedactPayload(payload);

  console.log(`Received ${topic} webhook for ${shop}`);

  await redactCustomerComplianceData(shop);

  await recordMerchantEvent({
    shopDomain: shop,
    type: "compliance.customers_redact",
    source: "webhook",
    severity: "attention",
    payload: summary,
  });

  return new Response();
};