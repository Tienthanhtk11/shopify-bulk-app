import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  FormLayout,
  InlineGrid,
  InlineStack,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { FloatingToast } from "../lib/floating-toast";
import {
  getOrCreateWidgetSettings,
  updateWidgetSettings,
} from "../models/widget-settings.server";
import { assertMerchantWriteAccess } from "../services/billing.server";
import { authenticate } from "../shopify.server";

const FONT_OPTIONS = [
  {
    label: "System UI",
    value: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Trebuchet", value: '"Trebuchet MS", Verdana, sans-serif' },
  { label: "Courier", value: '"Courier New", monospace' },
];

function parseCheckbox(fd: FormData, name: string) {
  const raw = String(fd.get(name) || "").trim().toLowerCase();
  return raw === "on" || raw === "true" || raw === "1";
}

function normalizeHex(value: FormDataEntryValue | null, fallback: string) {
  const raw = String(value || "").trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw) ? raw : fallback;
}

function clampInt(
  value: FormDataEntryValue | null,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(String(value || "").trim());
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.round(parsed), min), max);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getOrCreateWidgetSettings(session.shop);

  return { settings };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin, redirect } = await authenticate.admin(request);
  await assertMerchantWriteAccess({
    session,
    redirect,
    requiredFeature: "settings",
  });
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "widget");

  if (intent === "enableBulkDiscount") {
    const functionId = "019d5fb9-d719-7a6f-973a-f71f5521a6fb";
    if (!functionId) {
      return { ok: false, error: "Không tìm thấy Function ID môi trường. Hãy khởi động lại ứng dụng." };
    }

    try {
      const response = await admin.graphql(
        `#graphql
        mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
          discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
            automaticAppDiscount {
              discountId
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
          variables: {
            automaticAppDiscount: {
              title: "SubBulk Bulk Pricing (Auto)",
              functionId,
              startsAt: new Date().toISOString(),
            },
          },
        }
      );
      
      const responseJson: any = await response.json();
      
      // Check for generic GraphQL root errors (like Access Denied/Missing Scopes)
      if (responseJson.errors && responseJson.errors.length > 0) {
        return { ok: false, error: "Lỗi GraphQL: " + responseJson.errors.map((e: any) => e.message).join(", ") };
      }

      const errors = responseJson.data?.discountAutomaticAppCreate?.userErrors;
      if (errors && errors.length > 0) {
        return { ok: false, error: "Lỗi tạo Discount: " + errors.map((e: any) => e.message).join(", ") };
      }
      return { ok: true, successMsg: "Đã kích hoạt chế độ tự động tính giá Bulk thành công trên toàn bộ cửa hàng!" };
    } catch (e: any) {
      return { ok: false, error: e.message || "Lỗi tạo discount" };
    }
  }

  if (intent === "subscriptionDiscount") {
    const dt = String(
      fd.get("defaultSubscriptionDiscountType") || "PERCENTAGE",
    );
    const dv = String(fd.get("defaultSubscriptionDiscountValue") || "").trim();
    if (dt !== "PERCENTAGE" && dt !== "FIXED") {
      return { ok: false, error: "Loại discount không hợp lệ." };
    }
    const num = Number(dv);
    if (!Number.isFinite(num) || num < 0) {
      return { ok: false, error: "Giá trị discount phải là số >= 0." };
    }
    await updateWidgetSettings(session.shop, {
      defaultSubscriptionDiscountType: dt,
      defaultSubscriptionDiscountValue: dv,
    });
    return { ok: true, discountSaved: true };
  }

  if (intent === "toggleProductPageWidget") {
    const current = await getOrCreateWidgetSettings(session.shop);
    const nextValue = !current.showWidgetOnProductPage;
    await updateWidgetSettings(session.shop, {
      showWidgetOnProductPage: nextValue,
    });
    return {
      ok: true,
      intent,
      discountSaved: false,
      successMsg: nextValue
        ? "Product page widget enabled."
        : "Product page widget disabled.",
    };
  }

  await updateWidgetSettings(session.shop, {
    showWidgetOnProductPage: parseCheckbox(fd, "showWidgetOnProductPage"),
    buyMoreHeading: String(fd.get("buyMoreHeading") || ""),
    purchaseOptionsLabel: String(fd.get("purchaseOptionsLabel") || ""),
    primaryColorHex: normalizeHex(fd.get("primaryColorHex"), "#D73C35"),
    accentGreenHex: normalizeHex(fd.get("accentGreenHex"), "#2E7D32"),
    fontFamily:
      FONT_OPTIONS.find((option) => option.value === String(fd.get("fontFamily") || ""))
        ?.value ?? FONT_OPTIONS[0].value,
    borderRadiusPx: clampInt(fd.get("borderRadiusPx"), 6, 0, 32),
    borderThicknessPx: clampInt(fd.get("borderThicknessPx"), 1, 1, 4),
    showSavingsBadge: parseCheckbox(fd, "showSavingsBadge"),
    showCompareAtPrice: parseCheckbox(fd, "showCompareAtPrice"),
    showSubscriptionDetails: parseCheckbox(fd, "showSubscriptionDetails"),
    customCssEnabled: parseCheckbox(fd, "customCssEnabled"),
    customCss: String(fd.get("customCss") || ""),
    subscriptionFooter: String(fd.get("subscriptionFooter") || ""),
    freeShippingNote: String(fd.get("freeShippingNote") || ""),
  });

  return { ok: true, discountSaved: false };
};

function PreviewCard({
  buyMoreHeading,
  purchaseOptionsLabel,
  primaryColorHex,
  accentGreenHex,
  fontFamily,
  borderRadiusPx,
  borderThicknessPx,
  showSavingsBadge,
  showCompareAtPrice,
  showSubscriptionDetails,
  subscriptionFooter,
  freeShippingNote,
}: {
  buyMoreHeading: string;
  purchaseOptionsLabel: string;
  primaryColorHex: string;
  accentGreenHex: string;
  fontFamily: string;
  borderRadiusPx: number;
  borderThicknessPx: number;
  showSavingsBadge: boolean;
  showCompareAtPrice: boolean;
  showSubscriptionDetails: boolean;
  subscriptionFooter: string;
  freeShippingNote: string;
}) {
  return (
    <div
      style={{
        border: `${borderThicknessPx}px solid ${accentGreenHex || "#D0D5DD"}`,
        borderRadius: borderRadiusPx,
        padding: 20,
        background: "#FFFFFF",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        fontFamily,
      }}
    >
      <div style={{ color: "#667085", fontSize: 13, marginBottom: 8 }}>
        {purchaseOptionsLabel || "Purchase options"}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        {buyMoreHeading || "Buy More, Save More"}
      </div>
      <div
        style={{
          border: `1px solid ${primaryColorHex || "#D73C35"}`,
          borderRadius: Math.max(borderRadiusPx - 2, 0),
          padding: 14,
          marginBottom: 12,
        }}
      >
        <InlineStack align="space-between" blockAlign="center">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Subscribe & save</div>
          {showSavingsBadge ? (
            <div
              style={{
                background: primaryColorHex || "#D73C35",
                color: "#FFFFFF",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Save 10%
            </div>
          ) : null}
        </InlineStack>
        {showCompareAtPrice ? (
          <div style={{ color: "#667085", fontSize: 13, marginBottom: 6 }}>
            <span style={{ textDecoration: "line-through", marginRight: 8 }}>$39.99</span>
            <span style={{ color: primaryColorHex || "#D73C35", fontWeight: 700 }}>
              $35.99
            </span>
          </div>
        ) : null}
        {showSubscriptionDetails ? (
          <div style={{ color: accentGreenHex || "#2E7D32", marginBottom: 4 }}>
            {freeShippingNote || "Free Shipping on all orders over $99.99"}
          </div>
        ) : null}
        <div style={{ color: "#667085", fontSize: 13 }}>
          {subscriptionFooter || "Powered by SubBulk"}
        </div>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: primaryColorHex || "#D73C35",
          opacity: 0.14,
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);

  const [defaultDiscType, setDefaultDiscType] = useState(
    settings.defaultSubscriptionDiscountType === "FIXED"
      ? "FIXED"
      : "PERCENTAGE",
  );
  const [defaultDiscValue, setDefaultDiscValue] = useState(
    settings.defaultSubscriptionDiscountValue,
  );
  const [buyMoreHeading, setBuyMoreHeading] = useState(settings.buyMoreHeading);
  const [showWidgetOnProductPage, setShowWidgetOnProductPage] = useState(
    settings.showWidgetOnProductPage,
  );
  const [purchaseOptionsLabel, setPurchaseOptionsLabel] = useState(
    settings.purchaseOptionsLabel,
  );
  const [primaryColorHex, setPrimaryColorHex] = useState(
    settings.primaryColorHex,
  );
  const [accentGreenHex, setAccentGreenHex] = useState(
    settings.accentGreenHex,
  );
  const [fontFamily, setFontFamily] = useState(settings.fontFamily);
  const [borderRadiusPx, setBorderRadiusPx] = useState(
    String(settings.borderRadiusPx),
  );
  const [borderThicknessPx, setBorderThicknessPx] = useState(
    String(settings.borderThicknessPx),
  );
  const [showSavingsBadge, setShowSavingsBadge] = useState(
    settings.showSavingsBadge,
  );
  const [showCompareAtPrice, setShowCompareAtPrice] = useState(
    settings.showCompareAtPrice,
  );
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(
    settings.showSubscriptionDetails,
  );
  const [customCssEnabled, setCustomCssEnabled] = useState(
    settings.customCssEnabled,
  );
  const [customCss, setCustomCss] = useState(settings.customCss);
  const [subscriptionFooter, setSubscriptionFooter] = useState(
    settings.subscriptionFooter,
  );
  const [freeShippingNote, setFreeShippingNote] = useState(
    settings.freeShippingNote,
  );

  useEffect(() => {
    setDefaultDiscType(
      settings.defaultSubscriptionDiscountType === "FIXED"
        ? "FIXED"
        : "PERCENTAGE",
    );
    setDefaultDiscValue(settings.defaultSubscriptionDiscountValue);
    setShowWidgetOnProductPage(settings.showWidgetOnProductPage);
    setBuyMoreHeading(settings.buyMoreHeading);
    setPurchaseOptionsLabel(settings.purchaseOptionsLabel);
    setPrimaryColorHex(settings.primaryColorHex);
    setAccentGreenHex(settings.accentGreenHex);
    setFontFamily(settings.fontFamily);
    setBorderRadiusPx(String(settings.borderRadiusPx));
    setBorderThicknessPx(String(settings.borderThicknessPx));
    setShowSavingsBadge(settings.showSavingsBadge);
    setShowCompareAtPrice(settings.showCompareAtPrice);
    setShowSubscriptionDetails(settings.showSubscriptionDetails);
    setCustomCssEnabled(settings.customCssEnabled);
    setCustomCss(settings.customCss);
    setSubscriptionFooter(settings.subscriptionFooter);
    setFreeShippingNote(settings.freeShippingNote);
  }, [settings]);

  useEffect(() => {
    if (!actionData) return;
    if ("error" in actionData && actionData.error) {
      setToast({ message: actionData.error, tone: "critical" });
      return;
    }
    if (!("ok" in actionData) || !actionData.ok) return;

    const message =
      "successMsg" in actionData && actionData.successMsg
        ? actionData.successMsg
        : "discountSaved" in actionData && actionData.discountSaved
          ? "Default subscription discount saved."
          : "Widget settings saved.";
    setToast({ message, tone: "success" });
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap="500">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}

        <InlineGrid columns={{ xs: 1, md: "1.45fr 1fr" }} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="200" inlineAlign="start">
                  <BlockStack gap="300">
                    <Text as="h1" variant="headingLg">
                      Widget styling
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Manage widget copy, colors, layout, and display behavior for
                      your storefront directly from the admin.
                    </Text>
                    <InlineStack gap="300" blockAlign="center" wrap={false}>
                      <Text as="span" variant="bodyMd" fontWeight="medium">
                        Enable widget on product page:
                      </Text>
                      <Form method="post">
                        <input type="hidden" name="intent" value="toggleProductPageWidget" />
                        <button
                          type="submit"
                          disabled={busy}
                          aria-pressed={showWidgetOnProductPage}
                          aria-label={showWidgetOnProductPage ? "Disable widget on product page" : "Enable widget on product page"}
                          style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: 999,
                            background: "#ffffff",
                            minHeight: 40,
                            padding: "6px 8px 6px 12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 12,
                            cursor: busy ? "wait" : "pointer",
                            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: "relative",
                              width: 42,
                              height: 24,
                              borderRadius: 999,
                              background: showWidgetOnProductPage ? "#15803d" : "#cbd5e1",
                              transition: "background 160ms ease",
                              flexShrink: 0,
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                top: 3,
                                left: showWidgetOnProductPage ? 21 : 3,
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "#ffffff",
                                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.24)",
                                transition: "left 160ms ease",
                              }}
                            />
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#0f172a",
                              lineHeight: 1,
                            }}
                          >
                            {showWidgetOnProductPage ? "Disable" : "Enable"}
                          </span>
                        </button>
                      </Form>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </InlineStack>

              <Form method="post">
                <BlockStack gap="400">
                  <input type="hidden" name="showWidgetOnProductPage" value={showWidgetOnProductPage ? "true" : "false"} />
                  <input type="hidden" name="showSavingsBadge" value={showSavingsBadge ? "true" : "false"} />
                  <input type="hidden" name="showCompareAtPrice" value={showCompareAtPrice ? "true" : "false"} />
                  <input type="hidden" name="showSubscriptionDetails" value={showSubscriptionDetails ? "true" : "false"} />
                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Copy & messaging
                      </Text>
                      <FormLayout>
                        <TextField
                          label="Widget heading"
                          name="buyMoreHeading"
                          value={buyMoreHeading}
                          onChange={setBuyMoreHeading}
                          autoComplete="off"
                        />
                        <TextField
                          label="Purchase options label"
                          name="purchaseOptionsLabel"
                          value={purchaseOptionsLabel}
                          onChange={setPurchaseOptionsLabel}
                          autoComplete="off"
                        />
                        <TextField
                          label="Subscription footer"
                          name="subscriptionFooter"
                          value={subscriptionFooter}
                          onChange={setSubscriptionFooter}
                          autoComplete="off"
                        />
                        <TextField
                          label="Free shipping note"
                          name="freeShippingNote"
                          value={freeShippingNote}
                          onChange={setFreeShippingNote}
                          autoComplete="off"
                        />
                      </FormLayout>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Colors
                      </Text>
                      <FormLayout>
                        <TextField
                          label="Primary accent (#hex)"
                          name="primaryColorHex"
                          value={primaryColorHex}
                          onChange={setPrimaryColorHex}
                          autoComplete="off"
                        />
                        <TextField
                          label="Border / savings color (#hex)"
                          name="accentGreenHex"
                          value={accentGreenHex}
                          onChange={setAccentGreenHex}
                          autoComplete="off"
                        />
                      </FormLayout>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Layout & typography
                      </Text>
                      <FormLayout>
                        <Select
                          label="Font family"
                          options={FONT_OPTIONS}
                          value={fontFamily}
                          onChange={setFontFamily}
                        />
                        <input type="hidden" name="fontFamily" value={fontFamily} />
                        <FormLayout.Group>
                          <TextField
                            label="Border radius (px)"
                            name="borderRadiusPx"
                            value={borderRadiusPx}
                            onChange={setBorderRadiusPx}
                            autoComplete="off"
                            type="number"
                            min={0}
                            max={32}
                          />
                          <TextField
                            label="Border thickness (px)"
                            name="borderThicknessPx"
                            value={borderThicknessPx}
                            onChange={setBorderThicknessPx}
                            autoComplete="off"
                            type="number"
                            min={1}
                            max={4}
                          />
                        </FormLayout.Group>
                      </FormLayout>
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap="300">
                      <Text as="h2" variant="headingMd">
                        Advanced CSS
                      </Text>
                      <Checkbox
                        label="Enable custom CSS"
                        name="customCssEnabled"
                        checked={customCssEnabled}
                        onChange={setCustomCssEnabled}
                      />
                      <TextField
                        label="Custom CSS"
                        name="customCss"
                        value={customCss}
                        onChange={setCustomCss}
                        autoComplete="off"
                        multiline={6}
                        helpText="Applies only to the SubBulk widget wrapper on storefront."
                      />
                    </BlockStack>
                  </Card>

                  <Button submit variant="primary" loading={busy}>
                    Save widget settings
                  </Button>
                </BlockStack>
              </Form>
            </BlockStack>
          </Card>

          <BlockStack gap="400">
            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Live preview
                </Text>
                <PreviewCard
                  buyMoreHeading={buyMoreHeading}
                  purchaseOptionsLabel={purchaseOptionsLabel}
                  primaryColorHex={primaryColorHex}
                  accentGreenHex={accentGreenHex}
                  fontFamily={fontFamily}
                  borderRadiusPx={Number(borderRadiusPx) || 6}
                  borderThicknessPx={Number(borderThicknessPx) || 1}
                  showSavingsBadge={showSavingsBadge}
                  showCompareAtPrice={showCompareAtPrice}
                  showSubscriptionDetails={showSubscriptionDetails}
                  subscriptionFooter={subscriptionFooter}
                  freeShippingNote={freeShippingNote}
                />
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Default subscription discount
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  This default value is used for storefront preview when a product has
                  not yet been mapped to a rule-specific selling plan. The real selling
                  plan discount is still managed in{" "}
                  <Link to="/app/subscription-rule">Subscription rule</Link>.
                </Text>
                <Form method="post">
                  <input
                    type="hidden"
                    name="intent"
                    value="subscriptionDiscount"
                  />
                  <BlockStack gap="300">
                    <Select
                      label="Discount type"
                      options={[
                        { label: "Percentage (%)", value: "PERCENTAGE" },
                        { label: "Fixed amount", value: "FIXED" },
                      ]}
                      value={defaultDiscType}
                      onChange={setDefaultDiscType}
                    />
                    <input
                      type="hidden"
                      name="defaultSubscriptionDiscountType"
                      value={defaultDiscType}
                    />
                    <TextField
                      label="Discount value"
                      name="defaultSubscriptionDiscountValue"
                      value={defaultDiscValue}
                      onChange={setDefaultDiscValue}
                      autoComplete="off"
                      type="number"
                      min={0}
                      step={0.01}
                    />
                    <Button submit loading={busy}>
                      Save default discount
                    </Button>
                  </BlockStack>
                </Form>
              </BlockStack>
            </Card>

            <div
              style={{
                border: "2px solid #0f766e",
                borderRadius: 16,
                boxShadow: "0 14px 30px rgba(15, 118, 110, 0.12)",
              }}
            >
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="h2" variant="headingMd">
                      Backend Configuration (Bulk Pricing)
                    </Text>
                    <Box
                      background="bg-surface-success"
                      paddingInline="200"
                      paddingBlock="100"
                      borderRadius="200"
                    >
                      <Text as="span" variant="bodySm" tone="success">
                        Required
                      </Text>
                    </Box>
                  </InlineStack>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Enable the app's Shopify Function so bulk pricing is applied at cart and checkout, including storefront orders that also use subscription selling plans.
                  </Text>
                  <Box paddingBlockStart="100">
                    <Form method="post">
                      <input type="hidden" name="intent" value="enableBulkDiscount" />
                      <Button submit loading={busy} variant="primary">
                        Enable Backend Bulk Pricing
                      </Button>
                    </Form>
                  </Box>
                </BlockStack>
              </Card>
            </div>

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Placement note
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Put the widget inside the product information area, above the buy
                  buttons, so the storefront layout matches the preview and checkout
                  flow.
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Add the SubBulk block from the theme editor inside your product
                  information section when you want the widget to appear on the
                  storefront.
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
