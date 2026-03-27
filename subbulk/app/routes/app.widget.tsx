import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.search || "";
  throw redirect(`/app/settings${search}`);
};

export default function WidgetRedirectPage() {
  return null;
}
