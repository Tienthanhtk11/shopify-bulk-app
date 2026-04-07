import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { FloatingToast } from "../lib/floating-toast";
import {
  getMerchantDetailById,
  processDeletionRequestById,
  upsertMerchantFromSession,
} from "../models/merchant.server";
import { assertInternalAdminSession } from "../services/internal-admin.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  assertInternalAdminSession(session);

  const merchantId = params.merchantId;
  if (!merchantId) {
    throw new Response("Not Found", { status: 404 });
  }

  const merchant = await getMerchantDetailById(merchantId);
  if (!merchant) {
    throw new Response("Not Found", { status: 404 });
  }

  return { merchant };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  assertInternalAdminSession(session);

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  if (intent !== "processDeletionRequest") {
    return { ok: false, error: "Unsupported action." };
  }

  const requestId = String(formData.get("requestId") || "").trim();
  if (!requestId) {
    return { ok: false, error: "Missing deletion request id." };
  }

  await processDeletionRequestById(requestId, "internal_admin");
  return { ok: true, message: "Deletion request processed." };
};

export default function MerchantDetailPage() {
  const { merchant } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);

  useEffect(() => {
    if (!actionData) return;
    setToast({
      message: actionData.ok ? actionData.message : actionData.error,
      tone: actionData.ok ? "success" : "critical",
    });
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <Page>
      <TitleBar title={merchant.shopDomain} />
      <BlockStack gap="500">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}

        <InlineGrid columns={{ xs: 1, md: 3 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Merchant status
              </Text>
              <Text as="p" variant="headingLg">
                {merchant.status}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Installed at
              </Text>
              <Text as="p" variant="headingLg">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(merchant.installedAt))}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Last seen
              </Text>
              <Text as="p" variant="headingLg">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(merchant.lastSeenAt))}
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Billing plans
            </Text>
            {merchant.plans.length === 0 ? (
              <Text as="p" variant="bodyMd" tone="subdued">
                No plan history yet.
              </Text>
            ) : (
              merchant.plans.map((plan) => (
                <InlineStack key={plan.id} align="space-between">
                  <Text as="span" variant="bodyMd">
                    {plan.planName}
                  </Text>
                  <Badge>{plan.status}</Badge>
                </InlineStack>
              ))
            )}
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Deletion requests
            </Text>
            {merchant.deletionRequests.length === 0 ? (
              <Text as="p" variant="bodyMd" tone="subdued">
                No deletion requests found.
              </Text>
            ) : (
              merchant.deletionRequests.map((request) => (
                <Card key={request.id}>
                  <InlineGrid columns={{ xs: 1, md: "2fr 1fr 140px" }} gap="300">
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd">
                        Requested by {request.requestedBy}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.createdAt))}
                      </Text>
                    </BlockStack>
                    <InlineStack align="start">
                      <Badge tone={request.status === "completed" ? "success" : request.status === "failed" ? "critical" : "attention"}>
                        {request.status}
                      </Badge>
                    </InlineStack>
                    <InlineStack align="end">
                      {request.status === "pending" ? (
                        <Form method="post">
                          <input type="hidden" name="intent" value="processDeletionRequest" />
                          <input type="hidden" name="requestId" value={request.id} />
                          <Button submit loading={isSubmitting}>
                            Process now
                          </Button>
                        </Form>
                      ) : null}
                    </InlineStack>
                  </InlineGrid>
                </Card>
              ))
            )}
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Event log
            </Text>
            {merchant.events.length === 0 ? (
              <Text as="p" variant="bodyMd" tone="subdued">
                No events found.
              </Text>
            ) : (
              merchant.events.map((event) => (
                <InlineGrid key={event.id} columns={{ xs: 1, md: "1fr 120px 180px" }} gap="300">
                  <Text as="span" variant="bodyMd">
                    {event.type}
                  </Text>
                  <Badge>{event.source}</Badge>
                  <Text as="span" variant="bodySm" tone="subdued">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.createdAt))}
                  </Text>
                </InlineGrid>
              ))
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}