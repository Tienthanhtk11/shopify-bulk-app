import type { ActionFunctionArgs } from "@remix-run/node";
import { recordMerchantEvent } from "../models/merchant.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  await recordMerchantEvent({
    shopDomain: shop,
    type: "compliance.customers_redact",
    source: "webhook",
    severity: "attention",
    payload,
  });

  return new Response();
};