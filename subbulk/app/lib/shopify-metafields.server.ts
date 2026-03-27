import type { AdminApiContext } from "@shopify/shopify-app-remix/server";

function firstUserError(
  errors: { field?: string[] | null; message?: string }[] | null | undefined,
) {
  return errors?.[0]?.message ?? null;
}

export async function setProductBooleanMetafield(
  admin: AdminApiContext,
  productGid: string,
  key: string,
  value: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await admin.graphql(
    `#graphql
    mutation SubBulkMetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            ownerId: productGid,
            namespace: "app",
            key,
            type: "boolean",
            value: value ? "true" : "false",
          },
        ],
      },
    },
  );
  const json = await res.json();
  const err = firstUserError(json.data?.metafieldsSet?.userErrors);
  if (err) return { ok: false, error: err };
  return { ok: true };
}

export async function setProductJsonMetafield(
  admin: AdminApiContext,
  productGid: string,
  key: string,
  jsonString: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await admin.graphql(
    `#graphql
    mutation SubBulkMetafieldsSetJson($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            ownerId: productGid,
            namespace: "app",
            key,
            type: "json",
            value: jsonString,
          },
        ],
      },
    },
  );
  const j = await res.json();
  const err = firstUserError(j.data?.metafieldsSet?.userErrors);
  if (err) return { ok: false, error: err };
  return { ok: true };
}

export async function fetchProductTitle(
  admin: AdminApiContext,
  productGid: string,
): Promise<string | null> {
  const res = await admin.graphql(
    `#graphql
    query SubBulkProductTitle($id: ID!) {
      product(id: $id) {
        title
      }
    }`,
    { variables: { id: productGid } },
  );
  const json = await res.json();
  return json.data?.product?.title ?? null;
}

export async function fetchProductBulkPricingJson(
  admin: AdminApiContext,
  productGid: string,
): Promise<string | null> {
  const res = await admin.graphql(
    `#graphql
    query SubBulkProductBulkMf($id: ID!) {
      product(id: $id) {
        metafield(namespace: "app", key: "bulk_pricing") {
          value
        }
      }
    }`,
    { variables: { id: productGid } },
  );
  const json = await res.json();
  return json.data?.product?.metafield?.value ?? null;
}
