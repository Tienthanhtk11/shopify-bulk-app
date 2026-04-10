type WidgetRenderStateInput = {
  showWidgetOnProductPage: boolean;
  widgetEnabledForProduct: boolean;
  productHasSubscriptionPlan: boolean;
};

type ScopeMode = "scope" | "passthrough";

function splitSelectors(input: string) {
  const selectors: string[] = [];
  let current = "";
  let parenDepth = 0;
  let bracketDepth = 0;

  for (const character of input) {
    if (character === "(") parenDepth += 1;
    if (character === ")") parenDepth = Math.max(0, parenDepth - 1);
    if (character === "[") bracketDepth += 1;
    if (character === "]") bracketDepth = Math.max(0, bracketDepth - 1);

    if (character === "," && parenDepth === 0 && bracketDepth === 0) {
      selectors.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  if (current) {
    selectors.push(current);
  }

  return selectors;
}

function prefixSelector(selector: string, scopeSelector: string) {
  const trimmed = selector.trim();
  if (!trimmed) return "";
  if (trimmed.includes(scopeSelector)) return trimmed;
  if (trimmed === "body" || trimmed === "html" || trimmed === ":root") {
    return scopeSelector;
  }
  if (trimmed.startsWith(":")) {
    return `${scopeSelector}${trimmed}`;
  }
  return `${scopeSelector} ${trimmed}`;
}

function readBlock(input: string, startIndex: number) {
  let depth = 1;
  let cursor = startIndex;

  while (cursor < input.length) {
    const character = input[cursor];
    if (character === "{") depth += 1;
    if (character === "}") depth -= 1;
    if (depth === 0) {
      return {
        content: input.slice(startIndex, cursor),
        nextIndex: cursor + 1,
      };
    }
    cursor += 1;
  }

  return {
    content: input.slice(startIndex),
    nextIndex: input.length,
  };
}

function scopeCssInternal(input: string, scopeSelector: string, mode: ScopeMode): string {
  let output = "";
  let cursor = 0;

  while (cursor < input.length) {
    const nextBrace = input.indexOf("{", cursor);
    if (nextBrace === -1) {
      output += input.slice(cursor);
      break;
    }

    const selectorChunk = input.slice(cursor, nextBrace);
    const { content, nextIndex } = readBlock(input, nextBrace + 1);
    const trimmedSelector = selectorChunk.trim();

    if (!trimmedSelector) {
      cursor = nextIndex;
      continue;
    }

    if (trimmedSelector.startsWith("@")) {
      const atRuleName = trimmedSelector.slice(1).split(/[\s{]/, 1)[0]?.toLowerCase() || "";
      const nextMode: ScopeMode = atRuleName === "media" || atRuleName === "supports" || atRuleName === "layer"
        ? "scope"
        : "passthrough";
      output += `${selectorChunk}{${scopeCssInternal(content, scopeSelector, nextMode)}}`;
      cursor = nextIndex;
      continue;
    }

    const resolvedSelector = mode === "passthrough"
      ? selectorChunk
      : splitSelectors(selectorChunk)
          .map((selector) => prefixSelector(selector, scopeSelector))
          .filter(Boolean)
          .join(", ");

    output += `${resolvedSelector}{${content}}`;
    cursor = nextIndex;
  }

  return output;
}

export function scopeWidgetCss(input: string | null | undefined, scopeSelector = ".subbulk") {
  const css = String(input || "").trim();
  if (!css) return "";
  return scopeCssInternal(css, scopeSelector, "scope").trim();
}

export function resolveWidgetRenderState(input: WidgetRenderStateInput) {
  const showWidgetOnProductPage = Boolean(input.showWidgetOnProductPage);
  const widgetEnabledForProduct = Boolean(input.widgetEnabledForProduct);
  const productHasSubscriptionPlan = Boolean(input.productHasSubscriptionPlan);

  return {
    showWidgetOnProductPage,
    widgetEnabledForProduct,
    productHasSubscriptionPlan,
    isEnabled:
      showWidgetOnProductPage &&
      widgetEnabledForProduct &&
      productHasSubscriptionPlan,
  };
}