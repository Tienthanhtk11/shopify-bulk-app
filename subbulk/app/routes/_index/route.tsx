import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { isInternalAdminHost } from "../../services/internal-admin-portal.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (isInternalAdminHost(request)) {
    throw redirect("/admin/login");
  }

  const url = new URL(request.url);
  const query = url.searchParams.toString();
  throw redirect(query ? `/auth/login?${query}` : "/auth/login");
};

export default function App() {
  return null;
}
