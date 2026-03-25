import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.public.appProxy(request);
  const cur = new URL(request.url);
  if (!cur.pathname.endsWith("/portal")) {
    cur.pathname = cur.pathname.replace(/\/?$/, "") + "/portal";
  }
  return redirect(cur.toString());
};

export default function SubbulkProxyIndex() {
  return null;
}
