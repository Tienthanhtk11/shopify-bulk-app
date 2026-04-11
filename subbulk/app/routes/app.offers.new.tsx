import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  BlockStack,
  Text,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { FloatingToast } from "../lib/floating-toast";
import { authenticate } from "../shopify.server";
import { getOrCreateWidgetSettings } from "../models/widget-settings.server";
import { createOfferWithSellingPlans } from "../models/subscription-offer.server";
import { assertMerchantWriteAccess } from "../services/billing.server";

const DEFAULT_INTERVALS = [
  { interval: "WEEK" as const, intervalCount: 1, label: "1 week" },
  { interval: "MONTH" as const, intervalCount: 1, label: "1 month" },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const ws = await getOrCreateWidgetSettings(session.shop);
  const defaultDiscountType =
    ws.defaultSubscriptionDiscountType === "FIXED" ? "FIXED" : "PERCENTAGE";
  return {
    defaultIntervalsJson: JSON.stringify(DEFAULT_INTERVALS),
    defaultDiscountType,
    defaultDiscountValue: ws.defaultSubscriptionDiscountValue || "10",
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, redirect } = await authenticate.admin(request);
  await assertMerchantWriteAccess({
    session,
    redirect,
    requiredFeature: "advancedOffers",
  });
  const fd = await request.formData();
  const title = String(fd.get("title") || "").trim();
  const productGid = String(fd.get("productGid") || "").trim();
  const discountType = String(fd.get("discountType") || "PERCENTAGE") as
    | "PERCENTAGE"
    | "FIXED";
  const discountValue = Number(fd.get("discountValue"));
  const intervalsJson = String(fd.get("intervalsJson") || "[]");

  if (!title || !productGid.startsWith("gid://shopify/Product/")) {
    return { error: "Title and Product GID (gid://shopify/Product/...) are required." };
  }
  if (!Number.isFinite(discountValue) || discountValue < 0) {
    return { error: "Discount value is invalid." };
  }
  let planIntervals;
  try {
    planIntervals = JSON.parse(intervalsJson);
    if (!Array.isArray(planIntervals) || planIntervals.length === 0) {
      return { error: "At least one interval is required in the intervals JSON." };
    }
  } catch {
    return { error: "Intervals JSON is invalid." };
  }

  try {
    await createOfferWithSellingPlans(admin, session.shop, {
      title,
      productGid,
      discountType,
      discountValue,
      planIntervals,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return { error: msg };
  }

  return redirect("/app/offers");
};

export default function NewOffer() {
  const {
    defaultIntervalsJson,
    defaultDiscountType,
    defaultDiscountValue,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);

  const [title, setTitle] = useState("");
  const [productGid, setProductGid] = useState("");
  const [discountType, setDiscountType] = useState(defaultDiscountType);
  const [discountValue, setDiscountValue] = useState(defaultDiscountValue);
  const [intervalsJson, setIntervalsJson] = useState(defaultIntervalsJson);

  useEffect(() => {
    if (!actionData?.error) return;
    setToast({ message: actionData.error, tone: "critical" });
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const pickProduct = useCallback(() => {
    const w = window as unknown as {
      shopify?: { resourcePicker: (opts: unknown) => Promise<unknown> };
    };
    const picker = w.shopify?.resourcePicker;
    if (!picker) {
      alert("Open the app inside Shopify Admin to use the Resource Picker.");
      return;
    }
    void (async () => {
      try {
        const selected = (await picker({
          type: "product",
          multiple: false,
        })) as { id?: string }[] | null;
        const first = selected?.[0];
        if (first?.id) setProductGid(first.id);
      } catch {
        /* user cancelled */
      }
    })();
  }, []);

  return (
    <Page backAction={{ url: "/app/offers" }}>
      <TitleBar title="Create Subscription Offer" />
      <BlockStack gap="400">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}
        <Banner tone="info" title="Recommendation">
          <p>
            In most cases, use{" "}
            <Link to="/app/subscription-rule">Subscription Setup</Link> (rule →
            product list → shared selling plan). Use this page only when you need{" "}
            <strong>one</strong> selling plan group for <strong>one</strong>{" "}
            product (legacy flow).
          </p>
        </Banner>
        <Card>
          <Form method="post">
            <FormLayout>
              <input type="hidden" name="discountType" value={discountType} />
              <TextField
                label="Offer name"
                name="title"
                value={title}
                onChange={setTitle}
                autoComplete="off"
                requiredIndicator
              />
              <input type="hidden" name="productGid" value={productGid} />
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Selected product: {productGid || "—"}
                </Text>
                <Button type="button" onClick={pickProduct}>
                  Select product (Resource Picker)
                </Button>
              </BlockStack>
              <Select
                label="Subscription discount type"
                options={[
                  { label: "Percentage (%)", value: "PERCENTAGE" },
                  { label: "Fixed amount (per cycle / fulfillment in Shopify)", value: "FIXED" },
                ]}
                value={discountType}
                onChange={setDiscountType}
              />
              <TextField
                label={
                  discountType === "PERCENTAGE"
                    ? "Discount percentage"
                    : "Discount amount (decimal)"
                }
                name="discountValue"
                type="number"
                value={discountValue}
                onChange={setDiscountValue}
                autoComplete="off"
                min={0}
                step={0.01}
                requiredIndicator
              />
              <TextField
                label="Plan intervals (JSON)"
                name="intervalsJson"
                value={intervalsJson}
                onChange={setIntervalsJson}
                multiline={4}
                autoComplete="off"
                helpText='Example: [{"interval":"WEEK","intervalCount":1,"label":"1 week"}]'
              />
              <Button variant="primary" submit loading={busy}>
                Create in Shopify
              </Button>
            </FormLayout>
          </Form>
        </Card>
      </BlockStack>
    </Page>
  );
}
