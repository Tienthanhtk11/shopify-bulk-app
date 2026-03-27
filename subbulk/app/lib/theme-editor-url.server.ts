/**
 * Deep link: thêm app block vào section có id "main" của template product (Product information),
 * thay vì section Apps tách riêng. Block handle = tên file liquid trong blocks/ (không có .liquid).
 *
 * @see https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration#deep-linking
 */
export function productTemplateMainSectionBlockEditorUrl(
  shop: string,
  apiKey: string,
  blockHandle: string,
): string {
  // Không dùng URLSearchParams cho addAppBlockId — Shopify cần dạng key/handle với dấu / thô.
  const addAppBlockId = `${apiKey}/${blockHandle}`;
  return `https://${shop}/admin/themes/current/editor?template=product&addAppBlockId=${addAppBlockId}&target=mainSection`;
}
