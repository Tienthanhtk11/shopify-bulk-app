import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { serverConfig } from "./config.server";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: serverConfig.shopifyApiKey,
  apiSecretKey: serverConfig.shopifyApiSecret,
  apiVersion: ApiVersion.January25,
  scopes: serverConfig.scopes,
  appUrl: serverConfig.shopifyAppUrlString,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    expiringOfflineAccessTokens: true,
  },
  ...(serverConfig.shopCustomDomain
    ? { customShopDomains: [serverConfig.shopCustomDomain] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
