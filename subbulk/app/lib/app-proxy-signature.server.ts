import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

/**
 * Xác thực App Proxy (HMAC) không tải session / không refresh token.
 * Dùng cho JSON public (vd. subscription preview) — tránh 500 khi offline token lỗi.
 */
function proxyValidationApi() {
  const raw = process.env.SHOPIFY_APP_URL || "https://localhost";
  const appUrl = new URL(raw);
  return shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
    apiVersion: ApiVersion.January25,
    hostName: appUrl.host,
    hostScheme: appUrl.protocol.replace(":", "") || "https",
    isEmbeddedApp: true,
  });
}

/** Giống logic @shopify/shopify-app-remix authenticate/public/appProxy. */
export async function isValidAppProxyRequest(request: Request): Promise<boolean> {
  const api = proxyValidationApi();
  const url = new URL(request.url);
  try {
    let searchParams = new URLSearchParams(url.search);
    if (!searchParams.get("index")) {
      searchParams.delete("index");
    }
    let isValid = await api.utils.validateHmac(
      Object.fromEntries(searchParams.entries()),
      { signator: "appProxy" },
    );
    if (!isValid) {
      const cleanPath = url.pathname
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replaceAll("/", ".");
      const data = `routes%2F${cleanPath}`;
      searchParams = new URLSearchParams(
        `?_data=${data}&${searchParams.toString().replace(/^\?/, "")}`,
      );
      isValid = await api.utils.validateHmac(
        Object.fromEntries(searchParams.entries()),
        { signator: "appProxy" },
      );
      if (!isValid) {
        const sp2 = new URLSearchParams(
          `?_data=${data}._index&${url.search.replace(/^\?/, "")}`,
        );
        isValid = await api.utils.validateHmac(
          Object.fromEntries(sp2.entries()),
          { signator: "appProxy" },
        );
      }
    }
    return isValid;
  } catch {
    return false;
  }
}
