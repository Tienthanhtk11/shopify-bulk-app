import type { ActionFunctionArgs } from "@remix-run/node";
import { destroyInternalAdminUserSession } from "../services/internal-admin-portal.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return destroyInternalAdminUserSession(request);
};
