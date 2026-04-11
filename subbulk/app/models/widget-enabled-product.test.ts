import { describe, expect, it, vi } from "vitest";
import { validateBulkPricingJson } from "./widget-enabled-product.server";

vi.mock("../db.server", () => ({
  default: {},
}));

vi.mock("../lib/shopify-metafields.server", () => ({
  fetchProductTitle: vi.fn(),
  setProductBooleanMetafield: vi.fn(),
  setProductJsonMetafield: vi.fn(),
}));

describe("validateBulkPricingJson", () => {
  it("normalizes empty input to an empty JSON array", () => {
    expect(validateBulkPricingJson("   ")).toEqual({
      ok: true,
      normalized: "[]",
    });
  });

  it("rejects malformed JSON and non-array payloads", () => {
    expect(validateBulkPricingJson("{")).toEqual({
      ok: false,
      error: "JSON is invalid.",
    });

    expect(validateBulkPricingJson('{"qtyBreakpoint":1}')).toEqual({
      ok: false,
      error: "Bulk pricing must be a JSON array.",
    });
  });

  it("rejects invalid tier values", () => {
    expect(
      validateBulkPricingJson(
        JSON.stringify([{ qtyBreakpoint: 0, priceAfterDiscount: 10 }]),
      ),
    ).toEqual({
      ok: false,
      error: "qtyBreakpoint must be a number greater than or equal to 1.",
    });

    expect(
      validateBulkPricingJson(
        JSON.stringify([{ qtyBreakpoint: 1, priceAfterDiscount: -5 }]),
      ),
    ).toEqual({
      ok: false,
      error: "priceAfterDiscount must be a valid number.",
    });

    expect(
      validateBulkPricingJson(
        JSON.stringify([
          {
            qtyBreakpoint: 1,
            priceAfterDiscount: 10,
            bulkPrice: "oops",
          },
        ]),
      ),
    ).toEqual({
      ok: false,
      error: "bulkPrice, when provided, must be numeric.",
    });
  });

  it("accepts valid tier arrays and returns normalized JSON", () => {
    const result = validateBulkPricingJson(
      JSON.stringify([
        { qtyBreakpoint: 1, priceAfterDiscount: 49.99, bulkPrice: 59.99 },
        { qtyBreakpoint: 5, priceAfterDiscount: 46.99 },
      ]),
    );

    expect(result).toEqual({
      ok: true,
      normalized:
        '[{"qtyBreakpoint":1,"priceAfterDiscount":49.99,"bulkPrice":59.99},{"qtyBreakpoint":5,"priceAfterDiscount":46.99}]',
    });
  });
});
