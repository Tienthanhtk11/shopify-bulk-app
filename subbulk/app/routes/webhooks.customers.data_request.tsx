import type { ActionFunctionArgs } from "@remix-run/node";
import { recordMerchantEvent } from "../models/merchant.server";
import { summarizeCustomersDataRequestPayload } from "../services/compliance.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);
  const summary = summarizeCustomersDataRequestPayload(payload);

  console.log(`Received ${topic} webhook for ${shop}`);

  await recordMerchantEvent({
    shopDomain: shop,
    type: "compliance.customers_data_request",
    source: "webhook",
    severity: "attention",
    payload: summary,
  });

  return new Response();
};