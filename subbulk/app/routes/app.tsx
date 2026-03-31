import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { merchantCanAccessPath } from "../services/billing.server";
import { isInternalAdminSession } from "../services/internal-admin.server";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const { allowed, requiredFeature } = merchantCanAccessPath(
    new URL(request.url).pathname,
    latestPlan,
  );

  if (!allowed && requiredFeature) {
    throw redirect(`/app/billing?required=${requiredFeature}`);
  }

  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    isInternalAdmin: isInternalAdminSession(session),
  };
};

export default function App() {
  const { apiKey, isInternalAdmin } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app/analytics" rel="home">
          Analytics
        </Link>
        <Link to="/app/billing">Billing</Link>
        <Link to="/app/subscriptions">Subscriptions</Link>
        <Link to="/app/subscription-rule">Subscription rule</Link>
        <Link to="/app/settings">Settings</Link>
        <Link to="/app/privacy">Privacy</Link>
        {isInternalAdmin ? <Link to="/app/merchants">Merchants</Link> : null}
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
