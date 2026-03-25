import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineGrid,
  Box,
  Badge,
  List,
  Link,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  const res = await admin.graphql(`#graphql
    query SubBulkDashboardStats {
      active: subscriptionContracts(first: 250, query: "status:ACTIVE") {
        nodes { id }
      }
      paused: subscriptionContracts(first: 250, query: "status:PAUSED") {
        nodes { id }
      }
      cancelled: subscriptionContracts(first: 250, query: "status:CANCELLED") {
        nodes { id }
      }
    }
  `);
  const json = await res.json();
  const data = json.data ?? {};

  return {
    shop: session.shop,
    stats: {
      active: data.active?.nodes?.length ?? 0,
      paused: data.paused?.nodes?.length ?? 0,
      cancelled: data.cancelled?.nodes?.length ?? 0,
    },
  };
};

export default function Dashboard() {
  const { shop, stats } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="SubBulk" />
      <BlockStack gap="500">
        <Text as="h1" variant="headingLg">
          Tổng quan
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          Cửa hàng: {shop}
        </Text>
        <Layout>
          <Layout.Section>
            <InlineGrid columns={{ xs: 1, sm: 3 }} gap="400">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Đang hoạt động
                  </Text>
                  <Text as="p" variant="heading2xl">
                    {stats.active}
                  </Text>
                  <Badge tone="success">ACTIVE</Badge>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Tạm dừng
                  </Text>
                  <Text as="p" variant="heading2xl">
                    {stats.paused}
                  </Text>
                  <Badge tone="attention">PAUSED</Badge>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    Đã hủy
                  </Text>
                  <Text as="p" variant="heading2xl">
                    {stats.cancelled}
                  </Text>
                  <Badge tone="critical">CANCELLED</Badge>
                </BlockStack>
              </Card>
            </InlineGrid>
            <Box paddingBlockStart="400">
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Ghi chú thống kê
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Số liệu lấy tối đa 250 hợp đồng mỗi trạng thái (đủ cho store
                    nội bộ). Nếu cần chính xác tuyệt đối với volume lớn, nên bổ
                    sung phân trang GraphQL.
                  </Text>
                </BlockStack>
              </Card>
            </Box>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
                  Bước tiếp
                </Text>
                <List type="bullet">
                  <List.Item>
                    <Link url="/app/offers">Quản lý subscription offers</Link>
                  </List.Item>
                  <List.Item>
                    <Link url="/app/widget">Tuỳ chỉnh widget</Link>
                  </List.Item>
                  <List.Item>
                    Gắn block theme &quot;SubBulk buy box&quot; vào template sản
                    phẩm (sát buy box).
                  </List.Item>
                  <List.Item>
                    Nhập JSON bulk pricing trên metafield sản phẩm{" "}
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      bulk_pricing
                    </Text>{" "}
                    (namespace app).
                  </List.Item>
                </List>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
