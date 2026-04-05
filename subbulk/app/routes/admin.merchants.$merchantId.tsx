import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import {
  createAdminMerchantPlanSnapshot,
  createMerchantInternalNote,
  getMerchantDetailById,
  processDeletionRequestById,
  updateMerchantStatusById,
} from "../models/merchant.server";
import { getAdminPlanDefinitionByKey, listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";
import { isExpiredMerchantPlan } from "../services/merchant-plan-timeline.shared";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireInternalAdminUser(request);
  const merchantId = params.merchantId;
  if (!merchantId) {
    throw new Response("Not Found", { status: 404 });
  }

  const merchant = await getMerchantDetailById(merchantId);
  if (!merchant) {
    throw new Response("Not Found", { status: 404 });
  }

  const currentPlan = merchant.plans[0] ?? null;
  const entitlements = resolveEntitlements(currentPlan);
  const planCatalog = await getAdminPlanDefinitionByKey(entitlements.planKey);
  const availablePlans = (await listAdminPlanDefinitions()).filter((plan) => plan.isActive);

  return { merchant, currentPlan, entitlements, planCatalog, availablePlans };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireInternalAdminUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const merchantId = String(formData.get("merchantId") || "").trim();

  if (intent === "processDeletionRequest") {
    const requestId = String(formData.get("requestId") || "").trim();
    if (!requestId) {
      return json({ ok: false, error: "Missing deletion request id." }, { status: 400 });
    }

    await processDeletionRequestById(requestId, `internal.portal:${user.email}`);
    return json({ ok: true, message: "Deletion request processed." });
  }

  if (!merchantId) {
    return json({ ok: false, error: "Missing merchant id." }, { status: 400 });
  }

  if (intent === "updateMerchantStatus") {
    const status = String(formData.get("status") || "active");
    const note = String(formData.get("note") || "").trim();
    await updateMerchantStatusById({ merchantId, status, actor: user.email, note });
    return json({ ok: true, message: `Merchant status updated to ${status}.` });
  }

  if (intent === "assignPlan") {
    const planKey = String(formData.get("planKey") || "free");
    const status = String(formData.get("status") || "active");
    const billingInterval = String(formData.get("billingInterval") || "monthly");
    const note = String(formData.get("note") || "").trim();
    const isTest = String(formData.get("isTest") || "") === "true";
    const selectedPlan = await getAdminPlanDefinitionByKey(planKey);

    await createAdminMerchantPlanSnapshot({
      merchantId,
      actor: user.email,
      planKey,
      planName: selectedPlan?.name || planKey,
      status,
      billingInterval,
      isTest,
      note,
    });

    return json({ ok: true, message: `Assigned ${selectedPlan?.name || planKey} package.` });
  }

  if (intent === "addInternalNote") {
    const note = String(formData.get("note") || "").trim();
    const severity = String(formData.get("severity") || "info");
    if (!note) {
      return json({ ok: false, error: "Internal note cannot be empty." }, { status: 400 });
    }

    await createMerchantInternalNote({ merchantId, actor: user.email, note, severity });
    return json({ ok: true, message: "Internal note added." });
  }

  return json({ ok: false, error: "Unsupported action." }, { status: 400 });
};

