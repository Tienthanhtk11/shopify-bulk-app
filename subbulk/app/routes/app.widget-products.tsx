import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { SubscriptionOffer } from "../../generated/prisma/client";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  InlineStack,
  TextField,
  Banner,
  Box,
  Badge,
  Link,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { FloatingToast } from "../lib/floating-toast";
import { authenticate } from "../shopify.server";
import { fetchProductBulkPricingJson } from "../lib/shopify-metafields.server";
import {
  addWidgetEnabledProduct,
  isWidgetEnabledForProduct,
  listWidgetEnabledProducts,
  removeWidgetEnabledProduct,
  saveProductBulkPricing,
  type WidgetEnabledProductRow,
} from "../models/widget-enabled-product.server";
import { assertMerchantWriteAccess } from "../services/billing.server";
import { listOffers } from "../models/subscription-offer.server";
import { syncWidgetScopeRuleToShopify } from "../models/subscription-rule.server";

/** Shopify product search: exclude numeric IDs from the picker to keep queries short. */
const RESOURCE_PICKER_MAX_EXCLUDED_IDS = 40;

/** Sample bulk pricing JSON. Values use the store currency and should be customized per SKU. */
export const BULK_PRICING_JSON_TEMPLATE = `[
  {
    "qtyBreakpoint": 1,
    "priceAfterDiscount": 49.99,
    "bulkPrice": 59.99
  },
  {
    "qtyBreakpoint": 5,
    "priceAfterDiscount": 46.99,
    "bulkPrice": 56.99
  },
  {
    "qtyBreakpoint": 12,
    "priceAfterDiscount": 42.99,
    "bulkPrice": 52.99
  }
]`;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const [products, offers] = await Promise.all([
    listWidgetEnabledProducts(session.shop),
    listOffers(session.shop),
  ]);
  const productGidsWithSubBulkOffer = new Set(
    offers.map((o: SubscriptionOffer) => o.productGid).filter(Boolean),
  );
  const url = new URL(request.url);
  const entrySource = url.searchParams.get("source")?.trim() ?? "";
  const bulkEditGid = url.searchParams.get("bulk")?.trim() ?? "";
  let bulkPricingJson = "";
  let bulkEditValid = false;
  if (bulkEditGid.startsWith("gid://shopify/Product/")) {
    const inList = products.some(
      (p: WidgetEnabledProductRow) => p.productGid === bulkEditGid,
    );
    if (inList) {
      bulkEditValid = true;
      const raw = await fetchProductBulkPricingJson(admin, bulkEditGid);
      bulkPricingJson =
        raw != null && raw !== ""
          ? raw
          : BULK_PRICING_JSON_TEMPLATE;
    }
  }
  return {
    shop: session.shop,
    products,
    entrySource,
    bulkEditGid: bulkEditValid ? bulkEditGid : "",
    bulkPricingJson,
    productGidsWithSubBulkOffer: Array.from(productGidsWithSubBulkOffer),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, redirect } = await authenticate.admin(request);
  await assertMerchantWriteAccess({
    session,
    redirect,
    requiredFeature: "widgetProducts",
  });
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");

  try {
    if (intent === "add") {
      const raw = String(fd.get("productGidsJson") || "").trim();
      let ids: unknown;
      try {
        ids = JSON.parse(raw || "[]");
      } catch {
        return { ok: false, error: "Selected product data is not valid JSON." };
      }
      if (!Array.isArray(ids) || ids.length === 0) {
        return { ok: false, error: "Select at least one product." };
      }
      const gids = ids.filter(
        (id): id is string =>
          typeof id === "string" &&
          id.startsWith("gid://shopify/Product/"),
      );
      if (gids.length === 0) {
        return {
          ok: false,
          error: "No valid Product GID was provided (gid://shopify/Product/...).",
        };
      }

      const alreadyIn: string[] = [];
      const toAdd: string[] = [];
      for (const gid of gids) {
        if (await isWidgetEnabledForProduct(session.shop, gid)) {
          alreadyIn.push(gid);
        } else {
          toAdd.push(gid);
        }
      }

      if (toAdd.length === 0) {
        return {
          ok: true,
          message:
            alreadyIn.length === 1
              ? "This product is already in the list and was skipped."
              : `All ${alreadyIn.length} selected products are already in the list and were skipped.`,
          clearSelection: true,
        };
      }

      let okCount = 0;
      const errs: string[] = [];
      for (const gid of toAdd) {
        try {
          await addWidgetEnabledProduct(admin, session.shop, gid);
          okCount += 1;
        } catch (e) {
          errs.push(e instanceof Error ? e.message : String(e));
        }
      }
      if (okCount === 0) {
        return {
          ok: false,
          error:
            errs.join(" · ") || "No products could be added. Check API permissions.",
        };
      }
      const dupPart =
        alreadyIn.length > 0
          ? ` Skipped ${alreadyIn.length} products already in the list.`
          : "";
      const errPart = errs.length
        ? ` Some errors: ${errs.slice(0, 3).join(" · ")}${errs.length > 3 ? "…" : ""}`
        : "";
      const msg =
        `Added ${okCount} new products and enabled the widget.${dupPart}${errPart}`;
      try {
        await syncWidgetScopeRuleToShopify(admin, session.shop);
      } catch (syncErr) {
        console.error("[widget-products] sync subscription rule", syncErr);
      }
      return {
        ok: true,
        message: msg,
        clearSelection: okCount === toAdd.length && errs.length === 0,
      };
    }
    if (intent === "remove") {
      const rowId = String(fd.get("rowId") || "").trim();
      await removeWidgetEnabledProduct(admin, session.shop, rowId);
      try {
        await syncWidgetScopeRuleToShopify(admin, session.shop);
      } catch (syncErr) {
        console.error("[widget-products] sync subscription rule", syncErr);
      }
      return { ok: true, message: "Removed the product and disabled the widget." };
    }
    if (intent === "saveBulk") {
      const productGid = String(fd.get("productGid") || "").trim();
      const jsonRaw = String(fd.get("bulkPricingJson") || "");
      await saveProductBulkPricing(admin, session.shop, productGid, jsonRaw);
      return redirect("/app/widget-products");
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error.";
    return { ok: false, error: msg };
  }

  return { ok: false, error: "Invalid action." };
};

