import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  FormLayout,
  InlineGrid,
  InlineStack,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import prisma from "../db.server";
import { FloatingToast } from "../lib/floating-toast";
import { fetchProductBulkPricingJson } from "../lib/shopify-metafields.server";
import { authenticate } from "../shopify.server";
import { assertMerchantWriteAccess } from "../services/billing.server";
import { getOrCreateWidgetSettings } from "../models/widget-settings.server";
import type { PlanIntervalConfig } from "../models/subscription-offer.server";
import {
  createShopifyGroupForRule,
  deleteSellingPlanGroupOnShopify,
  getSubscriptionRule,
  parseExplicitGids,
  syncRuleProductsOnShopify,
} from "../models/subscription-rule.server";
import {
  addWidgetEnabledProduct,
  isWidgetEnabledForProduct,
  listWidgetEnabledProducts,
  saveProductBulkPricing,
  syncWidgetEnabledProducts,
} from "../models/widget-enabled-product.server";

type SellingPlanDraft = {
  id: string;
  name: string;
  label: string;
  interval: PlanIntervalConfig["interval"];
  intervalCount: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  description: string;
};

const DEFAULT_INTERVALS: PlanIntervalConfig[] = [
  {
    interval: "MONTH",
    intervalCount: 1,
    label: "month",
    name: "Monthly subscription",
    discountType: "PERCENTAGE",
    discountValue: 10,
  },
  {
    interval: "WEEK",
    intervalCount: 2,
    label: "2 weeks",
    name: "2 week subscription",
    discountType: "PERCENTAGE",
    discountValue: 10,
  },
];

function resolveInitialProductGids(
  rule: Awaited<ReturnType<typeof getSubscriptionRule>>,
  widgetProductGids: string[],
): string[] {
  if (!rule) return [];
  if (rule.productScope === "EXPLICIT") {
    return parseExplicitGids(rule.explicitProductGidsJson);
  }
  if (rule.productScope === "WIDGET_ENABLED") {
    return [...widgetProductGids];
  }
  return [];
}

async function fetchProductTitles(
  admin: AdminApiContext,
  gids: string[],
): Promise<Record<string, string>> {
  if (gids.length === 0) return {};
  const res = await admin.graphql(
    `#graphql
    query SubBulkRuleProductTitles($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
        }
      }
    }`,
    { variables: { ids: gids } },
  );
  const json = await res.json();
  const out: Record<string, string> = {};
  for (const n of json.data?.nodes ?? []) {
    if (n?.id && typeof n.title === "string") {
      out[n.id as string] = n.title as string;
    }
  }
  return out;
}

