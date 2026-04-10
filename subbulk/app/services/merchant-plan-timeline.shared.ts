function asRecord(value: unknown) {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function parseTimelineDate(value: unknown) {
  const raw = readString(value);
  if (!raw) {
    return null;
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function deriveTrialEndsAt(createdAt: Date | null, trialDays: number | null) {
  if (!createdAt || !trialDays || trialDays <= 0) {
    return null;
  }

  return new Date(createdAt.getTime() + trialDays * 24 * 60 * 60 * 1000);
}

export function extractSubscriptionTimeline(subscription: Record<string, unknown>) {
  const createdAt =
    parseTimelineDate(subscription.createdAt) ||
    parseTimelineDate(subscription.created_at) ||
    parseTimelineDate(subscription.activatedAt) ||
    parseTimelineDate(subscription.activated_at);
  const trialDays = readNumber(subscription.trialDays) || readNumber(subscription.trial_days);
  const currentPeriodEndAt =
    parseTimelineDate(subscription.currentPeriodEnd) ||
    parseTimelineDate(subscription.current_period_end) ||
    parseTimelineDate(subscription.currentPeriodEndAt) ||
    parseTimelineDate(subscription.current_period_end_at) ||
    parseTimelineDate(subscription.billingOn) ||
    parseTimelineDate(subscription.billing_on);
  const canceledAt =
    parseTimelineDate(subscription.canceledAt) ||
    parseTimelineDate(subscription.canceled_at) ||
    parseTimelineDate(subscription.cancelledAt) ||
    parseTimelineDate(subscription.cancelled_at) ||
    parseTimelineDate(subscription.canceledOn) ||
    parseTimelineDate(subscription.cancelled_on);
  const trialEndsAt =
    parseTimelineDate(subscription.trialEndsAt) ||
    parseTimelineDate(subscription.trial_ends_at) ||
    parseTimelineDate(subscription.trialEndsOn) ||
    parseTimelineDate(subscription.trial_ends_on) ||
    deriveTrialEndsAt(createdAt, trialDays);

  return {
    activatedAt: createdAt,
    currentPeriodEndAt,
    trialEndsAt,
    canceledAt,
  };
}

export function extractWebhookSubscriptionTimeline(payload: unknown) {
  return extractSubscriptionTimeline(asRecord(payload) || {});
}

export function isExpiredMerchantPlan(plan: {
  planKey?: string | null;
  currentPeriodEndAt?: string | Date | null;
}) {
  if (!plan || plan.planKey === "free" || !plan.currentPeriodEndAt) {
    return false;
  }

  const currentPeriodEndAt = new Date(plan.currentPeriodEndAt);
  return !Number.isNaN(currentPeriodEndAt.getTime()) && currentPeriodEndAt.getTime() <= Date.now();
}

export function isMerchantPlanCancellationScheduled(plan: {
  planKey?: string | null;
  status?: string | null;
  currentPeriodEndAt?: string | Date | null;
  canceledAt?: string | Date | null;
}) {
  if (!plan || plan.planKey === "free" || isExpiredMerchantPlan(plan)) {
    return false;
  }

  const normalizedStatus = String(plan.status || "").trim().toLowerCase();
  if (normalizedStatus === "cancelled" || normalizedStatus === "canceled") {
    return true;
  }

  if (plan.canceledAt instanceof Date) {
    return !Number.isNaN(plan.canceledAt.getTime());
  }

  return Boolean(parseTimelineDate(plan.canceledAt));
}