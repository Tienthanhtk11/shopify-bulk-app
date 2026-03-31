import type { MerchantPlan } from "../../generated/prisma/client";
import type { EntitledFeatureKey } from "./entitlements.shared";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { merchantCanWrite } from "./billing-access.shared";
export { merchantCanAccessPath, merchantCanWrite, requiredFeatureForPath } from "./billing-access.shared";

type MerchantSessionLike = {
  shop: string;
  email?: string | null;
};

export async function assertMerchantWriteAccess(input: {
  session: MerchantSessionLike;
  redirect: (url: string) => never;
  requiredFeature?: EntitledFeatureKey | null;
}) {
  await upsertMerchantFromSession(input.session);
  const latestPlan = await getLatestMerchantPlan(input.session.shop);
  const access = merchantCanWrite(latestPlan, input.requiredFeature ?? null);

  if (!access.allowed) {
    const query = new URLSearchParams();
    if (access.requiredFeature) {
      query.set("required", access.requiredFeature);
    }
    if (access.reason) {
      query.set("writeBlocked", access.reason);
    }
    throw input.redirect(`/app/billing?${query.toString()}`);
  }

  return {
    latestPlan,
    entitlements: access.entitlements,
  };
}