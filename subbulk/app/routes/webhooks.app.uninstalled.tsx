import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { deleteShopSessions, markMerchantUninstalled } from "../models/merchant.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { shop, session, topic } = await authenticate.webhook(request);

    console.log(`Received ${topic} webhook for ${shop}`);

    try {
      await markMerchantUninstalled(shop);
    } catch (error) {
      console.error(`Failed to mark merchant uninstalled for ${shop}`, error);
      throw error;
    }

    // Webhook requests can trigger multiple times and after an app has already been uninstalled.
    // If this webhook already ran, the session may have been deleted previously.
    if (session) {
      try {
        await deleteShopSessions(shop);
      } catch (error) {
        console.error(`Failed to delete sessions after uninstall for ${shop}`, error);
        throw error;
      }
    }

    return new Response();
  } catch (error) {
    console.error("Unhandled app/uninstalled webhook error", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
};
