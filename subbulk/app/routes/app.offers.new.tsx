import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import { useState, useCallback } from "react";
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
    return { error: "Tiêu đề và Product GID (gid://shopify/Product/...) là bắt buộc." };
  }
  if (!Number.isFinite(discountValue) || discountValue < 0) {
    return { error: "Giá trị discount không hợp lệ." };
  }
  let planIntervals;
  try {
    planIntervals = JSON.parse(intervalsJson);
    if (!Array.isArray(planIntervals) || planIntervals.length === 0) {
      return { error: "Cần ít nhất một tần suất trong JSON intervals." };
    }
  } catch {
    return { error: "JSON intervals không hợp lệ." };
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
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
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

  const [title, setTitle] = useState("");
  const [productGid, setProductGid] = useState("");
  const [discountType, setDiscountType] = useState(defaultDiscountType);
  const [discountValue, setDiscountValue] = useState(defaultDiscountValue);
  const [intervalsJson, setIntervalsJson] = useState(defaultIntervalsJson);

  const pickProduct = useCallback(() => {
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
      <TitleBar title="Tạo subscription offer" />
      <BlockStack gap="400">
        <Banner tone="info" title="Gợi ý">
          <p>
            Thông thường hãy dùng{" "}
            <Link to="/app/subscription-rule">Thiết lập đăng ký</Link> (rule →
            danh sách sản phẩm → selling plan chung). Trang này chỉ khi cần{" "}
            <strong>một</strong> selling plan group cho <strong>một</strong>{" "}
            sản phẩm (legacy).
          </p>
        </Banner>
        {actionData?.error ? (
          <Banner tone="critical" title="Không lưu được">
            <p>{actionData.error}</p>
          </Banner>
        ) : null}
        <Card>
          <Form method="post">
            <FormLayout>
              <input type="hidden" name="discountType" value={discountType} />
              <TextField
                label="Tên offer"
                name="title"
                value={title}
                onChange={setTitle}
                autoComplete="off"
                requiredIndicator
              />
              <input type="hidden" name="productGid" value={productGid} />
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Product đã chọn: {productGid || "—"}
                </Text>
                <Button type="button" onClick={pickProduct}>
                  Chọn sản phẩm (Resource Picker)
                </Button>
              </BlockStack>
              <Select
                label="Loại discount subscription"
                options={[
                  { label: "Phần trăm (%)", value: "PERCENTAGE" },
                  { label: "Số tiền cố định (trên chu kỳ / fulfillment — Shopify)", value: "FIXED" },
                ]}
                value={discountType}
                onChange={setDiscountType}
              />
              <TextField
                label={
                  discountType === "PERCENTAGE"
                    ? "Phần trăm giảm"
                    : "Số tiền giảm (decimal)"
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
                helpText='Ví dụ: [{"interval":"WEEK","intervalCount":1,"label":"1 week"}]'
              />
              <Button variant="primary" submit loading={busy}>
                Tạo trên Shopify
              </Button>
            </FormLayout>
          </Form>
        </Card>
      </BlockStack>
    </Page>
  );
}
