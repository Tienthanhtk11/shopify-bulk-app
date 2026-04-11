import { describe, expect, it, vi } from "vitest";

vi.mock("../generated/api", () => ({
  DiscountApplicationStrategy: {
    First: "FIRST",
    Maximum: "MAXIMUM",
  },
}));

import { run } from "../src/run";

function buildCartLine(overrides = {}) {
  return {
    id: "gid://shopify/CartLine/1",
    quantity: 5,
    merchandise: {
      __typename: "ProductVariant",
      product: {
        metafield: {
          value: JSON.stringify([
            { qtyBreakpoint: 1, priceAfterDiscount: 50, bulkPrice: 60 },
            { qtyBreakpoint: 5, priceAfterDiscount: 45, bulkPrice: 55 },
          ]),
        },
      },
    },
    cost: {
      amountPerQuantity: {
        amount: "50.00",
      },
      compareAtAmountPerQuantity: null,
    },
    sellingPlanAllocation: null,
    ...overrides,
  };
}

describe("subbulk discount run", () => {
  it("returns no discounts when no bulk pricing metafield is present", () => {
    const result = run({
      cart: {
        lines: [
          buildCartLine({
            merchandise: {
              __typename: "ProductVariant",
              product: {
                metafield: null,
              },
            },
          }),
        ],
      },
    });

    expect(result).toEqual({
      discountApplicationStrategy: "FIRST",
      discounts: [],
    });
  });

  it("applies the matching bulk tier as a fixed amount discount per item", () => {
    const result = run({
      cart: {
        lines: [buildCartLine()],
      },
    });

    expect(result).toEqual({
      discountApplicationStrategy: "MAXIMUM",
      discounts: [
        {
          message: "Bulk Discount (5+ items)",
          targets: [{ cartLine: { id: "gid://shopify/CartLine/1" } }],
          value: {
            fixedAmount: {
              amount: "5",
              appliesToEachItem: true,
            },
          },
        },
      ],
    });
  });

  it("preserves the subscription ratio when a selling plan is already discounting the line", () => {
    const result = run({
      cart: {
        lines: [
          buildCartLine({
            quantity: 5,
            cost: {
              amountPerQuantity: {
                amount: "90.00",
              },
              compareAtAmountPerQuantity: {
                amount: "100.00",
              },
            },
            sellingPlanAllocation: {
              sellingPlan: {
                name: "Subscribe & Save 10%",
              },
            },
          }),
        ],
      },
    });

    expect(result).toEqual({
      discountApplicationStrategy: "MAXIMUM",
      discounts: [
        {
          message: "Bulk Discount (5+ items)",
          targets: [{ cartLine: { id: "gid://shopify/CartLine/1" } }],
          value: {
            fixedAmount: {
              amount: "49.5",
              appliesToEachItem: true,
            },
          },
        },
      ],
    });
  });
});
