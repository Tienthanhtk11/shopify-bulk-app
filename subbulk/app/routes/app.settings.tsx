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
import { productTemplateMainSectionBlockEditorUrl } from "../lib/theme-editor-url.server";
import {
  getOrCreateWidgetSettings,
  updateWidgetSettings,
} from "../models/widget-settings.server";
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
  return fd.get(name) === "on";
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
  const apiKey = process.env.SHOPIFY_API_KEY ?? "";
  const themeEditorUrl =
    apiKey.length > 0
      ? productTemplateMainSectionBlockEditorUrl(session.shop, apiKey, "buy-box")
      : null;

  return { settings, themeEditorUrl };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "widget");

  if (intent === "enableBulkDiscount") {
    const functionId = "019d30e2-4e04-76df-8966-381d63b24940";
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

  await updateWidgetSettings(session.shop, {
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
  const { settings, themeEditorUrl } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  const [defaultDiscType, setDefaultDiscType] = useState(
    settings.defaultSubscriptionDiscountType === "FIXED"
      ? "FIXED"
      : "PERCENTAGE",
  );
  const [defaultDiscValue, setDefaultDiscValue] = useState(
    settings.defaultSubscriptionDiscountValue,
  );
  const [buyMoreHeading, setBuyMoreHeading] = useState(settings.buyMoreHeading);
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

  return (
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap="500">
        {actionData && "error" in actionData && actionData.error ? (
          <Banner tone="critical" title="Lỗi">
            <p>{actionData.error}</p>
          </Banner>
        ) : null}
        {actionData && "ok" in actionData && actionData.ok ? (
          <Banner
            tone="success"
            title={
              "successMsg" in actionData && actionData.successMsg
                ? actionData.successMsg
                : "discountSaved" in actionData && actionData.discountSaved
                ? "Đã lưu default subscription discount."
                : "Đã lưu widget settings."
            }
          />
        ) : null}

        <InlineGrid columns={{ xs: 1, md: "1.45fr 1fr" }} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h1" variant="headingLg">
                    Widget styling
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Quan ly text, mau sac, layout, va display rules cho widget
                    storefront tu admin.
                  </Text>
                </BlockStack>
                {themeEditorUrl ? (
                  <Button url={themeEditorUrl} target="_blank" variant="primary">
                    Open theme editor
                  </Button>
                ) : null}
              </InlineStack>

              <Form method="post">
                <BlockStack gap="400">
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
                        Display options
                      </Text>
                      <BlockStack gap="200">
                        <Checkbox
                          label="Show savings badge"
                          name="showSavingsBadge"
                          checked={showSavingsBadge}
                          onChange={setShowSavingsBadge}
                        />
                        <Checkbox
                          label="Show compare-at price"
                          name="showCompareAtPrice"
                          checked={showCompareAtPrice}
                          onChange={setShowCompareAtPrice}
                        />
                        <Checkbox
                          label="Show subscription details"
                          name="showSubscriptionDetails"
                          checked={showSubscriptionDetails}
                          onChange={setShowSubscriptionDetails}
                        />
                      </BlockStack>
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

            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Backend Configuration (Bulk Pricing)
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Để tính năng Mua nhiều giảm giá hoạt động chính xác trong quá trình Checkout (kết hợp với Subscriptions), bạn cần kích hoạt Shopify Function của app.
                  Nhấn nút bên dưới để tạo Automatic Discount gán với hệ thống.
                </Text>
                <Box paddingBlockStart="100">
                  <Form method="post">
                    <input type="hidden" name="intent" value="enableBulkDiscount" />
                    <Button submit loading={busy}>
                      Kích hoạt Bulk Discount (Backend)
                    </Button>
                  </Form>
                </Box>
              </BlockStack>
            </Card>

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
                <Box paddingBlockStart="100">
                  {themeEditorUrl ? (
                    <Button url={themeEditorUrl} target="_blank">
                      Open product template editor
                    </Button>
                  ) : (
                    <Text as="p" variant="bodySm" tone="subdued">
                      Configure `SHOPIFY_API_KEY` to show the deep link to the theme
                      editor.
                    </Text>
                  )}
                </Box>
              </BlockStack>
            </Card>
          </BlockStack>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