export default function InternalAdminMerchantDetailPage() {
  const { merchant, currentPlan, entitlements, planCatalog, availablePlans } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isCurrentPlanExpired = isExpiredMerchantPlan(currentPlan);
  const enabledFeatures = Object.entries(entitlements.features).filter(([, enabled]) => enabled);
  const noteFormRef = useRef<HTMLFormElement | null>(null);
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string; key: number } | null>(null);

  useEffect(() => {
    if (!actionData) {
      return;
    }

    setToast({
      tone: actionData.ok ? "success" : "error",
      message: "message" in actionData ? actionData.message : actionData.error,
      key: Date.now(),
    });

    if (actionData.ok && "message" in actionData && actionData.message === "Internal note added.") {
      noteFormRef.current?.reset();
    }
  }, [actionData]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = setTimeout(() => {
      setToast(null);
    }, 2800);

    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <div style={styles.page}>
      {toast ? (
        <div style={styles.toastViewport}>
          <div style={{ ...styles.toast, ...(toast.tone === "success" ? styles.toastSuccess : styles.toastError) }}>
            <div>
              <p style={styles.toastTitle}>{toast.tone === "success" ? "Merchant updated" : "Update failed"}</p>
              <p style={styles.toastMessage}>{toast.message}</p>
            </div>
            <button style={styles.toastCloseButton} type="button" onClick={() => setToast(null)}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <section style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.heroIcon}>storefront</div>
          <div>
            <h1 style={styles.heading}>{merchant.shopDomain}</h1>
            <div style={styles.badgesRow}>
              <span style={{ ...styles.badge, ...styles.badgeActive }}>{merchant.status.toUpperCase()}</span>
              <span style={{ ...styles.badge, ...styles.badgePlan }}>
                PLAN: {(currentPlan?.planName || planCatalog?.name || "Free").toUpperCase()}
              </span>
              {isCurrentPlanExpired ? <span style={{ ...styles.badge, ...styles.badgeExpired }}>EXPIRED</span> : null}
              <span style={styles.merchantId}>ID: {merchant.shopGid || merchant.id}</span>
            </div>
          </div>
        </div>

        <div style={styles.headerActions}>
          <Link style={styles.secondaryButtonLink} to="#event-log">
            Audit Log
          </Link>
          <button style={styles.primaryButton} type="submit" form="package-data-form" disabled={isSubmitting}>
            Save Snapshot
          </button>
        </div>
      </section>

      <div style={styles.breadcrumbRow}>
        <Link to="/admin/merchants" style={styles.backLink}>
          Back To Merchant Grid
        </Link>
        <span style={styles.breadcrumbMeta}>Last seen {formatDate(merchant.lastSeenAt)}</span>
      </div>

      <div style={styles.workspaceGrid}>
        <div style={styles.leftColumn}>
          <section style={styles.dualPanelGrid}>
            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>tune</span>
                <h2 style={styles.panelTitle}>Operational Controls</h2>
              </div>
              <Form method="post" style={styles.formStack}>
                <input type="hidden" name="intent" value="updateMerchantStatus" />
                <input type="hidden" name="merchantId" value={merchant.id} />
                <label style={styles.label}>
                  <span>Merchant Status</span>
                  <select name="status" defaultValue={merchant.status} style={styles.input}>
                    <option value="active">ACTIVE</option>
                    <option value="frozen">FROZEN</option>
                    <option value="disabled">DISABLED</option>
                    <option value="uninstalled">UNINSTALLED</option>
                  </select>
                </label>
                <label style={styles.label}>
                  <span>Administrative Notes</span>
                  <textarea name="note" rows={3} style={styles.textarea} placeholder="Enter status justification..." />
                </label>
                <button style={styles.outlineAction} type="submit" disabled={isSubmitting}>
                  Update Status
                </button>
              </Form>
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>inventory</span>
                <h2 style={styles.panelTitle}>Package Data</h2>
              </div>
              <Form id="package-data-form" method="post" style={styles.formStack}>
                <input type="hidden" name="intent" value="assignPlan" />
                <input type="hidden" name="merchantId" value={merchant.id} />
                <div style={styles.detailList}>
                  <div style={styles.detailRow}>
                    <span>Billing Status</span>
                    <select name="status" defaultValue={currentPlan?.status || "active"} style={styles.inlineSelect}>
                      <option value="active">CURRENT</option>
                      <option value="trialing">TRIALING</option>
                      <option value="pending_approval">PENDING</option>
                      <option value="frozen">FROZEN</option>
                      <option value="canceled">CANCELED</option>
                    </select>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Package Tier</span>
                    <select name="planKey" defaultValue={entitlements.planKey} style={styles.inlineSelect}>
                      {availablePlans.map((plan) => (
                        <option key={plan.key} value={plan.key}>
                          {plan.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.detailRow}>
                    <span>Interval</span>
                    <select name="billingInterval" defaultValue={currentPlan?.billingInterval || "monthly"} style={styles.inlineSelect}>
                      <option value="monthly">MONTHLY</option>
                      <option value="yearly">YEARLY</option>
                      <option value="annual">ANNUAL</option>
                    </select>
                  </div>
                  <div style={styles.detailToggleRow}>
                    <span>Test Subscription</span>
                    <label style={styles.toggleShell}>
                      <input
                        type="checkbox"
                        name="isTest"
                        value="true"
                        defaultChecked={currentPlan?.isTest || false}
                        style={styles.hiddenCheckbox}
                      />
                      <span style={styles.toggleTrack}>
                        <span style={styles.toggleKnob} />
                      </span>
                    </label>
                  </div>
                </div>
                <label style={styles.label}>
                  <span>Ops Note</span>
                  <textarea name="note" rows={3} style={styles.textarea} placeholder="Upgrade, downgrade, freeze reason, exception..." />
                </label>
                <div style={styles.modeBadge}>MODE: SIMULATION ENABLED</div>
                <button style={styles.outlineAction} type="submit" disabled={isSubmitting}>
                  Save Package Snapshot
                </button>
              </Form>
            </section>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelHeaderSplit}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>flag</span>
                <h2 style={styles.panelTitle}>Active Feature Flags</h2>
              </div>
              <span style={styles.countLabel}>TOTAL ENABLED: {enabledFeatures.length.toString().padStart(2, "0")}</span>
            </div>
            <div style={styles.featuresGrid}>
              {enabledFeatures.map(([featureKey]) => (
                <div key={featureKey} style={styles.featureCard}>
                  <div>
                    <span style={styles.featureName}>{featureKey.toUpperCase()}</span>
                    <span style={styles.featureMeta}>{FEATURE_LABELS[featureKey as keyof typeof FEATURE_LABELS]}</span>
                  </div>
                  <span style={styles.featureToggleOn}>toggle_on</span>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelHeaderSplit}>
              <div style={styles.panelHeader}>
                <span style={styles.panelIcon}>badge</span>
                <h2 style={styles.panelTitle}>Merchant Record</h2>
              </div>
              <span style={styles.countLabel}>PROFILE FEED</span>
            </div>
            <div style={styles.recordGrid}>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Store Name</span>
                <strong style={styles.recordValue}>{merchant.shopName || "Not captured"}</strong>
              </div>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Contact Email</span>
                <strong style={styles.recordValue}>{merchant.email || "Not captured"}</strong>
              </div>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Country</span>
                <strong style={styles.recordValue}>{merchant.countryCode || "Unknown"}</strong>
              </div>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Currency</span>
                <strong style={styles.recordValue}>{merchant.currencyCode || "Unknown"}</strong>
              </div>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Timezone</span>
                <strong style={styles.recordValue}>{merchant.timezone || "Unknown"}</strong>
              </div>
              <div style={styles.recordCard}>
                <span style={styles.recordLabel}>Installed</span>
                <strong style={styles.recordValue}>{formatDate(merchant.installedAt)}</strong>
              </div>
            </div>
          </section>

          <section style={styles.panel} id="event-log">
            <div style={styles.panelHeader}>
              <span style={styles.panelIcon}>event_note</span>
              <h2 style={styles.panelTitle}>Event Log</h2>
            </div>
            {merchant.events.length === 0 ? <p style={styles.empty}>No events found.</p> : null}
            <div style={styles.feedList}>
              {merchant.events.map((event) => (
                <div key={event.id} style={styles.feedRow}>
                  <div>
                    <p style={styles.feedTitle}>{event.type}</p>
                    <p style={styles.feedMeta}>
                      {event.source} · {event.severity}
                    </p>
                    {readEventNote(event.payloadJson) ? <p style={styles.feedNote}>{readEventNote(event.payloadJson)}</p> : null}
                  </div>
                  <span style={styles.feedTime}>{formatDate(event.createdAt)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={styles.rightColumn}>
          <section style={styles.sidePanel}>
            <h3 style={styles.sideTitle}>Merchant Snapshot</h3>
            <div style={styles.snapshotGrid}>
              <div>
                <span style={styles.snapshotLabel}>Installed</span>
                <strong style={styles.snapshotValue}>{formatDate(merchant.installedAt)}</strong>
              </div>
              <div>
                <span style={styles.snapshotLabel}>Uninstalled</span>
                <strong style={styles.snapshotValue}>{merchant.uninstalledAt ? formatDate(merchant.uninstalledAt) : "Still installed"}</strong>
              </div>
              <div>
                <span style={styles.snapshotLabel}>Current Package</span>
                <strong style={styles.snapshotValue}>{currentPlan?.planName || planCatalog?.name || "Free"}</strong>
              </div>
              <div>
                <span style={styles.snapshotLabel}>Access State</span>
                <strong style={styles.snapshotValue}>{entitlements.hasActivePlanAccess ? "Allowed" : "Blocked"}</strong>
              </div>
              <div>
                <span style={styles.snapshotLabel}>Current Period End</span>
                <strong style={styles.snapshotValue}>
                  {currentPlan?.currentPeriodEndAt ? formatDate(currentPlan.currentPeriodEndAt) : "Not synced yet"}
                </strong>
              </div>
              <div>
                <span style={styles.snapshotLabel}>Plan Purchased</span>
                <strong style={styles.snapshotValue}>{currentPlan?.activatedAt ? formatDate(currentPlan.activatedAt) : "Unknown"}</strong>
              </div>
            </div>
          </section>

          <section style={styles.sidePanel}>
            <h3 style={styles.sideTitle}>Internal Notes</h3>
            <Form method="post" style={styles.formStack} ref={noteFormRef}>
              <input type="hidden" name="intent" value="addInternalNote" />
              <input type="hidden" name="merchantId" value={merchant.id} />
              <label style={styles.label}>
                <span>Severity</span>
                <select name="severity" defaultValue="info" style={styles.input}>
                  <option value="info">INFO</option>
                  <option value="warning">WARNING</option>
                  <option value="critical">CRITICAL</option>
                </select>
              </label>
              <label style={styles.label}>
                <span>Note</span>
                <textarea
                  name="note"
                  rows={4}
                  style={styles.textarea}
                  placeholder="Commercial context, billing exception, support escalation..."
                />
              </label>
              <button style={styles.primaryWideButton} type="submit" disabled={isSubmitting}>
                Add Note
              </button>
            </Form>
          </section>

          <section style={styles.sidePanel}>
            <h3 style={styles.sideTitle}>Billing Plans</h3>
            {merchant.plans.length === 0 ? <p style={styles.empty}>No plan history yet.</p> : null}
            <div style={styles.compactList}>
              {merchant.plans.map((plan) => (
                <div key={plan.id} style={styles.compactRow}>
                  <div>
                    <p style={styles.feedTitle}>{plan.planName}</p>
                    <p style={styles.feedMeta}>
                      {plan.planKey} · {plan.billingInterval || "unknown interval"}
                    </p>
                    {plan.currentPeriodEndAt ? (
                      <p style={styles.feedNote}>Current period end: {formatDate(plan.currentPeriodEndAt)}</p>
                    ) : null}
                  </div>
                  <div style={styles.planHistoryStatus}>
                    <span style={styles.feedTime}>{plan.status}</span>
                    {isExpiredMerchantPlan(plan) ? <span style={{ ...styles.badge, ...styles.badgeExpired }}>EXPIRED</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.sidePanel}>
            <h3 style={styles.sideTitle}>Deletion Requests</h3>
            {merchant.deletionRequests.length === 0 ? <p style={styles.empty}>No deletion requests found.</p> : null}
            <div style={styles.compactList}>
              {merchant.deletionRequests.map((request) => (
                <div key={request.id} style={styles.compactRow}>
                  <div>
                    <p style={styles.feedTitle}>{request.requestedBy}</p>
                    <p style={styles.feedMeta}>
                      {request.status} · {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {request.status === "pending" ? (
                    <Form method="post">
                      <input type="hidden" name="intent" value="processDeletionRequest" />
                      <input type="hidden" name="requestId" value={request.id} />
                      <button style={styles.smallAction} type="submit" disabled={isSubmitting}>
                        Process
                      </button>
                    </Form>
                  ) : (
                    <span style={styles.feedTime}>{request.status}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function readEventNote(payloadJson: string) {
  try {
    const parsed = JSON.parse(payloadJson) as { note?: string | null };
    return parsed.note || null;
  } catch {
    return null;
  }
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "grid", gap: "28px", color: "#dae2fd" },
  toastViewport: { position: "fixed", top: "88px", right: "32px", zIndex: 40, display: "flex", justifyContent: "end", pointerEvents: "none" },
  toast: { minWidth: "320px", maxWidth: "420px", padding: "16px 18px", borderRadius: "14px", border: "1px solid transparent", display: "flex", alignItems: "start", justifyContent: "space-between", gap: "16px", backdropFilter: "blur(18px)", boxShadow: "0 24px 60px rgba(3,8,20,0.45)", pointerEvents: "auto" },
  toastSuccess: { background: "rgba(8, 25, 36, 0.92)", borderColor: "rgba(60,243,255,0.28)", color: "#dafbff" },
  toastError: { background: "rgba(34, 12, 18, 0.94)", borderColor: "rgba(255,180,171,0.24)", color: "#ffe2dd" },
  toastTitle: { margin: 0, fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "16px", fontWeight: 800 },
  toastMessage: { margin: "6px 0 0", fontFamily: '"Space Grotesk", sans-serif', fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.88 },
  toastCloseButton: { border: "1px solid rgba(133,147,153,0.18)", background: "rgba(255,255,255,0.04)", color: "inherit", minWidth: "92px", height: "36px", borderRadius: "999px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", cursor: "pointer" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px", paddingBottom: "28px", borderBottom: "1px solid rgba(60,73,78,0.12)" },
  headerLeft: { display: "flex", alignItems: "center", gap: "20px" },
  heroIcon: { width: "64px", height: "64px", borderRadius: "12px", background: "#171f33", border: "1px solid rgba(60,243,255,0.2)", boxShadow: "0 0 15px rgba(60,243,255,0.1)", fontFamily: '"Material Symbols Outlined"', fontSize: "32px", color: "#3cf3ff", display: "grid", placeItems: "center" },
  heading: { margin: 0, fontSize: "34px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif', letterSpacing: "-0.03em" },
  badgesRow: { display: "flex", alignItems: "center", gap: "10px", marginTop: "8px", flexWrap: "wrap" },
  badge: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 8px", borderRadius: "4px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" },
  badgeActive: { background: "rgba(83,212,200,0.12)", color: "#73f1e4" },
  badgePlan: { background: "rgba(84,141,255,0.12)", color: "#afc6ff" },
  badgeExpired: { background: "rgba(147,0,10,0.22)", color: "#ffb4ab" },
  merchantId: { color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" },
  headerActions: { display: "flex", gap: "12px" },
  secondaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(133,147,153,0.24)", background: "#171f33", color: "#dae2fd", padding: "12px 16px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer" },
  secondaryButtonLink: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(133,147,153,0.24)", background: "#171f33", color: "#dae2fd", padding: "12px 16px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", textDecoration: "none" },
  primaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: 0, background: "linear-gradient(135deg, #3cf3ff, #00d6e1)", color: "#00363a", padding: "12px 16px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer", boxShadow: "0 0 20px rgba(60,243,255,0.2)" },
  breadcrumbRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" },
  backLink: { color: "#3cf3ff", textDecoration: "none", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em" },
  breadcrumbMeta: { color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  workspaceGrid: { display: "grid", gridTemplateColumns: "8fr 4fr", gap: "32px" },
  leftColumn: { display: "grid", gap: "24px" },
  rightColumn: { display: "grid", gap: "24px", alignContent: "start" },
  dualPanelGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px" },
  panel: { background: "rgba(23,31,51,0.4)", backdropFilter: "blur(20px)", border: "1px solid rgba(60,73,78,0.1)", borderRadius: "8px", padding: "24px", display: "grid", gap: "18px" },
  sidePanel: { background: "#131b2e", border: "1px solid rgba(60,73,78,0.12)", borderRadius: "8px", padding: "20px", display: "grid", gap: "16px" },
  panelHeader: { display: "flex", alignItems: "center", gap: "10px" },
  panelHeaderSplit: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" },
  panelIcon: { fontFamily: '"Material Symbols Outlined"', fontSize: "18px", color: "#3cf3ff" },
  panelTitle: { margin: 0, fontSize: "13px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif', textTransform: "uppercase", letterSpacing: "0.16em" },
  sideTitle: { margin: 0, fontSize: "16px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  recordGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" },
  recordCard: { display: "grid", gap: "8px", padding: "16px", borderRadius: "8px", background: "rgba(6,14,32,0.72)", border: "1px solid rgba(60,73,78,0.12)" },
  recordLabel: { color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  recordValue: { color: "#dae2fd", fontSize: "14px", lineHeight: 1.5 },
  countLabel: { color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  formStack: { display: "grid", gap: "12px" },
  label: { display: "grid", gap: "6px", color: "#bbc9cf", fontSize: "12px" },
  input: { border: 0, background: "#2d3449", color: "#dae2fd", padding: "12px", fontSize: "14px", outline: "none" },
  textarea: { border: 0, background: "#2d3449", color: "#dae2fd", padding: "12px", fontSize: "14px", resize: "vertical", outline: "none" },
  outlineAction: { width: "100%", padding: "12px 14px", border: "1px solid #3cf3ff", background: "transparent", color: "#3cf3ff", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer" },
  detailList: { display: "grid", gap: "6px" },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(60,73,78,0.08)", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  inlineSelect: { background: "transparent", border: 0, color: "#dae2fd", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", outline: "none", textAlign: "right" },
  detailToggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  toggleShell: { position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" },
  hiddenCheckbox: { position: "absolute", opacity: 0, pointerEvents: "none" },
  toggleTrack: { width: "44px", height: "24px", borderRadius: "999px", background: "#3cf3ff", display: "inline-flex", alignItems: "center", padding: "2px" },
  toggleKnob: { width: "20px", height: "20px", borderRadius: "999px", background: "#ffffff", marginLeft: "20px" },
  modeBadge: { background: "repeating-linear-gradient(45deg, #2d3449, #2d3449 10px, #222a3d 10px, #222a3d 20px)", border: "1px solid rgba(60,73,78,0.12)", borderRadius: "4px", padding: "12px", color: "#dae2fd", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" },
  featureCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "14px", background: "#131b2e", border: "1px solid rgba(60,73,78,0.12)", borderRadius: "8px" },
  featureName: { display: "block", color: "#dae2fd", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700 },
  featureMeta: { display: "block", marginTop: "4px", color: "#859399", fontSize: "10px" },
  featureToggleOn: { fontFamily: '"Material Symbols Outlined"', fontSize: "28px", color: "#73f1e4" },
  snapshotGrid: { display: "grid", gap: "14px" },
  snapshotLabel: { display: "block", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "6px" },
  snapshotValue: { color: "#dae2fd", fontSize: "13px" },
  primaryWideButton: { width: "100%", border: 0, background: "linear-gradient(135deg, #3cf3ff, #00d6e1)", color: "#00363a", padding: "12px 16px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer" },
  compactList: { display: "grid", gap: "10px" },
  compactRow: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px", paddingBottom: "10px", borderBottom: "1px solid rgba(60,73,78,0.08)" },
  planHistoryStatus: { display: "grid", justifyItems: "end", gap: "8px" },
  feedList: { display: "grid", gap: "12px" },
  feedRow: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(60,73,78,0.08)" },
  feedTitle: { margin: 0, color: "#dae2fd", fontSize: "13px", fontWeight: 600 },
  feedMeta: { margin: "4px 0 0", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em" },
  feedNote: { margin: "6px 0 0", color: "#bbc9cf", fontSize: "12px", lineHeight: 1.5 },
  feedTime: { color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", whiteSpace: "nowrap" },
  smallAction: { border: "1px solid rgba(60,243,255,0.2)", background: "rgba(60,243,255,0.08)", color: "#3cf3ff", padding: "8px 10px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer" },
  empty: { margin: 0, color: "#859399" },
};
