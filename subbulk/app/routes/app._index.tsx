import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const billingReturn = url.searchParams.get("billingReturn")?.trim() === "1";
  const returnTo = url.searchParams.get("returnTo")?.trim() ?? "";

  if (billingReturn) {
    const destination = new URL("/app/welcome", url.origin);

    for (const [key, value] of url.searchParams.entries()) {
      if (key === "billingReturn") continue;
      destination.searchParams.set(key, value);
    }

    throw redirect(`${destination.pathname}${destination.search}`);
  }

  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    const destination = new URL(returnTo, url.origin);

    for (const [key, value] of url.searchParams.entries()) {
      if (key === "returnTo" || destination.searchParams.has(key)) continue;
      destination.searchParams.set(key, value);
    }

    throw redirect(`${destination.pathname}${destination.search}`);
  }

  const search = url.search || "";
  throw redirect(`/app/settings${search}`);
};

export default function AppIndexRedirect() {
  return null;
}
