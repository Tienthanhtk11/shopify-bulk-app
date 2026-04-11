import { describe, expect, it } from "vitest";
import { productTemplateMainSectionBlockEditorUrl } from "./theme-editor-url.server";

describe("productTemplateMainSectionBlockEditorUrl", () => {
  it("builds a Shopify editor deep link that keeps the raw app block id format", () => {
    expect(
      productTemplateMainSectionBlockEditorUrl(
        "demo-shop.myshopify.com",
        "shpka_123",
        "buy-box",
      ),
    ).toBe(
      "https://demo-shop.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=shpka_123/buy-box&target=mainSection",
    );
  });
});
