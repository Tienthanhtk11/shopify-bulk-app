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
import { useEffect, useMemo, useState } from "react";
import widgetRuntimeSource from "../lib/subbulk-widget-runtime.js?raw";
import widgetStylesSource from "../../extensions/subbulk-buy-box/assets/subbulk-widget.css?raw";
import { FloatingToast } from "../lib/floating-toast";
import {
  getOrCreateWidgetSettings,
  updateWidgetSettings,
} from "../models/widget-settings.server";
import { assertMerchantWriteAccess } from "../services/billing.server";
import { resolveWidgetRenderState, scopeWidgetCss } from "../services/widget-storefront.shared";
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

function escapeForInlineScript(value: string) {
  return value.replace(/<\//g, "<\\/").replace(/</g, "\\u003c");
}

function buildWidgetPreviewPayload(input: {
  showWidgetOnProductPage: boolean;
  buyMoreHeading: string;
  purchaseOptionsLabel: string;
  primaryColorHex: string;
  accentGreenHex: string;
  fontFamily: string;
  borderRadiusPx: string;
  borderThicknessPx: string;
  showSavingsBadge: boolean;
  showCompareAtPrice: boolean;
  showSubscriptionDetails: boolean;
  customCssEnabled: boolean;
  customCss: string;
  subscriptionFooter: string;
  freeShippingNote: string;
  defaultDiscType: string;
  defaultDiscValue: string;
}) {
  const discountValue = Number(input.defaultDiscValue);
  const safeDiscountValue = Number.isFinite(discountValue) && discountValue >= 0 ? discountValue : 0;
  const renderState = resolveWidgetRenderState({
    showWidgetOnProductPage: input.showWidgetOnProductPage,
    widgetEnabledForProduct: true,
    productHasSubscriptionPlan: true,
  });

  return {
    ok: true,
    preview: input.defaultDiscType === "FIXED"
      ? {
          discountMode: "fixed",
          subscriptionPercent: 0,
          subscriptionFixed: safeDiscountValue,
        }
      : {
          discountMode: "percent",
          subscriptionPercent: safeDiscountValue,
          subscriptionFixed: 0,
        },
    widgetSettings: {
      isEnabled: renderState.isEnabled,
      showWidgetOnProductPage: renderState.showWidgetOnProductPage,
      widgetEnabledForProduct: renderState.widgetEnabledForProduct,
      productHasSubscriptionPlan: renderState.productHasSubscriptionPlan,
      buyMoreHeading: input.buyMoreHeading,
      purchaseOptionsLabel: input.purchaseOptionsLabel,
      primaryColorHex: input.primaryColorHex,
      accentGreenHex: input.accentGreenHex,
      fontFamily: input.fontFamily,
      borderRadiusPx: Number(input.borderRadiusPx) || 6,
      borderThicknessPx: Number(input.borderThicknessPx) || 1,
      showSavingsBadge: input.showSavingsBadge,
      showCompareAtPrice: input.showCompareAtPrice,
      showSubscriptionDetails: input.showSubscriptionDetails,
      customCssEnabled: input.customCssEnabled,
      customCss: scopeWidgetCss(input.customCss),
      subscriptionFooter: input.subscriptionFooter,
      freeShippingNote: input.freeShippingNote,
    },
  };
}

function buildWidgetPreviewConfig(previewPayload: ReturnType<typeof buildWidgetPreviewPayload>) {
  return {
    productId: "1001",
    moneyFormat: "${{amount}}",
    currency: "USD",
    variantId: "401",
    variantUnitPrice: 39.99,
    variantPrices: [
      { id: "401", price: 39.99 },
      { id: "402", price: 49.99 },
    ],
    bulkTiers: [
      { qtyBreakpoint: 1, bulkPrice: 39.99, priceAfterDiscount: 39.99 },
      { qtyBreakpoint: 3, bulkPrice: 37.49, priceAfterDiscount: 37.49 },
      { qtyBreakpoint: 6, bulkPrice: 33.99, priceAfterDiscount: 33.99 },
    ],
    sellingPlanGroups: [
      {
        id: "mock-group-1",
        name: "Subscribe & save",
        plans: [
          { id: "mock-plan-monthly", name: "Monthly subscription" },
          { id: "mock-plan-2weeks", name: "2 week subscription" },
        ],
      },
    ],
    subscriptionAllocations: {
      "401": {
        "mock-plan-monthly": { checkout: 35.99, compareAt: 39.99 },
        "mock-plan-2weeks": { checkout: 34.49, compareAt: 39.99 },
      },
      "402": {
        "mock-plan-monthly": { checkout: 44.99, compareAt: 49.99 },
        "mock-plan-2weeks": { checkout: 42.99, compareAt: 49.99 },
      },
    },
    discountMode: previewPayload.preview.discountMode,
    subscriptionPercent: previewPayload.preview.subscriptionPercent,
    subscriptionFixed: previewPayload.preview.subscriptionFixed,
    previewData: previewPayload,
  };
}

function buildWidgetPreviewDocument(config: ReturnType<typeof buildWidgetPreviewConfig>) {
  const serializedConfig = escapeForInlineScript(JSON.stringify(config));
  const serializedStyles = widgetStylesSource.replace(/<\//g, "<\\/");
  const serializedRuntime = widgetRuntimeSource.replace(/<\//g, "<\\/");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        background: #ffffff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #0f172a;
      }
      .preview-shell {
        padding: 8px;
      }
      .preview-product {
        max-width: 100%;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 8px;
      }
      .price.price--large,
      .product-form__input {
        margin-bottom: 0;
      }
      .price__container {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .price-item--regular {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
      }
      .price-item--compare {
        font-size: 16px;
        color: #94a3b8;
        text-decoration: line-through;
      }
      .product-form__group,
      .product-form__buttons {
        display: grid;
        gap: 12px;
      }
      .preview-form-support {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      }
      .product-form__buttons button {
        height: 46px;
        border: 0;
        border-radius: 999px;
        background: #0f172a;
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }
      .product-form__input fieldset {
        margin: 0;
        padding: 14px;
        border: 1px solid #dbe2ea;
        border-radius: 14px;
      }
      .product-form__input legend {
        padding: 0 6px;
        font-size: 12px;
        color: #475569;
      }
      .preview-variant-select {
        width: 100%;
        height: 42px;
        border-radius: 12px;
        border: 1px solid #cbd5e1;
        padding: 0 12px;
        background: #fff;
      }
      ${serializedStyles}
    </style>
  </head>
  <body>
    <div class="preview-shell">
      <div class="preview-product" data-product-id="1001">
        <div class="price price--large" role="status">
          <div class="price__container">
            <span class="price-item price-item--regular" data-subbulk-main-price>$39.99</span>
            <span class="price-item price-item--compare">$49.99</span>
          </div>
        </div>
        <div class="product-form__input preview-form-support">
          <fieldset>
            <legend>Purchase options</legend>
            <label><input type="radio" checked /> One-time purchase</label>
            <label><input type="radio" /> Subscribe &amp; save</label>
          </fieldset>
        </div>
        <form action="/cart/add" method="post">
          <div class="product-form__group preview-form-support">
            <select class="preview-variant-select" name="id">
              <option value="401">Standard / $39.99</option>
              <option value="402">Large / $49.99</option>
            </select>
            <input type="number" name="quantity" value="1" min="1" />
          </div>
          <div id="subbulk-root-settings-preview" class="subbulk-root" data-subbulk-config-id="subbulk-config-settings-preview"></div>
          <div class="product-form__buttons preview-form-support">
            <button type="submit">Add to cart</button>
          </div>
        </form>
      </div>
    </div>
    <script type="application/json" id="subbulk-config-settings-preview">${serializedConfig}</script>
    <script>${serializedRuntime}</script>
    <script>
      (function () {
        function sendHeight() {
          var body = document.body;
          var doc = document.documentElement;
          var height = Math.max(
            body ? body.scrollHeight : 0,
            doc ? doc.scrollHeight : 0,
            body ? body.offsetHeight : 0,
            doc ? doc.offsetHeight : 0
          );
          window.parent.postMessage({ type: "subbulk-settings-preview-height", height: height }, "*");
        }

        if (typeof ResizeObserver !== "undefined") {
          var observer = new ResizeObserver(sendHeight);
          observer.observe(document.body);
          observer.observe(document.documentElement);
        }

        window.addEventListener("load", sendHeight);
        window.addEventListener("click", function () {
          window.setTimeout(sendHeight, 0);
        });
        window.addEventListener("change", function () {
          window.setTimeout(sendHeight, 0);
        });
        window.setTimeout(sendHeight, 60);
        window.setTimeout(sendHeight, 220);
      })();
    </script>
  </body>
</html>`;
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
  const [previewHeight, setPreviewHeight] = useState(700);
  const previewPayload = useMemo(
    () => buildWidgetPreviewPayload({
      showWidgetOnProductPage,
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
      customCssEnabled,
      customCss,
      subscriptionFooter,
      freeShippingNote,
      defaultDiscType,
      defaultDiscValue,
    }),
    [
      accentGreenHex,
      borderRadiusPx,
      borderThicknessPx,
      buyMoreHeading,
      customCss,
      customCssEnabled,
      defaultDiscType,
      defaultDiscValue,
      fontFamily,
      freeShippingNote,
      primaryColorHex,
      purchaseOptionsLabel,
      showCompareAtPrice,
      showSavingsBadge,
      showSubscriptionDetails,
      showWidgetOnProductPage,
      subscriptionFooter,
    ],
  );
  const previewFrameDocument = useMemo(
    () => buildWidgetPreviewDocument(buildWidgetPreviewConfig(previewPayload)),
    [previewPayload],
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

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== "object" || data.type !== "subbulk-settings-preview-height") {
        return;
      }

      const nextHeight = Number(data.height);
      if (!Number.isFinite(nextHeight) || nextHeight <= 0) {
        return;
      }

      setPreviewHeight(Math.max(420, Math.min(Math.ceil(nextHeight), 760)));
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
                        Display options
                      </Text>
                      <Checkbox
                        label="Show savings badge"
                        checked={showSavingsBadge}
                        onChange={setShowSavingsBadge}
                      />
                      <Checkbox
                        label="Show compare-at price"
                        checked={showCompareAtPrice}
                        onChange={setShowCompareAtPrice}
                      />
                      <Checkbox
                        label="Show subscription details and shipping note"
                        checked={showSubscriptionDetails}
                        onChange={setShowSubscriptionDetails}
                      />
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
                        helpText="Selectors are automatically scoped under .subbulk before being injected on the storefront."
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
                <Text as="p" variant="bodySm" tone="subdued">
                  This preview runs the same storefront runtime and the same config plus app-proxy payload shape used by the theme block. It assumes the preview product is already widget-enabled and has an active subscription plan.
                </Text>
                <div
                  style={{
                    border: "1px solid #dbe2ea",
                    borderRadius: 18,
                    overflow: "hidden",
                    background: "#ffffff",
                  }}
                >
                  <iframe
                    title="SubBulk storefront runtime preview"
                    srcDoc={previewFrameDocument}
                    style={{
                      width: "100%",
                      height: previewHeight,
                      border: 0,
                      display: "block",
                      background: "#ffffff",
                    }}
                    sandbox="allow-scripts allow-forms allow-same-origin"
                  />
                </div>
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
