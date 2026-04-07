import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  FormLayout,
  InlineStack,
  Modal,
  Page,
  Text,
} from "@shopify/polaris";
import { useEffect, useRef, useState } from "react";
import {
  createAndProcessDeletionRequest,
  getLatestDeletionRequest,
  getMerchantByShopDomain,
  recordMerchantEvent,
  upsertMerchantFromSession,
} from "../models/merchant.server";
import { FloatingToast } from "../lib/floating-toast";
import { authenticate } from "../shopify.server";

type ActionData =
  | { ok: true; message: string; redirectUrl: string }
  | { ok: false; error: string };

const APP_UNINSTALL_API_VERSION = "2025-07";

const APP_UNINSTALL_MUTATION = `#graphql
  mutation AppUninstall {
    appUninstall {
      app {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const merchant = await getMerchantByShopDomain(session.shop);
  const latestRequest = await getLatestDeletionRequest(session.shop);

  return {
    merchant,
    latestRequest,
    shop: session.shop,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "").trim();

  if (intent !== "delete_and_uninstall") {
    return { ok: false, error: "Unsupported privacy action." } satisfies ActionData;
  }

  await createAndProcessDeletionRequest({
    shopDomain: session.shop,
    requestedBy: session.email ?? session.shop,
    source: "app.privacy",
  });

  const accessToken = (session as { accessToken?: string | null }).accessToken ?? null;
  if (!accessToken) {
    return {
      ok: false,
      error: "Unable to uninstall app because the authenticated admin access token is unavailable.",
    } satisfies ActionData;
  }

  let payload: any;
  try {
    const response = await fetch(
      `https://${session.shop}/admin/api/${APP_UNINSTALL_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({ query: APP_UNINSTALL_MUTATION }),
      },
    );
    payload = await response.json();
  } catch (error) {
    await recordMerchantEvent({
      shopDomain: session.shop,
      type: "merchant.app_uninstall.failed",
      source: "app.privacy",
      severity: "error",
      payload: {
        message: error instanceof Error ? error.message : "Unknown uninstall request error",
      },
    });

    return {
      ok: false,
      error: "Data deletion completed, but the app uninstall request could not be sent to Shopify.",
    } satisfies ActionData;
  }

  const rootErrors = Array.isArray(payload?.errors) ? payload.errors : [];
  const uninstall = payload?.data?.appUninstall;
  const userErrors = Array.isArray(uninstall?.userErrors) ? uninstall.userErrors : [];

  if (rootErrors.length > 0 || userErrors.length > 0) {
    const message = [
      ...rootErrors.map((error: { message?: string }) => error.message || "Unknown GraphQL error"),
      ...userErrors.map((error: { message?: string }) => error.message || "Unknown uninstall error"),
    ][0] || "Unable to uninstall app after data deletion.";

    await recordMerchantEvent({
      shopDomain: session.shop,
      type: "merchant.app_uninstall.failed",
      source: "app.privacy",
      severity: "error",
      payload: { message },
    });

    return { ok: false, error: message } satisfies ActionData;
  }

  await recordMerchantEvent({
    shopDomain: session.shop,
    type: "merchant.app_uninstall.requested",
    source: "app.privacy",
    payload: { appId: uninstall?.app?.id ?? null },
  });

  return {
    ok: true,
    message: "App operational data deleted. App uninstall has been initiated. Redirecting back to Shopify admin.",
    redirectUrl: `https://${session.shop}/admin/apps`,
  } satisfies ActionData;
};

export default function PrivacyPage() {
  const { merchant, latestRequest, shop } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!actionData) return;
    setConfirmModalOpen(false);
    if (!actionData.ok) {
      setToast({ message: actionData.error, tone: "critical" });
      return;
    }
    setToast({ message: actionData.message, tone: "success" });
    if (typeof window === "undefined") return;

    const targetWindow = window.top ?? window;
    targetWindow.location.href = actionData.redirectUrl;
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <Page>
      <TitleBar title="Privacy & data deletion" />
      <BlockStack gap="500">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}
        <Card>
          <BlockStack gap="200">
            <Text as="h1" variant="headingLg">
              Privacy controls
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              Merchant: {merchant?.shopDomain ?? shop}
            </Text>
            <Text as="p" variant="bodyMd">
              You can request deletion of operational data stored by the app. This removes app configuration and internal working data, but minimal install and billing metadata are retained for reconciliation, support, and legal obligations.
            </Text>
          </BlockStack>
        </Card>
        {latestRequest ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Latest deletion request
              </Text>
              <Text as="p" variant="bodyMd">
                Status: {latestRequest.status}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Requested at: {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(latestRequest.createdAt))}
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Danger zone
              </Text>
              <Box background="bg-fill-critical" paddingInline="200" paddingBlock="100" borderRadius="200">
                <Text as="span" variant="bodySm" tone="text-inverse">
                  Irreversible
                </Text>
              </Box>
            </InlineStack>

            <BlockStack gap="100">
              <Text as="p" variant="bodyMd">
                Data that will be deleted:
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Widget settings, widget-enabled products, subscription rules, subscription offers, and internal operational data.
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <Text as="p" variant="bodyMd">
                Data that will be retained at minimum:
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Install and uninstall history, plan and billing metadata, and audit records required for reconciliation and legal obligations.
              </Text>
            </BlockStack>

            <Form method="post" ref={formRef}>
              <FormLayout>
                <input type="hidden" name="intent" value="delete_and_uninstall" />
                <Text as="p" variant="bodyMd">
                  When you continue, SubBulk will permanently delete app operational data for this merchant and then uninstall itself from the store.
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Shopify will keep only the minimum uninstall metadata required by the platform. After confirmation, the app closes immediately and the uninstall webhook will finalize merchant status cleanup.
                </Text>
                <InlineStack align="end">
                  <Button tone="critical" loading={isSubmitting} onClick={() => setConfirmModalOpen(true)}>
                    Request deletion of app-stored data
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </BlockStack>
        </Card>

        <Modal
          open={confirmModalOpen}
          onClose={() => {
            if (isSubmitting) return;
            setConfirmModalOpen(false);
          }}
          title="Delete app data and uninstall app?"
          primaryAction={{
            content: "Delete data and uninstall",
            destructive: true,
            loading: isSubmitting,
            onAction: () => formRef.current?.requestSubmit(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              disabled: isSubmitting,
              onAction: () => setConfirmModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd">
                This action is irreversible. SubBulk will delete widget settings, widget-enabled products, subscription rules, subscription offers, and internal operational data for {merchant?.shopDomain ?? shop}.
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                If you confirm, the app will immediately request uninstall from Shopify after the deletion finishes.
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>
      </BlockStack>
    </Page>
  );
}