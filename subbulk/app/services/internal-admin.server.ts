type SessionLike = {
  shop: string;
  email?: string | null;
};

function parseCsvEnv(value: string | undefined) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isInternalAdminSession(session: SessionLike) {
  const allowedShops = parseCsvEnv(process.env.INTERNAL_ADMIN_SHOPS);
  const allowedEmails = parseCsvEnv(process.env.INTERNAL_ADMIN_EMAILS);
  const shop = session.shop.toLowerCase();
  const email = String(session.email || "").toLowerCase();

  return allowedShops.includes(shop) || (email.length > 0 && allowedEmails.includes(email));
}

export function assertInternalAdminSession(session: SessionLike) {
  if (!isInternalAdminSession(session)) {
    throw new Response("Forbidden", { status: 403 });
  }
}