function productAdminUrl(shop: string, productGid: string) {
  const id = productGid.replace("gid://shopify/Product/", "");
  return `https://${shop}/admin/products/${id}`;
}

export default function WidgetProductsPage() {
  const {
    shop,
    products,
    entrySource,
    bulkEditGid,
    bulkPricingJson,
    productGidsWithSubBulkOffer,
  } = useLoaderData<typeof loader>();
  const offerGidSet = useMemo(
    () => new Set(productGidsWithSubBulkOffer),
    [productGidsWithSubBulkOffer],
  );
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);

  const [selectedGids, setSelectedGids] = useState<string[]>([]);
  const [bulkJson, setBulkJson] = useState(bulkPricingJson);

  const existingProductGids = useMemo(
    () => products.map((p: WidgetEnabledProductRow) => p.productGid),
    [products],
  );

  useEffect(() => {
    setBulkJson(bulkPricingJson);
  }, [bulkEditGid, bulkPricingJson]);

  useEffect(() => {
    if (
      actionData &&
      "ok" in actionData &&
      actionData.ok &&
      "clearSelection" in actionData &&
      actionData.clearSelection
    ) {
      setSelectedGids([]);
    }
  }, [actionData]);

  useEffect(() => {
    if (!actionData) return;
    if ("message" in actionData && typeof actionData.message === "string") {
      setToast({ message: actionData.message, tone: "success" });
      return;
    }
    if ("error" in actionData && actionData.error) {
      setToast({ message: actionData.error, tone: "critical" });
    }
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const pickProducts = useCallback(() => {
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
        const numericIds = existingProductGids
          .map((g: string) => g.replace(/^gid:\/\/shopify\/Product\//, ""))
          .filter((id: string) => /^\d+$/.test(id));
        const useExcludeFilter =
          numericIds.length > 0 &&
          numericIds.length <= RESOURCE_PICKER_MAX_EXCLUDED_IDS;
        const filterQuery = useExcludeFilter
          ? numericIds.map((id: string) => `-id:${id}`).join(" ")
          : undefined;
        const selectionIds =
          !useExcludeFilter && existingProductGids.length > 0
            ? existingProductGids.map((id: string) => ({ id }))
            : [];

        const selected = (await picker({
          type: "product",
          multiple: true,
          action: "add",
          ...(filterQuery
            ? { filter: { query: filterQuery } }
            : selectionIds.length > 0
              ? { selectionIds }
              : {}),
        })) as { id?: string }[] | null;
        const ids = (selected ?? [])
          .map((r) => r.id)
          .filter((id): id is string => Boolean(id));
        setSelectedGids(ids);
      } catch {
        /* cancelled */
      }
    })();
  }, [existingProductGids]);

  return (
    <Page>
      <TitleBar title="Widget Products" />
      <BlockStack gap="400">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}

        {entrySource === "discounts" ? (
          <Banner tone="info" title="Discounts admin opened this screen">
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                Use this page to configure the products that participate in SubBulk quantity discounts and to maintain the bulk pricing JSON that the storefront widget reads.
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Recommended flow: add products here, save tier pricing for each product, then validate the discount behavior in cart and checkout.
              </Text>
            </BlockStack>
          </Banner>
        ) : null}

        <Banner tone="info" title="Where this fits in the workflow">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              <strong>Subscriptions:</strong> configure them in{" "}
              <Link url="/app/subscription-rule">Subscription Setup</Link> —{" "}
              <em>rule → product list → shared selling plan</em>. This{" "}
              <strong>Widget Products</strong> page is mainly for enabling the{" "}
              <strong>theme block</strong> metafield and managing the{" "}
              <strong>bulk pricing</strong> JSON. The list can overlap with step 2 in Subscription Setup, but it does not need to match exactly.
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              If a legacy rule uses the Widget Products scope, adding or removing
              products here can still sync the selling plan membership.
            </Text>
          </BlockStack>
        </Banner>

        <Banner tone="info" title="Why cart pricing does not match the widget table">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Shopify calculates cart lines from the{" "}
              <Text as="span" fontWeight="semibold">
                variant price
              </Text>{" "}
              for one-time purchases, or from{" "}
              <Text as="span" fontWeight="semibold">
                variant + selling plan
              </Text>{" "}
              for subscriptions. The{" "}
              <Text as="span" fontWeight="semibold">
                bulk_pricing
              </Text>{" "}
              metafield is only used for storefront display and{" "}
              <Text as="span" fontWeight="semibold">
                does not automatically change checkout pricing
              </Text>
              .
            </Text>
            <Text as="p" variant="bodyMd">
              <Text as="span" fontWeight="semibold">
                Subscriptions:
              </Text>{" "}
              require a{" "}
              <Text as="span" fontWeight="semibold">
                Selling plan group
              </Text>{" "}
              attached to the product (Shopify Admin API:{" "}
              <Link
                url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/sellingPlanGroupCreate"
                target="_blank"
              >
                sellingPlanGroupCreate
              </Link>
              ). In SubBulk, use{" "}
              <Link url="/app/subscription-rule">Subscription Setup</Link> to
              attach a selling plan to a shared product list, or use the legacy{" "}
              <Link url="/app/offers/new">per-SKU offer flow</Link>.
            </Text>
            <Text as="p" variant="bodyMd">
              <Text as="span" fontWeight="semibold">
                One-time + bulk:
              </Text>{" "}
              sync the variant price with the tier table, or use{" "}
              <Link
                url="https://shopify.dev/docs/api/functions/latest/cart-transform"
                target="_blank"
              >
                Cart Transform / Discount Function
              </Link>{" "}
              to adjust pricing based on cart quantity.
            </Text>
          </BlockStack>
        </Banner>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Product list
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              Only products in this list receive the metafield{" "}
              <Text as="span" fontWeight="semibold">
                app.subbulk_widget_enabled = true
              </Text>{" "}
              and render the widget theme block. Select{" "}
              <Text as="span" fontWeight="semibold">
                multiple products
              </Text>{" "}
              in the Resource Picker and add them in one action. Products already
              in the list are{" "}
              <Text as="span" fontWeight="semibold">
                hidden in the picker
              </Text>{" "}
              for up to {RESOURCE_PICKER_MAX_EXCLUDED_IDS} items, or shown as{" "}
              <Text as="span" fontWeight="semibold">
                already selected
              </Text>{" "}
              when the list is longer. Duplicate submissions are{" "}
              <Text as="span" fontWeight="semibold">
                skipped
              </Text>
              .
            </Text>
            <Form method="post">
              <input type="hidden" name="intent" value="add" />
              <input
                type="hidden"
                name="productGidsJson"
                value={JSON.stringify(selectedGids)}
              />
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Selected:{" "}
                  {selectedGids.length === 0
                    ? "—"
                    : `${selectedGids.length} products`}
                </Text>
                {selectedGids.length > 0 ? (
                  <Box
                    padding="200"
                    background="bg-surface-secondary"
                    borderRadius="200"
                  >
                    <div
                      style={{
                        maxHeight: 120,
                        overflowY: "auto",
                      }}
                    >
                      <Text as="p" variant="bodySm" tone="subdued">
                        {selectedGids.join("\n")}
                      </Text>
                    </div>
                  </Box>
                ) : null}
                <InlineStack gap="300" blockAlign="center" wrap>
                  <Button onClick={pickProducts}>
                    Select products
                  </Button>
                  <Button
                    onClick={() => setSelectedGids([])}
                    disabled={selectedGids.length === 0}
                  >
                    Clear selection
                  </Button>
                  <Button
                    variant="primary"
                    submit
                    disabled={selectedGids.length === 0 || busy}
                    loading={busy}
                  >
                    Add to list
                  </Button>
                </InlineStack>
              </BlockStack>
            </Form>
          </BlockStack>
        </Card>

        {bulkEditGid ? (
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Bulk pricing (JSON)
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Each product stores its own JSON metafield. There is no shared
                bulk pricing table for the entire store. Metafield:{" "}
                <Text as="span" fontWeight="semibold">
                  app.bulk_pricing
                </Text>
                . Each row contains:{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  qtyBreakpoint
                </Text>{" "}
                (minimum quantity for the tier),{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  priceAfterDiscount
                </Text>{" "}
                (unit price after discount),{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  bulkPrice
                </Text>{" "}
                (compare-at / strike-through price, optional).
              </Text>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <Text as="p" variant="headingSm">
                  Sample JSON (copy and adjust pricing per product)
                </Text>
                <pre
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {BULK_PRICING_JSON_TEMPLATE}
                </pre>
              </Box>
              <Form method="post">
                <input type="hidden" name="intent" value="saveBulk" />
                <input type="hidden" name="productGid" value={bulkEditGid} />
                <TextField
                  label="JSON"
                  name="bulkPricingJson"
                  multiline={12}
                  autoComplete="off"
                  value={bulkJson}
                  onChange={setBulkJson}
                />
                <InlineStack gap="200">
                  <Button variant="primary" submit loading={busy}>
                    Save bulk pricing
                  </Button>
                  <Button url="/app/widget-products">Cancel</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        ) : null}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Enabled products ({products.length})
            </Text>
            {products.length === 0 ? (
              <Text as="p" tone="subdued">
                No products yet.
              </Text>
            ) : (
              <BlockStack gap="300">
                {products.map((p: WidgetEnabledProductRow) => (
                  <Box
                    key={p.id}
                    padding="300"
                    background="bg-surface-secondary"
                    borderRadius="200"
                  >
                    <BlockStack gap="200">
                      <InlineStack gap="200" blockAlign="center" wrap>
                        <Text as="p" variant="bodyMd" fontWeight="semibold">
                          {p.productTitle || "Product"}
                        </Text>
                        {offerGidSet.has(p.productGid) ? (
                          <Badge tone="success">
                            Subscription offer already created
                          </Badge>
                        ) : (
                          <Badge tone="warning">
                            No offer yet. Subscriptions in cart require one.
                          </Badge>
                        )}
                      </InlineStack>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {p.productGid}
                      </Text>
                      <InlineStack gap="200" wrap>
                        <Button
                          url={productAdminUrl(shop, p.productGid)}
                          target="_blank"
                        >
                          Open in Shopify Admin
                        </Button>
                        <Button
                          url={`/app/widget-products?bulk=${encodeURIComponent(p.productGid)}`}
                        >
                          Edit bulk pricing
                        </Button>
                        <Form method="post">
                          <input type="hidden" name="intent" value="remove" />
                          <input type="hidden" name="rowId" value={p.id} />
                          <Button
                            submit
                            tone="critical"
                            loading={busy}
                          >
                            Remove from list
                          </Button>
                        </Form>
                      </InlineStack>
                    </BlockStack>
                  </Box>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
