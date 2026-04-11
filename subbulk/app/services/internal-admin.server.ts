import { readInternalAdminAccessConfig } from "../config.server";

type SessionLike = {
  shop: string;
  email?: string | null;
};

export function isInternalAdminSession(session: SessionLike) {
  const { shops: allowedShops, emails: allowedEmails } = readInternalAdminAccessConfig();
  const shop = session.shop.toLowerCase();
  const email = String(session.email || "").toLowerCase();

  return allowedShops.includes(shop) || (email.length > 0 && allowedEmails.includes(email));
}

export function assertInternalAdminSession(session: SessionLike) {
  if (!isInternalAdminSession(session)) {
    throw new Response("Forbidden", { status: 403 });
  }
}