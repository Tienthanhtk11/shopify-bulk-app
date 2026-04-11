import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { Banner, Box } from "@shopify/polaris";

import { serverConfig } from "../config.server";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { requiredFeatureForPath } from "../services/billing.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { isInternalAdminSession } from "../services/internal-admin.server";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: "/polaris-styles.css" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const requestUrl = new URL(request.url);
  const requiredFeature = requiredFeatureForPath(requestUrl.pathname);
  const entitlements = resolveEntitlements(latestPlan);

  if (requiredFeature && !entitlements.features[requiredFeature]) {
    if (entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess) {
      throw redirect(`/app/billing?required=${requiredFeature}`);
    }

    const query = new URLSearchParams();
    query.set("lockedFeature", requiredFeature);
    query.set("upgradePlan", "premium");
    throw redirect(`/app/settings?${query.toString()}`);
  }

  return {
    apiKey: serverConfig.shopifyApiKey,
    isInternalAdmin: isInternalAdminSession(session),
    entitlements,
    lockedFeature: requestUrl.searchParams.get("lockedFeature") || null,
    upgradePlan: requestUrl.searchParams.get("upgradePlan") || null,
  };
};

export default function App() {
  const { apiKey, isInternalAdmin, entitlements, lockedFeature, upgradePlan } = useLoaderData<typeof loader>();
  const lockedFeatureLabel = lockedFeature
    ? FEATURE_LABELS[lockedFeature as keyof typeof FEATURE_LABELS] || lockedFeature
    : null;

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app/settings" rel="home">
          Settings
        </Link>
        <Link to="/app/billing">Billing</Link>
        {entitlements.features.subscriptionManagement ? (
          <Link to="/app/subscriptions">Subscriptions</Link>
        ) : null}
        <Link to="/app/subscription-rule">Subscription rule</Link>
        {entitlements.features.analytics ? (
          <Link to="/app/analytics">Analytics</Link>
        ) : null}
        <Link to="/app/privacy">Privacy</Link>
        {isInternalAdmin ? <Link to="/app/merchants">Merchants</Link> : null}
      </NavMenu>
      {lockedFeatureLabel ? (
        <Box padding="400">
          <Banner
            tone="warning"
            title="Not for free plan, please upgrade to premium plan."
          >
            <p>{lockedFeatureLabel} is not available on the Free plan.</p>
            {upgradePlan === "premium" ? <p>Open Billing to upgrade and unlock this feature.</p> : null}
          </Banner>
        </Box>
      ) : null}
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
