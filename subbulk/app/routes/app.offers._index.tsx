import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Page,
  Card,
  BlockStack,
  Text,
  Button,
  Badge,
  EmptyState,
  Box,
  Divider,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { listOffers } from "../models/subscription-offer.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const offers = await listOffers(session.shop);
  return { offers };
};

export default function OffersIndex() {
  const { offers } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="Subscription offers">
        <Link to="/app/offers/new">
          <Button variant="primary">Tạo offer</Button>
        </Link>
      </TitleBar>
      <BlockStack gap="400">
        <Banner tone="info" title="Luồng mới: Thiết lập đăng ký">
          <p>
            Tạo rule → danh sách sản phẩm → selling plan chung tại{" "}
            <Link to="/app/subscription-rule">Thiết lập đăng ký</Link>. Trang
            offers từng SKU chỉ dùng khi cần legacy.
          </p>
        </Banner>
        {offers.length === 0 ? (
          <Card>
            <EmptyState
              heading="Chưa có offer"
              action={{
                content: "Tạo offer đầu tiên",
                url: "/app/offers/new",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Luồng mới: dùng{" "}
                <Link to="/app/subscription-rule">Thiết lập đăng ký</Link> (một
                rule + danh sách SP + selling plan chung). Legacy offer: một
                group cho từng sản phẩm.
              </p>
            </EmptyState>
          </Card>
        ) : (
          <Card>
            <BlockStack gap="0">
              {offers.map((item, i) => {
                const pid = item.productGid.replace(
                  "gid://shopify/Product/",
                  "",
                );
                return (
                  <Box key={item.id}>
                    {i > 0 ? <Divider /> : null}
                    <Box padding="400">
                      <BlockStack gap="200">
                        <Link
                          to={`/app/offers/${item.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Text as="h3" variant="headingMd">
                            {item.title}
                          </Text>
                        </Link>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Product:{" "}
                          <a
                            href={`shopify:admin/products/${pid}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Admin
                          </a>
                        </Text>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Badge tone="info">{item.discountType}</Badge>
                          {item.sellingPlanGroupGid ? (
                            <Badge tone="success">Shopify plan</Badge>
                          ) : (
                            <Badge tone="warning">Chưa đồng bộ</Badge>
                          )}
                        </div>
                      </BlockStack>
                    </Box>
                  </Box>
                );
              })}
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
