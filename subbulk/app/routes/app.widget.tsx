import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  BlockStack,
  Banner,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
  getOrCreateWidgetSettings,
  updateWidgetSettings,
} from "../models/widget-settings.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getOrCreateWidgetSettings(session.shop);
  return { settings };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const fd = await request.formData();
  await updateWidgetSettings(session.shop, {
    buyMoreHeading: String(fd.get("buyMoreHeading") || ""),
    purchaseOptionsLabel: String(fd.get("purchaseOptionsLabel") || ""),
    primaryColorHex: String(fd.get("primaryColorHex") || ""),
    accentGreenHex: String(fd.get("accentGreenHex") || ""),
    subscriptionFooter: String(fd.get("subscriptionFooter") || ""),
    freeShippingNote: String(fd.get("freeShippingNote") || ""),
  });
  return { ok: true };
};

export default function WidgetSettingsPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  return (
    <Page>
      <TitleBar title="Widget customization" />
      <BlockStack gap="400">
        {actionData?.ok ? (
          <Banner tone="success" title="Đã lưu cài đặt widget." />
        ) : null}
        <Card>
          <BlockStack gap="300">
            <Text as="p" variant="bodyMd" tone="subdued">
              Phase 1: cấu hình lưu trong app DB. Theme extension hiện dùng CSS
              variables mặc định; bạn có thể đồng bộ sang metafield shop hoặc
              asset động ở phase sau.
            </Text>
            <Form method="post">
              <FormLayout>
                <TextField
                  label="Tiêu đề “Buy More, Save More”"
                  name="buyMoreHeading"
                  defaultValue={settings.buyMoreHeading}
                  autoComplete="off"
                />
                <TextField
                  label="Nhãn “Purchase options”"
                  name="purchaseOptionsLabel"
                  defaultValue={settings.purchaseOptionsLabel}
                  autoComplete="off"
                />
                <TextField
                  label="Màu primary (#hex)"
                  name="primaryColorHex"
                  defaultValue={settings.primaryColorHex}
                  autoComplete="off"
                />
                <TextField
                  label="Màu viền chọn / tiết kiệm (#hex)"
                  name="accentGreenHex"
                  defaultValue={settings.accentGreenHex}
                  autoComplete="off"
                />
                <TextField
                  label="Footer subscription"
                  name="subscriptionFooter"
                  defaultValue={settings.subscriptionFooter}
                  autoComplete="off"
                />
                <TextField
                  label="Ghi chú free shipping"
                  name="freeShippingNote"
                  defaultValue={settings.freeShippingNote}
                  autoComplete="off"
                />
                <Button submit variant="primary" loading={busy}>
                  Lưu
                </Button>
              </FormLayout>
            </Form>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
