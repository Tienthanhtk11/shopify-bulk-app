import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { serverConfig } from "../config.server";
import { authenticateInternalAdminAccount, getInternalAdminAccountById } from "./internal-admin-accounts.server";

type InternalAdminSessionData = {
  id: string;
  email: string;
  displayName: string;
};

const internalAdminSessionStorage = createCookieSessionStorage<InternalAdminSessionData>({
  cookie: {
    name: "__subbulk_internal_admin",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secrets: [serverConfig.internalAdminSessionSecret],
    secure: serverConfig.isProduction,
    maxAge: 60 * 60 * 12,
  },
});

export async function authenticateInternalAdminLogin(email: string, password: string) {
  const account = await authenticateInternalAdminAccount(email, password);
  if (!account) {
    return null;
  }

  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
  };
}

export async function createInternalAdminUserSession(request: Request, user: InternalAdminSessionData) {
  const session = await internalAdminSessionStorage.getSession(request.headers.get("Cookie"));
  session.set("user", user);

  return redirect("/admin/merchants", {
    headers: {
      "Set-Cookie": await internalAdminSessionStorage.commitSession(session),
    },
  });
}

export async function getInternalAdminUser(request: Request) {
  const session = await internalAdminSessionStorage.getSession(request.headers.get("Cookie"));
  const currentUser = (session.get("user") as InternalAdminSessionData | undefined) || null;
  if (!currentUser?.id) {
    return null;
  }

  const account = await getInternalAdminAccountById(currentUser.id);
  if (!account || !account.isActive) {
    return null;
  }

  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
  };
}

export async function requireInternalAdminUser(request: Request) {
  const user = await getInternalAdminUser(request);
  if (!user) {
    const url = new URL(request.url);
    throw redirect(`/admin/login?next=${encodeURIComponent(url.pathname + url.search)}`);
  }

  return user;
}

export async function destroyInternalAdminUserSession(request: Request) {
  const session = await internalAdminSessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await internalAdminSessionStorage.destroySession(session),
    },
  });
}

export function isInternalAdminHost(request: Request) {
  const url = new URL(request.url);
  return serverConfig.internalAdminHosts.includes(url.hostname.toLowerCase());
}
