import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { serverConfig } from "../config.server";
import { processPendingDeletionRequests } from "../models/merchant.server";

function assertAuthorized(request: Request) {
  const configuredSecret = serverConfig.jobRunnerSecret;
  if (!configuredSecret) {
    throw new Response("JOB_RUNNER_SECRET is not configured.", { status: 503 });
  }

  const providedSecret = request.headers.get("x-job-secret");
  if (providedSecret !== configuredSecret) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  assertAuthorized(request);
  const results = await processPendingDeletionRequests(25);
  return json({ ok: true, processed: results.length, results });
};