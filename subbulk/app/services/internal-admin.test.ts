import { afterEach, describe, expect, it } from "vitest";
import {
  assertInternalAdminSession,
  isInternalAdminSession,
} from "./internal-admin.server";

const originalEnv = {
  INTERNAL_ADMIN_SHOPS: process.env.INTERNAL_ADMIN_SHOPS,
  INTERNAL_ADMIN_EMAILS: process.env.INTERNAL_ADMIN_EMAILS,
};

afterEach(() => {
  if (originalEnv.INTERNAL_ADMIN_SHOPS === undefined) {
    delete process.env.INTERNAL_ADMIN_SHOPS;
  } else {
    process.env.INTERNAL_ADMIN_SHOPS = originalEnv.INTERNAL_ADMIN_SHOPS;
  }

  if (originalEnv.INTERNAL_ADMIN_EMAILS === undefined) {
    delete process.env.INTERNAL_ADMIN_EMAILS;
  } else {
    process.env.INTERNAL_ADMIN_EMAILS = originalEnv.INTERNAL_ADMIN_EMAILS;
  }
});

describe("isInternalAdminSession", () => {
  it("authorizes matching shops and emails regardless of case", () => {
    process.env.INTERNAL_ADMIN_SHOPS = "ops-shop.myshopify.com, second-shop.myshopify.com";
    process.env.INTERNAL_ADMIN_EMAILS = "ops@example.com, team@example.com";

    expect(
      isInternalAdminSession({
        shop: "OPS-SHOP.myshopify.com",
      }),
    ).toBe(true);

    expect(
      isInternalAdminSession({
        shop: "merchant.myshopify.com",
        email: "TEAM@example.com",
      }),
    ).toBe(true);
  });

  it("rejects sessions outside the allow-list", () => {
    process.env.INTERNAL_ADMIN_SHOPS = "ops-shop.myshopify.com";
    process.env.INTERNAL_ADMIN_EMAILS = "ops@example.com";

    expect(
      isInternalAdminSession({
        shop: "merchant.myshopify.com",
        email: "merchant@example.com",
      }),
    ).toBe(false);
  });
});

describe("assertInternalAdminSession", () => {
  it("throws a 403 response for unauthorized sessions", () => {
    process.env.INTERNAL_ADMIN_SHOPS = "ops-shop.myshopify.com";
    process.env.INTERNAL_ADMIN_EMAILS = "ops@example.com";

    expect(() =>
      assertInternalAdminSession({
        shop: "merchant.myshopify.com",
        email: "merchant@example.com",
      }),
    ).toThrowError(Response);
  });
});
