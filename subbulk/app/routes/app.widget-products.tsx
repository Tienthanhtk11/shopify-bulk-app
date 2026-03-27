import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { SubscriptionOffer } from "@prisma/client";
import { redirect } from "@remix-run/node";
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
import { listOffers } from "../models/subscription-offer.server";
import { syncWidgetScopeRuleToShopify } from "../models/subscription-rule.server";

/** Shopify product search: loại numeric id khỏi picker (tối đa để tránh query quá dài). */
const RESOURCE_PICKER_MAX_EXCLUDED_IDS = 40;

/** Mẫu JSON bulk pricing (đơn vị giá = đơn vị tiền tệ store; chỉnh số cho từng SKU). */
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
    bulkEditGid: bulkEditValid ? bulkEditGid : "",
    bulkPricingJson,
    productGidsWithSubBulkOffer: Array.from(productGidsWithSubBulkOffer),
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");

  try {
    if (intent === "add") {
      const raw = String(fd.get("productGidsJson") || "").trim();
      let ids: unknown;
      try {
        ids = JSON.parse(raw || "[]");
      } catch {
        return { ok: false, error: "Dữ liệu sản phẩm chọn không phải JSON hợp lệ." };
      }
      if (!Array.isArray(ids) || ids.length === 0) {
        return { ok: false, error: "Chọn ít nhất một sản phẩm." };
      }
      const gids = ids.filter(
        (id): id is string =>
          typeof id === "string" &&
          id.startsWith("gid://shopify/Product/"),
      );
      if (gids.length === 0) {
        return {
          ok: false,
          error: "Không có Product GID hợp lệ (gid://shopify/Product/...).",
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
              ? "Sản phẩm này đã có trong danh sách — không thêm trùng."
              : `Tất cả ${alreadyIn.length} sản phẩm chọn đã có trong danh sách — không thêm trùng.`,
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
            errs.join(" · ") || "Không thêm được sản phẩm nào (kiểm tra quyền API).",
        };
      }
      const dupPart =
        alreadyIn.length > 0
          ? ` Đã bỏ qua ${alreadyIn.length} sản phẩm đã có trong danh sách.`
          : "";
      const errPart = errs.length
        ? ` Một số lỗi: ${errs.slice(0, 3).join(" · ")}${errs.length > 3 ? "…" : ""}`
        : "";
      const msg =
        `Đã thêm ${okCount} sản phẩm mới và bật widget.${dupPart}${errPart}`;
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
      return { ok: true, message: "Đã gỡ sản phẩm và tắt widget." };
    }
    if (intent === "saveBulk") {
      const productGid = String(fd.get("productGid") || "").trim();
      const jsonRaw = String(fd.get("bulkPricingJson") || "");
      await saveProductBulkPricing(admin, session.shop, productGid, jsonRaw);
      return redirect("/app/widget-products");
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    return { ok: false, error: msg };
  }

  return { ok: false, error: "Thao tác không hợp lệ." };
};

function productAdminUrl(shop: string, productGid: string) {
  const id = productGid.replace("gid://shopify/Product/", "");
  return `https://${shop}/admin/products/${id}`;
}

