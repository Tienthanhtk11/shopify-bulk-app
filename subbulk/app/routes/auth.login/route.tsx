import { useEffect, useRef, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  AppProvider as PolarisAppProvider,
  Button,
  Card,
  FormLayout,
  Page,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";

import { login } from "../../shopify.server";

import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: "/polaris-styles.css" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (request.method === "HEAD") {
    return {
      errors: {},
      initialShop: url.searchParams.get("shop") || "",
      polarisTranslations,
    };
  }

  return {
    errors: {},
    initialShop: url.searchParams.get("shop") || "",
    polarisTranslations,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [shop, setShop] = useState(loaderData.initialShop || "");
  const formRef = useRef<HTMLFormElement | null>(null);
  const autoSubmittedRef = useRef(false);
  const errors = actionData?.errors || loaderData?.errors || {};
  const showManualFallback = !loaderData.initialShop || Boolean(errors.shop);
  const shouldAutoSubmit = Boolean(loaderData.initialShop) && !errors.shop;

  useEffect(() => {
    if (!shouldAutoSubmit || autoSubmittedRef.current || !formRef.current) {
      return;
    }

    autoSubmittedRef.current = true;
    formRef.current.requestSubmit();
  }, [shouldAutoSubmit]);

  return (
    <PolarisAppProvider i18n={loaderData.polarisTranslations}>
      <Page>
        <Card>
          <Form method="post" ref={formRef}>
            <FormLayout>
              <Text variant="headingMd" as="h2">
                Connect your store
              </Text>
              {showManualFallback ? (
                <>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Open the app from Shopify Admin for automatic sign-in, or enter your shop domain below as a fallback.
                  </Text>
                  <TextField
                    type="text"
                    name="shop"
                    label="Shop domain"
                    helpText="example.myshopify.com"
                    value={shop}
                    onChange={setShop}
                    autoComplete="on"
                    error={errors.shop}
                    autoFocus
                  />
                  <Button submit>Continue</Button>
                </>
              ) : (
                <>
                  <input type="hidden" name="shop" value={shop} />
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Shopify store context was detected. Continuing with embedded sign-in automatically.
                  </Text>
                  <Spinner accessibilityLabel="Connecting your store" size="small" />
                </>
              )}
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </PolarisAppProvider>
  );
}