async function fetchBulkPricingByProduct(
  admin: AdminApiContext,
  gids: string[],
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    gids.map(async (gid) => [
      gid,
      (await fetchProductBulkPricingJson(admin, gid)) || "",
    ]),
  );
  return Object.fromEntries(entries);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const [ws, rule, widgetProducts] = await Promise.all([
    getOrCreateWidgetSettings(session.shop),
    getSubscriptionRule(session.shop),
    listWidgetEnabledProducts(session.shop),
  ]);
  const widgetGids = widgetProducts.map((p) => p.productGid);
  const initialProductGids = resolveInitialProductGids(rule, widgetGids);
  const [productTitles, bulkPricingByProduct] = await Promise.all([
    fetchProductTitles(admin, initialProductGids),
    fetchBulkPricingByProduct(admin, initialProductGids),
  ]);

  const defaultDiscountType =
    ws.defaultSubscriptionDiscountType === "FIXED" ? "FIXED" : "PERCENTAGE";
  return {
    shop: session.shop,
    rule,
    initialProductGids,
    productTitles,
    bulkPricingByProduct,
    syncKey: rule ? rule.updatedAt.toISOString() : "",
    legacyWidgetScope: rule?.productScope === "WIDGET_ENABLED",
    defaultDiscountType,
    defaultDiscountValue: ws.defaultSubscriptionDiscountValue || "10",
    defaultIntervalsJson: JSON.stringify(DEFAULT_INTERVALS),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, redirect } = await authenticate.admin(request);
  await assertMerchantWriteAccess({
    session,
    redirect,
    requiredFeature: "subscriptionRules",
  });
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "save");
  const existingRule = await getSubscriptionRule(session.shop);

  if (intent === "saveBulk") {
    const productGid = String(fd.get("productGid") || "").trim();
    const bulkPricingJson = String(fd.get("bulkPricingJson") || "");

    try {
      if (!(await isWidgetEnabledForProduct(session.shop, productGid))) {
        await addWidgetEnabledProduct(admin, session.shop, productGid);
      }
      await saveProductBulkPricing(admin, session.shop, productGid, bulkPricingJson);
      return {
        ok: true as const,
        bulkSaved: true as const,
        message: "Đã lưu bulk pricing cho sản phẩm.",
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Lỗi không xác định";
      return { error: msg };
    }
  }

  const title = String(fd.get("title") || "").trim() || "Subscribe & save";
  const internalName = String(fd.get("internalName") || "").trim();
  const planSelectorLabel =
    String(fd.get("planSelectorLabel") || "").trim() || "Deliver every";
  const explicitJson = String(fd.get("explicitProductGidsJson") || "[]");
  const intervalsJson = String(fd.get("intervalsJson") || "[]");

  const productGids = parseExplicitGids(explicitJson);
  if (productGids.length === 0) {
    return {
      error:
        "Thêm ít nhất một sản phẩm ở bước 2. Selling plan sẽ áp dụng cho toàn bộ danh sách đó.",
    };
  }

  let planIntervals: PlanIntervalConfig[];
  try {
    planIntervals = JSON.parse(intervalsJson);
    if (!Array.isArray(planIntervals) || planIntervals.length === 0) {
      return { error: "Cần ít nhất một interval trong JSON (bước 3)." };
    }
  } catch {
    return { error: "JSON intervals không hợp lệ." };
  }

  for (const plan of planIntervals) {
    if (
      plan.discountType !== "PERCENTAGE" &&
      plan.discountType !== "FIXED"
    ) {
      return { error: "Mỗi selling plan phải có loại discount hợp lệ." };
    }
    if (
      !Number.isFinite(Number(plan.discountValue)) ||
      Number(plan.discountValue) < 0
    ) {
      return { error: "Mỗi selling plan phải có discount value hợp lệ." };
    }
  }

  const firstPlan = planIntervals[0];
  const discountType =
    firstPlan?.discountType === "FIXED" ? "FIXED" : "PERCENTAGE";
  const discountValue = Number(firstPlan?.discountValue ?? 0);
  if (!Number.isFinite(discountValue) || discountValue < 0) {
    return { error: "Giá trị discount không hợp lệ." };
  }

  const normalizedIntervalsJson = JSON.stringify(planIntervals);
  const shouldRecreateGroup =
    intent === "recreate" ||
    !existingRule?.sellingPlanGroupGid ||
    existingRule.title !== title ||
    existingRule.planSelectorLabel !== planSelectorLabel ||
    existingRule.planIntervalsJson !== normalizedIntervalsJson;

  try {
    await syncWidgetEnabledProducts(admin, session.shop, productGids);

    await prisma.subscriptionRule.upsert({
      where: { shop: session.shop },
      create: {
        shop: session.shop,
        title,
        internalName: internalName || null,
        planSelectorLabel,
        productScope: "EXPLICIT",
        explicitProductGidsJson: explicitJson,
        discountType,
        discountValue: String(discountValue),
        planIntervalsJson: normalizedIntervalsJson,
      },
      update: {
        title,
        internalName: internalName || null,
        planSelectorLabel,
        productScope: "EXPLICIT",
        explicitProductGidsJson: explicitJson,
        discountType,
        discountValue: String(discountValue),
        planIntervalsJson: normalizedIntervalsJson,
      },
    });

    let rule = await getSubscriptionRule(session.shop);
    if (!rule) {
      return { error: "Không đọc được rule sau khi lưu." };
    }

    if (shouldRecreateGroup && rule.sellingPlanGroupGid) {
      await deleteSellingPlanGroupOnShopify(admin, rule.sellingPlanGroupGid);
      await prisma.subscriptionRule.update({
        where: { shop: session.shop },
        data: {
          sellingPlanGroupGid: null,
          defaultSellingPlanGid: null,
        },
      });
      rule = await getSubscriptionRule(session.shop);
    }

    if (!rule.sellingPlanGroupGid) {
      const { sellingPlanGroupGid, defaultSellingPlanGid } =
        await createShopifyGroupForRule(admin, {
          title,
          planSelectorLabel,
          discountType,
          discountValue,
          planIntervals,
          productGids,
        });
      await prisma.subscriptionRule.update({
        where: { shop: session.shop },
        data: { sellingPlanGroupGid, defaultSellingPlanGid },
      });
    } else {
      await syncRuleProductsOnShopify(
        admin,
        rule.sellingPlanGroupGid,
        productGids,
      );
    }

    return {
      ok: true as const,
      message:
        shouldRecreateGroup
          ? "Đã rebuild selling plan group trên Shopify và đồng bộ toàn bộ sản phẩm trong danh sách."
          : "Đã lưu. Selling plan trên Shopify áp dụng cho mọi sản phẩm ở bước 2.",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    return { error: msg };
  }
};

function createPlanId() {
  return Math.random().toString(36).slice(2, 10);
}

function planDraftFromConfig(config: PlanIntervalConfig): SellingPlanDraft {
  return {
    id: createPlanId(),
    name: config.name?.trim() || `Every ${config.label}`,
    label: config.label,
    interval: config.interval,
    intervalCount: String(config.intervalCount),
    discountType: config.discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
    discountValue: String(config.discountValue ?? 10),
    description: config.description?.trim() || "",
  };
}

function parseInitialPlans(
  raw: string | null | undefined,
  fallback: PlanIntervalConfig[],
): SellingPlanDraft[] {
  if (!raw) return fallback.map(planDraftFromConfig);
  try {
    const parsed = JSON.parse(raw) as PlanIntervalConfig[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallback.map(planDraftFromConfig);
    }
    return parsed.map(planDraftFromConfig);
  } catch {
    return fallback.map(planDraftFromConfig);
  }
}

function serializePlans(plans: SellingPlanDraft[]) {
  return JSON.stringify(
    plans.map((plan) => ({
      interval: plan.interval,
      intervalCount: Math.max(1, Number(plan.intervalCount) || 1),
      label: plan.label.trim() || "month",
      name: plan.name.trim() || undefined,
      discountType: plan.discountType,
      discountValue: Math.max(0, Number(plan.discountValue) || 0),
      description: plan.description.trim() || undefined,
    })),
  );
}

function previewDiscountLabel(
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: string,
) {
  return discountType === "FIXED"
    ? `SAVE $${discountValue || "0"}`
    : `SAVE ${discountValue || "0"}%`;
}

export default function SubscriptionRuleEditorPage() {
  const {
    rule,
    initialProductGids,
    productTitles: titlesFromLoader,
    bulkPricingByProduct: bulkPricingByProductFromLoader,
    syncKey,
    legacyWidgetScope,
    defaultIntervalsJson,
  } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const bulkFetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const bulkBusy = bulkFetcher.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);

  const [productGids, setProductGids] = useState<string[]>(initialProductGids);
  const [productTitles, setProductTitles] =
    useState<Record<string, string>>(titlesFromLoader);
  const [bulkPricingByProduct, setBulkPricingByProduct] = useState<
    Record<string, string>
  >(bulkPricingByProductFromLoader);
  const [expandedBulkProductGid, setExpandedBulkProductGid] = useState<string | null>(
    null,
  );

  const [title, setTitle] = useState(rule?.title ?? "Subscribe & save");
  const [internalName, setInternalName] = useState(rule?.internalName ?? "");
  const [planSelectorLabel, setPlanSelectorLabel] = useState(
    rule?.planSelectorLabel ?? "Deliver every",
  );
  const [plans, setPlans] = useState<SellingPlanDraft[]>(
    parseInitialPlans(
      rule?.planIntervalsJson && rule.planIntervalsJson !== "[]"
        ? rule.planIntervalsJson
        : defaultIntervalsJson,
      DEFAULT_INTERVALS,
    ),
  );

  useEffect(() => {
    setProductGids(initialProductGids);
    setProductTitles(titlesFromLoader);
    setBulkPricingByProduct(bulkPricingByProductFromLoader);
    setTitle(rule?.title ?? "Subscribe & save");
    setInternalName(rule?.internalName ?? "");
    setPlanSelectorLabel(rule?.planSelectorLabel ?? "Deliver every");
    setPlans(
      parseInitialPlans(
        rule?.planIntervalsJson && rule.planIntervalsJson !== "[]"
          ? rule.planIntervalsJson
          : defaultIntervalsJson,
        DEFAULT_INTERVALS,
      ),
    );
  }, [
    defaultIntervalsJson,
    bulkPricingByProductFromLoader,
    initialProductGids,
    rule?.internalName,
    rule?.planIntervalsJson,
    rule?.planSelectorLabel,
    rule?.title,
    syncKey,
    titlesFromLoader,
  ]);

  useEffect(() => {
    if (!actionData) return;
    if ("message" in actionData && actionData.message) {
      setToast({ message: actionData.message, tone: "success" });
      return;
    }
    if ("error" in actionData && actionData.error) {
      setToast({ message: actionData.error, tone: "critical" });
    }
  }, [actionData]);

  useEffect(() => {
    if (!bulkFetcher.data) return;
    if ("message" in bulkFetcher.data && bulkFetcher.data.message) {
      setToast({ message: bulkFetcher.data.message, tone: "success" });
      return;
    }
    if ("error" in bulkFetcher.data && bulkFetcher.data.error) {
      setToast({ message: bulkFetcher.data.error, tone: "critical" });
    }
  }, [bulkFetcher.data]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const explicitJsonSerialized = JSON.stringify(productGids);
  const intervalsJson = useMemo(() => serializePlans(plans), [plans]);
  const previewPlans = plans.length > 0 ? plans : DEFAULT_INTERVALS.map(planDraftFromConfig);

  const updatePlan = useCallback(
    (id: string, patch: Partial<SellingPlanDraft>) => {
      setPlans((prev) =>
        prev.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan)),
      );
    },
    [],
  );

  const addPlan = useCallback(() => {
    setPlans((prev) => [
      ...prev,
      {
        id: createPlanId(),
        name: `Selling plan #${prev.length + 1}`,
        label: `${prev.length + 1} month${prev.length > 0 ? "s" : ""}`,
        interval: "MONTH",
        intervalCount: "1",
        discountType: "PERCENTAGE",
        discountValue: "10",
        description: "",
      },
    ]);
  }, []);

  const movePlan = useCallback((id: string, direction: -1 | 1) => {
    setPlans((prev) => {
      const index = prev.findIndex((plan) => plan.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  const removePlan = useCallback((id: string) => {
    setPlans((prev) => (prev.length === 1 ? prev : prev.filter((plan) => plan.id !== id)));
  }, []);

  const pickProducts = useCallback(() => {
    const w = window as unknown as {
      shopify?: { resourcePicker: (opts: unknown) => Promise<unknown> };
    };
    const picker = w.shopify?.resourcePicker;
    if (!picker) {
      alert("Mở app trong Shopify Admin để dùng Resource Picker.");
      return;
    }
    void (async () => {
      try {
        const selected = (await picker({
          type: "product",
          multiple: true,
        })) as { id?: string; title?: string }[] | null;
        const picked = (selected ?? [])
          .map((p) => ({
            id:
              typeof p.id === "string" &&
              p.id.startsWith("gid://shopify/Product/")
                ? p.id
                : null,
            title: typeof p.title === "string" ? p.title : null,
          }))
          .filter((p): p is { id: string; title: string | null } => p.id != null);
        if (picked.length === 0) return;
        setProductGids((prev) => {
          const set = new Set(prev);
          for (const p of picked) set.add(p.id);
          return [...set];
        });
        setProductTitles((prev) => {
          const next = { ...prev };
          for (const p of picked) {
            if (p.title) next[p.id] = p.title;
          }
          return next;
        });
        setBulkPricingByProduct((prev) => {
          const next = { ...prev };
          for (const p of picked) {
            if (!(p.id in next)) next[p.id] = "";
          }
          return next;
        });
      } catch {
        /* cancel */
      }
    })();
  }, []);

  const removeGid = useCallback((gid: string) => {
    setProductGids((prev) => prev.filter((x) => x !== gid));
    setExpandedBulkProductGid((prev) => (prev === gid ? null : prev));
  }, []);

  return (
    <Page
      backAction={{ content: "Back", onAction: () => navigate("/app/subscription-rule") }}
      title="Subscription rule"
    >
      <TitleBar title="Subscription rule" />
      <BlockStack gap="500">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}

        <Banner tone="info" title="Rule model">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              One rule creates one Shopify selling plan group, with multiple delivery
              cadences inside it. In your case, this screen is optimized for the
              common setup: shared discount + `2 weeks` and `1 month` cadence options.
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Bulk pricing is configured per product and shown in the widget. The
              current checkout price for subscriptions still follows the Shopify
              selling plan discount below.
            </Text>
          </BlockStack>
        </Banner>

        {legacyWidgetScope ? (
          <Banner tone="warning" title="Legacy widget-linked mode detected">
            <p>
              The previous rule was linked to the widget-enabled product list.
              Saving here will convert it into an explicit managed list.
            </p>
          </Banner>
        ) : null}

        <Form method="post">
          <input type="hidden" name="intent" value="save" />
          <input
            type="hidden"
            name="explicitProductGidsJson"
            value={explicitJsonSerialized}
          />
          <input type="hidden" name="intervalsJson" value={intervalsJson} />

          <BlockStack gap="500">
            <InlineGrid columns={{ xs: 1, md: "1.6fr 1fr" }} gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    General information
                  </Text>
                  <FormLayout>
                    <TextField
                      label="Rule name"
                      name="title"
                      value={title}
                      onChange={setTitle}
                      autoComplete="off"
                      helpText="This name appears in the subscription widget on product pages."
                    />
                    <TextField
                      label="Internal name"
                      name="internalName"
                      value={internalName}
                      onChange={setInternalName}
                      autoComplete="off"
                      helpText="Internal only. Not shown to customers."
                    />
                    <TextField
                      label="Label for plan selector"
                      name="planSelectorLabel"
                      value={planSelectorLabel}
                      onChange={setPlanSelectorLabel}
                      autoComplete="off"
                      helpText="Example: Deliver every"
                    />
                  </FormLayout>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Widget preview
                  </Text>
                  <div
                    style={{
                      border: "1px solid #dfe3e8",
                      borderRadius: 16,
                      padding: 16,
                      background: "#ffffff",
                    }}
                  >
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Purchase options
                      </Text>
                      <Box
                        padding="300"
                        borderColor="border"
                        borderWidth="025"
                        borderRadius="200"
                      >
                        <InlineStack align="space-between" blockAlign="center">
                          <InlineStack gap="200" blockAlign="center">
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                border: "1px solid #8c9196",
                              }}
                            />
                            <Text as="span" variant="bodyMd">
                              One-time purchase
                            </Text>
                          </InlineStack>
                          <Text as="span" variant="bodyMd">
                            $39.99
                          </Text>
                        </InlineStack>
                      </Box>
                      <Box
                        padding="300"
                        borderColor="border-emphasis"
                        borderWidth="025"
                        borderRadius="200"
                        background="bg-surface-secondary"
                      >
                        <BlockStack gap="250">
                          <InlineStack align="space-between" blockAlign="center">
                            <InlineStack gap="200" blockAlign="center">
                              <div
                                style={{
                                  width: 18,
                                  height: 18,
                                  borderRadius: "50%",
                                  border: "1px solid #1f2124",
                                  display: "grid",
                                  placeItems: "center",
                                }}
                              >
                                <div
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: "#1f2124",
                                  }}
                                />
                              </div>
                              <Text as="span" variant="bodyMd" fontWeight="medium">
                                {title || "Subscribe & save"}
                              </Text>
                              <Badge tone="success">
                                {previewDiscountLabel(
                                  previewPlans[0]?.discountType ?? "PERCENTAGE",
                                  previewPlans[0]?.discountValue ?? "10",
                                )}
                              </Badge>
                            </InlineStack>
                            <Text as="span" variant="bodyMd">
                              $35.99
                            </Text>
                          </InlineStack>
                          <InlineStack gap="200" blockAlign="center">
                            <Text as="span" variant="bodyMd">
                              {planSelectorLabel || "Deliver every"}
                            </Text>
                            <div
                              style={{
                                border: "1px solid #c9cccf",
                                borderRadius: 10,
                                padding: "8px 12px",
                                minWidth: 160,
                              }}
                            >
                              <BlockStack gap="100">
                                {previewPlans.slice(0, 3).map((plan, index) => (
                                  <Text
                                    key={plan.id}
                                    as="span"
                                    variant="bodySm"
                                    fontWeight={index === 0 ? "medium" : "regular"}
                                  >
                                    {index === 0 ? `✓ ${plan.label}` : plan.label}
                                  </Text>
                                ))}
                              </BlockStack>
                            </div>
                          </InlineStack>
                        </BlockStack>
                      </Box>
                    </BlockStack>
                  </div>
                </BlockStack>
              </Card>
            </InlineGrid>

            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">
                      Products available for subscriptions
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Select products that should receive this rule. The current
                      implementation attaches the selling plan to all variants inside
                      each selected product.
                    </Text>
                  </BlockStack>
                  <Button type="button" onClick={pickProducts}>
                    Add products
                  </Button>
                </InlineStack>

                {productGids.length === 0 ? (
                  <Text as="p" variant="bodyMd" tone="subdued">
                    No products selected yet.
                  </Text>
                ) : (
                  <BlockStack gap="300">
                    <Divider />
                    {productGids.map((gid) => (
                      <Box
                        key={gid}
                        padding="300"
                        background="bg-surface-secondary"
                        borderRadius="200"
                      >
                        <BlockStack gap="200">
                          <InlineStack align="space-between" blockAlign="center">
                            <BlockStack gap="100">
                              <Text as="span" variant="bodyMd" fontWeight="semibold">
                                {productTitles[gid] || "Product"}
                              </Text>
                              <Text as="span" variant="bodySm" tone="subdued">
                                {gid}
                              </Text>
                            </BlockStack>
                            <Badge tone="info">All variants</Badge>
                          </InlineStack>
                          <InlineStack gap="200" wrap>
                            <Button
                              type="button"
                              onClick={() =>
                                setExpandedBulkProductGid((prev) =>
                                  prev === gid ? null : gid,
                                )
                              }
                            >
                              Configure bulk pricing
                            </Button>
                            <Button
                              type="button"
                              tone="critical"
                              variant="plain"
                              onClick={() => removeGid(gid)}
                            >
                              Remove
                            </Button>
                          </InlineStack>
                          {expandedBulkProductGid === gid ? (
                            <BlockStack gap="200">
                              <TextField
                                label="Bulk pricing metafield JSON"
                                name="bulkPricingJson"
                                multiline={10}
                                autoComplete="off"
                                value={bulkPricingByProduct[gid] ?? ""}
                                onChange={(value) =>
                                  setBulkPricingByProduct((prev) => ({
                                    ...prev,
                                    [gid]: value,
                                  }))
                                }
                                helpText="Leave this blank until bulk pricing is configured. Saved to product metafield `app.bulk_pricing`."
                              />
                              <InlineStack gap="200">
                                <Button
                                  type="button"
                                  loading={bulkBusy}
                                  onClick={() => {
                                    const fd = new FormData();
                                    fd.set("intent", "saveBulk");
                                    fd.set("productGid", gid);
                                    fd.set(
                                      "bulkPricingJson",
                                      bulkPricingByProduct[gid] ?? "",
                                    );
                                    bulkFetcher.submit(fd, { method: "post" });
                                  }}
                                >
                                  Save bulk pricing
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => setExpandedBulkProductGid(null)}
                                >
                                  Close
                                </Button>
                              </InlineStack>
                            </BlockStack>
                          ) : null}
                        </BlockStack>
                      </Box>
                    ))}
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">
                      Selling plans
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Each selling plan has its own delivery interval and discount.
                    </Text>
                  </BlockStack>
                  <Button type="button" onClick={addPlan}>
                    Add selling plan
                  </Button>
                </InlineStack>

                <BlockStack gap="300">
                  {plans.map((plan, index) => (
                    <Box
                      key={plan.id}
                      padding="400"
                      borderColor="border"
                      borderWidth="025"
                      borderRadius="300"
                    >
                      <BlockStack gap="300">
                        <InlineStack align="space-between" blockAlign="center">
                          <Badge tone="info">SELLING PLAN #{index + 1}</Badge>
                          <InlineStack gap="200">
                            <Button
                              type="button"
                              variant="plain"
                              disabled={index === 0}
                              onClick={() => movePlan(plan.id, -1)}
                            >
                              Move up
                            </Button>
                            <Button
                              type="button"
                              variant="plain"
                              disabled={index === plans.length - 1}
                              onClick={() => movePlan(plan.id, 1)}
                            >
                              Move down
                            </Button>
                            <Button
                              type="button"
                              variant="plain"
                              tone="critical"
                              disabled={plans.length === 1}
                              onClick={() => removePlan(plan.id)}
                            >
                              Remove
                            </Button>
                          </InlineStack>
                        </InlineStack>

                        <TextField
                          label="Selling plan name"
                          value={plan.name}
                          onChange={(value) => updatePlan(plan.id, { name: value })}
                          autoComplete="off"
                          helpText="Shown on invoices and subscription details."
                        />

                        <InlineGrid columns={{ xs: 1, md: 2 }} gap="300">
                          <TextField
                            label="Delivery interval"
                            type="number"
                            min={1}
                            value={plan.intervalCount}
                            onChange={(value) =>
                              updatePlan(plan.id, { intervalCount: value })
                            }
                            autoComplete="off"
                          />
                          <Select
                            label="Interval unit"
                            options={[
                              { label: "Day(s)", value: "DAY" },
                              { label: "Week(s)", value: "WEEK" },
                              { label: "Month(s)", value: "MONTH" },
                            ]}
                            value={plan.interval}
                            onChange={(value) =>
                              updatePlan(plan.id, {
                                interval:
                                  value === "DAY" || value === "WEEK"
                                    ? value
                                    : "MONTH",
                              })
                            }
                          />
                        </InlineGrid>

                        <TextField
                          label="Selling plan selector label"
                          value={plan.label}
                          onChange={(value) => updatePlan(plan.id, { label: value })}
                          autoComplete="off"
                          helpText="Shown inside the subscription widget dropdown."
                        />

                        <InlineGrid columns={{ xs: 1, md: 2 }} gap="300">
                          <Select
                            label="Discount"
                            options={[
                              { label: "Percentage discount", value: "PERCENTAGE" },
                              { label: "Fixed amount", value: "FIXED" },
                            ]}
                            value={plan.discountType}
                            onChange={(value) =>
                              updatePlan(plan.id, {
                                discountType:
                                  value === "FIXED" ? "FIXED" : "PERCENTAGE",
                              })
                            }
                          />
                          <TextField
                            label={
                              plan.discountType === "PERCENTAGE"
                                ? "Adjustment value (%)"
                                : "Adjustment value"
                            }
                            type="number"
                            min={0}
                            step={0.01}
                            value={plan.discountValue}
                            onChange={(value) =>
                              updatePlan(plan.id, { discountValue: value })
                            }
                            autoComplete="off"
                          />
                        </InlineGrid>

                        <TextField
                          label="Selling plan description"
                          value={plan.description}
                          onChange={(value) =>
                            updatePlan(plan.id, { description: value })
                          }
                          autoComplete="off"
                          multiline={3}
                          helpText="Optional short description for the subscription widget."
                        />
                      </BlockStack>
                    </Box>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>

            <Button variant="primary" submit loading={busy}>
              Save rule
            </Button>
          </BlockStack>
        </Form>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingSm">
              Recreate Shopify selling plan group
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Use this when you change discount structure or interval JSON and need
              to rebuild the Shopify group.
            </Text>
            <Form method="post">
              <input type="hidden" name="intent" value="recreate" />
              <input type="hidden" name="title" value={title} />
              <input type="hidden" name="internalName" value={internalName} />
              <input
                type="hidden"
                name="planSelectorLabel"
                value={planSelectorLabel}
              />
              <input
                type="hidden"
                name="explicitProductGidsJson"
                value={explicitJsonSerialized}
              />
              <input type="hidden" name="intervalsJson" value={intervalsJson} />
              <Button tone="critical" submit loading={busy}>
                Recreate group
              </Button>
            </Form>
          </BlockStack>
        </Card>

        {rule?.sellingPlanGroupGid ? (
          <Text as="p" variant="bodySm" tone="subdued">
            Selling plan group: {rule.sellingPlanGroupGid}
          </Text>
        ) : null}
      </BlockStack>
    </Page>
  );
}
