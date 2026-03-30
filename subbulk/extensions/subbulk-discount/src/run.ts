import type {
  RunInput,
  FunctionRunResult,
  ProductVariant,
  Discount
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type BulkTier = {
  qtyBreakpoint: number;
  priceAfterDiscount: number;
  bulkPrice: number;
};

export function run(input: RunInput): FunctionRunResult {
  const discounts: Discount[] = [];

  for (const line of input.cart.lines) {
    if (line.merchandise.__typename !== "ProductVariant") continue;
    const variant = line.merchandise as ProductVariant;
    const product = variant.product;
    if (!product.metafield?.value) continue;

    let bulkTiers: BulkTier[] = [];
    try {
      bulkTiers = JSON.parse(product.metafield.value);
    } catch (e) {
      continue;
    }

    // Must sort by qtyBreakpoint descending to find highest valid match
    bulkTiers.sort((a, b) => b.qtyBreakpoint - a.qtyBreakpoint);
    
    let activeTier: BulkTier | null = null;
    for (const tier of bulkTiers) {
      if (line.quantity >= tier.qtyBreakpoint) {
        activeTier = tier;
        break;
      }
    }

    if (activeTier) {
      const currentAmount = parseFloat(line.cost.amountPerQuantity.amount);
      const compareAtAmount = line.cost.compareAtAmountPerQuantity ? parseFloat(line.cost.compareAtAmountPerQuantity.amount) : currentAmount;
      
      let subRatio = 0;
      if (line.sellingPlanAllocation) {
        if (compareAtAmount > currentAmount) {
          subRatio = (compareAtAmount - currentAmount) / compareAtAmount;
        } else if (line.sellingPlanAllocation.sellingPlan?.name) {
          const match = line.sellingPlanAllocation.sellingPlan.name.match(/(\d+)%/);
          if (match && match[1]) {
            subRatio = parseFloat(match[1]) / 100;
          }
        }
      }

      // If subscription, target price receives the same subscription discount ratio
      const targetAmount = activeTier.priceAfterDiscount * (1 - subRatio);
      
      // Fixed discount to apply per individual item to reach the exact target final price
      let discountValue = currentAmount - targetAmount;
      // In JS subtraction can leave nasty small floating numbers, let's round
      discountValue = Math.max(0, parseFloat(discountValue.toFixed(2)));

      if (discountValue > 0) {
        discounts.push({
          message: `Bulk Discount (${activeTier.qtyBreakpoint}+ items)`,
          targets: [
            {
              cartLine: {
                id: line.id
              }
            }
          ],
          value: {
            fixedAmount: {
              amount: discountValue.toString(),
              appliesToEachItem: true
            }
          }
        });
      }
    }
  }

  if (discounts.length === 0) {
    return EMPTY_DISCOUNT;
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts,
  };
}