export default function WidgetProductsPage() {
  const {
    shop,
    products,
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
      <TitleBar title="Sản phẩm dùng widget" />
      <BlockStack gap="400">
        {actionData && "error" in actionData && actionData.error ? (
          <Banner tone="critical" title="Lỗi">
            <p>{actionData.error}</p>
          </Banner>
        ) : null}
        {actionData &&
        "ok" in actionData &&
        actionData.ok &&
        "message" in actionData &&
        typeof actionData.message === "string" ? (
          <Banner tone="success" title={actionData.message} />
        ) : null}

        <Banner tone="info" title="Vị trí trong quy trình">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              <strong>Đăng ký (subscribe):</strong> cấu hình tại{" "}
              <Link url="/app/subscription-rule">Thiết lập đăng ký</Link> —{" "}
              <em>rule → danh sách sản phẩm → selling plan chung</em>. Trang{" "}
              <strong>Sản phẩm widget</strong> này chủ yếu để{" "}
              <strong>bật block theme</strong> (metafield) và{" "}
              <strong>bulk pricing</strong> JSON; danh sách có thể trùng với bước
              2 bên «Thiết lập đăng ký» nhưng không bắt buộc giống hệt.
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Nếu rule cũ dùng chế độ «theo Sản phẩm widget», thêm/gỡ SP ở đây
              vẫn có thể đồng bộ selling plan (legacy).
            </Text>
          </BlockStack>
        </Banner>

        <Banner tone="info" title="Vì sao giỏ hàng không khớp bảng giá widget?">
          <BlockStack gap="200">
            <Text as="p" variant="bodyMd">
              Shopify tính dòng giỏ theo{" "}
              <Text as="span" fontWeight="semibold">
                giá variant
              </Text>{" "}
              (một lần) hoặc{" "}
              <Text as="span" fontWeight="semibold">
                variant + selling plan
              </Text>{" "}
              (đăng ký). Metafield{" "}
              <Text as="span" fontWeight="semibold">
                bulk_pricing
              </Text>{" "}
              chỉ dùng để hiển thị trên theme —{" "}
              <Text as="span" fontWeight="semibold">
                không tự đổi giá checkout
              </Text>
              .
            </Text>
            <Text as="p" variant="bodyMd">
              <Text as="span" fontWeight="semibold">
                Đăng ký:
              </Text>{" "}
              cần{" "}
              <Text as="span" fontWeight="semibold">
                Selling plan group
              </Text>{" "}
              gắn sản phẩm (Shopify Admin API:{" "}
              <Link
                url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/sellingPlanGroupCreate"
                target="_blank"
              >
                sellingPlanGroupCreate
              </Link>
              ). Trong SubBulk dùng{" "}
              <Link url="/app/subscription-rule">Thiết lập đăng ký</Link> để
              gắn selling plan cho cả danh sách sản phẩm; hoặc legacy{" "}
              <Link url="/app/offers/new">offer từng SKU</Link>.
            </Text>
            <Text as="p" variant="bodyMd">
              <Text as="span" fontWeight="semibold">
                Một lần + bulk:
              </Text>{" "}
              đồng bộ giá variant với bảng tier, hoặc dùng{" "}
              <Link
                url="https://shopify.dev/docs/api/functions/latest/cart-transform"
                target="_blank"
              >
                Cart Transform / Discount Function
              </Link>{" "}
              để chỉnh giá theo số lượng trên giỏ.
            </Text>
          </BlockStack>
        </Banner>

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Danh sách
            </Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              Chỉ sản phẩm trong danh sách mới có metafield{" "}
              <Text as="span" fontWeight="semibold">
                app.subbulk_widget_enabled = true
              </Text>{" "}
              và block theme mới render widget. Chọn{" "}
              <Text as="span" fontWeight="semibold">
                nhiều sản phẩm
              </Text>{" "}
              trong Resource Picker rồi thêm một lần. Sản phẩm đã có trong danh
              sách được{" "}
              <Text as="span" fontWeight="semibold">
                ẩn trong picker
              </Text>{" "}
              (tối đa {RESOURCE_PICKER_MAX_EXCLUDED_IDS} mục) hoặc hiện{" "}
              <Text as="span" fontWeight="semibold">
                đã chọn
              </Text>{" "}
              khi danh sách dài; trùng khi gửi form sẽ{" "}
              <Text as="span" fontWeight="semibold">
                bỏ qua
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
                  Đã chọn:{" "}
                  {selectedGids.length === 0
                    ? "—"
                    : `${selectedGids.length} sản phẩm`}
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
                    Chọn sản phẩm (có thể nhiều)
                  </Button>
                  <Button
                    onClick={() => setSelectedGids([])}
                    disabled={selectedGids.length === 0}
                  >
                    Bỏ chọn
                  </Button>
                  <Button
                    variant="primary"
                    submit
                    disabled={selectedGids.length === 0 || busy}
                    loading={busy}
                  >
                    Thêm vào danh sách
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
                Mỗi sản phẩm có một metafield JSON riêng trên chính sản phẩm đó (không dùng chung một bảng cho cả cửa hàng). Metafield{" "}
                <Text as="span" fontWeight="semibold">
                  app.bulk_pricing
                </Text>
                . Mỗi phần tử:{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  qtyBreakpoint
                </Text>{" "}
                (số lượng tối thiểu áp mức giá),{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  priceAfterDiscount
                </Text>{" "}
                (đơn giá sau giảm),{" "}
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  bulkPrice
                </Text>{" "}
                (giá so sánh / gạch ngang — tuỳ chọn).
              </Text>
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <Text as="p" variant="headingSm">
                  JSON mẫu (copy chỉnh giá theo từng sản phẩm)
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
                    Lưu bulk pricing
                  </Button>
                  <Button url="/app/widget-products">Hủy</Button>
                </InlineStack>
              </Form>
            </BlockStack>
          </Card>
        ) : null}

        <Card>
          <BlockStack gap="300">
            <Text as="h2" variant="headingMd">
              Sản phẩm đã bật ({products.length})
            </Text>
            {products.length === 0 ? (
              <Text as="p" tone="subdued">
                Chưa có sản phẩm nào.
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
                          {p.productTitle || "Sản phẩm"}
                        </Text>
                        {offerGidSet.has(p.productGid) ? (
                          <Badge tone="success">
                            Đã có Subscription offer (selling plan)
                          </Badge>
                        ) : (
                          <Badge tone="warning">
                            Chưa có offer — subscribe trên giỏ cần tạo offer
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
                          Mở trong Shopify Admin
                        </Button>
                        <Button
                          url={`/app/widget-products?bulk=${encodeURIComponent(p.productGid)}`}
                        >
                          Sửa bulk pricing
                        </Button>
                        <Form method="post">
                          <input type="hidden" name="intent" value="remove" />
                          <input type="hidden" name="rowId" value={p.id} />
                          <Button
                            submit
                            tone="critical"
                            loading={busy}
                          >
                            Gỡ khỏi danh sách
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
