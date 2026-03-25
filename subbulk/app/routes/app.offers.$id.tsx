import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import {
  Page,
  Card,
  BlockStack,
  Text,
  Select,
  Button,
  Banner,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { authenticate } from "../shopify.server";
import {
  deleteOffer,
  getOffer,
  updateOfferDefaultPlan,
} from "../models/subscription-offer.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const id = params.id!;
  const offer = await getOffer(session.shop, id);
  if (!offer) throw new Response("Not found", { status: 404 });

  let plans: { id: string; name: string }[] = [];
  if (offer.sellingPlanGroupGid) {
    const res = await admin.graphql(
      `#graphql
      query SubBulkGroupPlans($id: ID!) {
        sellingPlanGroup(id: $id) {
          sellingPlans(first: 20) {
            nodes { id name }
          }
        }
      }`,
      { variables: { id: offer.sellingPlanGroupGid } },
    );
    const j = await res.json();
    plans = j.data?.sellingPlanGroup?.sellingPlans?.nodes ?? [];
  }

  return { offer, plans };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const id = params.id!;
  const fd = await request.formData();
  const intent = String(fd.get("intent"));

  if (intent === "delete") {
    await deleteOffer(session.shop, id);
    return redirect("/app/offers");
  }

  if (intent === "defaultPlan") {
    const planGid = String(fd.get("defaultSellingPlanGid") || "");
    if (!planGid.startsWith("gid://shopify/SellingPlan/")) {
      return { error: "Selling plan GID không hợp lệ." };
    }
    await updateOfferDefaultPlan(session.shop, id, planGid);
    return { ok: true };
  }

  return null;
};

export default function OfferDetail() {
  const { offer, plans } = useLoaderData<typeof loader>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [defaultPlan, setDefaultPlan] = useState(
    offer.defaultSellingPlanGid || plans[0]?.id || "",
  );

  const productNumeric = offer.productGid.replace(
    "gid://shopify/Product/",
    "",
  );

  return (
    <Page backAction={{ url: "/app/offers" }}>
      <TitleBar title={offer.title} />
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="300">
            <Text as="p" variant="bodyMd">
              Product:{" "}
              <a
                href={`shopify:admin/products/${productNumeric}`}
                target="_blank"
                rel="noreferrer"
              >
                Mở trong Admin
              </a>
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Selling plan group: {offer.sellingPlanGroupGid || "—"}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Discount: {offer.discountType} = {offer.discountValue}
            </Text>
          </BlockStack>
        </Card>

        {plans.length > 0 ? (
          <Card>
            <Form method="post">
              <input type="hidden" name="intent" value="defaultPlan" />
              <BlockStack gap="300">
                <Text as="h2" variant="headingMd">
                  Default plan (Deliver every…)
                </Text>
                <Select
                  label="Selling plan mặc định"
                  name="defaultSellingPlanGid"
                  options={plans.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                  value={defaultPlan}
                  onChange={setDefaultPlan}
                />
                <Button submit variant="primary" loading={busy}>
                  Lưu default plan
                </Button>
              </BlockStack>
            </Form>
          </Card>
        ) : (
          <Banner tone="warning" title="Không tải được plans">
            Kiểm tra quyền read_purchase_options và ID group.
          </Banner>
        )}

        <Card>
          <Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <Button tone="critical" submit loading={busy}>
              Xóa offer (chỉ DB — group trên Shopify giữ nguyên)
            </Button>
          </Form>
        </Card>

        <Link to="/app/offers">← Quay lại danh sách</Link>
      </BlockStack>
    </Page>
  );
}
