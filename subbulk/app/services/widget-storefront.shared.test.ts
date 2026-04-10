import { describe, expect, it } from "vitest";
import { resolveWidgetRenderState, scopeWidgetCss } from "./widget-storefront.shared";

describe("resolveWidgetRenderState", () => {
  it("enables the widget only when all storefront conditions are satisfied", () => {
    expect(resolveWidgetRenderState({
      showWidgetOnProductPage: true,
      widgetEnabledForProduct: true,
      productHasSubscriptionPlan: true,
    })).toEqual({
      showWidgetOnProductPage: true,
      widgetEnabledForProduct: true,
      productHasSubscriptionPlan: true,
      isEnabled: true,
    });
  });

  it("keeps the widget hidden when the product is not in the widget-enabled list", () => {
    expect(resolveWidgetRenderState({
      showWidgetOnProductPage: true,
      widgetEnabledForProduct: false,
      productHasSubscriptionPlan: true,
    }).isEnabled).toBe(false);
  });
});

describe("scopeWidgetCss", () => {
  it("prefixes top-level selectors with .subbulk", () => {
    expect(scopeWidgetCss(".badge, .price:hover { color: red; }")).toBe(
      ".subbulk .badge, .subbulk .price:hover{ color: red; }",
    );
  });

  it("scopes selectors nested inside media queries", () => {
    expect(scopeWidgetCss("@media (min-width: 768px) { .badge { color: red; } }")).toBe(
      "@media (min-width: 768px) {.subbulk .badge{ color: red; } }",
    );
  });

  it("keeps keyframes untouched while still scoping surrounding rules", () => {
    expect(scopeWidgetCss("@keyframes spin { from { opacity: 0; } to { opacity: 1; } } .cta { animation: spin 1s; }")).toBe(
      "@keyframes spin { from { opacity: 0; } to { opacity: 1; } }.subbulk .cta{ animation: spin 1s; }",
    );
  });
});