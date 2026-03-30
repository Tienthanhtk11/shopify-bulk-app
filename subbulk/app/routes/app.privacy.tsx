import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  FormLayout,
  InlineStack,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import {
  createDeletionRequest,
  getLatestDeletionRequest,
  getMerchantByShopDomain,
  upsertMerchantFromSession,
} from "../models/merchant.server";
import { authenticate } from "../shopify.server";

type ActionData =
  | { ok: true; message: string }
  | { ok: false; error: string };

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
  const confirmed = formData.get("confirmed") === "on";
  const confirmText = String(formData.get("confirmText") || "").trim();
  const expectedValues = [session.shop, "DELETE"];

  if (!confirmed) {
    return { ok: false, error: "Ban can xac nhan rang hanh dong nay khong the hoan tac." } satisfies ActionData;
  }

  if (!expectedValues.includes(confirmText)) {
    return {
      ok: false,
      error: `Nhap chinh xac \"${session.shop}\" hoac \"DELETE\" de tiep tuc.`,
    } satisfies ActionData;
  }

  await createDeletionRequest({
    shopDomain: session.shop,
    requestedBy: session.email ?? session.shop,
    source: "app.privacy",
  });

  return {
    ok: true,
    message: "Yeu cau xoa du lieu da duoc ghi nhan va dua vao hang doi xu ly. Metadata toi thieu ve install va billing van duoc giu lai.",
  } satisfies ActionData;
};

export default function PrivacyPage() {
  const { merchant, latestRequest, shop } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const isSubmitting = navigation.state === "submitting";

  return (
    <Page>
      <TitleBar title="Privacy & data deletion" />
      <BlockStack gap="500">
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

        {actionData ? (
          <Banner tone={actionData.ok ? "success" : "critical"}>
            <p>{actionData.ok ? actionData.message : actionData.error}</p>
          </Banner>
        ) : null}

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

            <Form method="post">
              <FormLayout>
                <Checkbox
                  label="I understand that this action permanently deletes app operational data."
                  checked={confirmed}
                  onChange={setConfirmed}
                  name="confirmed"
                />
                <TextField
                  label={`Type ${shop} or DELETE to confirm`}
                  autoComplete="off"
                  value={confirmText}
                  onChange={setConfirmText}
                  name="confirmText"
                />
                <InlineStack align="end">
                  <Button submit tone="critical" loading={isSubmitting}>
                    Request deletion of app-stored data
                  </Button>
                </InlineStack>
              </FormLayout>
            </Form>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}