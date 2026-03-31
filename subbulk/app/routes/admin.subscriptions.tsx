import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { listMerchantSubscriptionOverview } from "../models/merchant.server";
import { getCanonicalPlanName } from "../services/admin-plan-catalog.shared";
import { listAdminPlanDefinitions, updateAdminPlanDefinition } from "../services/admin-plan-catalog.server";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";

const PACKAGE_KEYS = ["free", "growth", "scale"] as const;

type PackageKey = (typeof PACKAGE_KEYS)[number];

function isPackageKey(value: string): value is PackageKey {
  return PACKAGE_KEYS.includes(value as PackageKey);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireInternalAdminUser(request);
  const merchants = await listMerchantSubscriptionOverview();
  const catalog = await listAdminPlanDefinitions();
  return { merchants, catalog };
};

function parseTextareaList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireInternalAdminUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  if (intent !== "updatePlanDefinition") {
    return json({ ok: false, error: "Unsupported action." }, { status: 400 });
  }

  const planKey = String(formData.get("planKey") || "").trim().toLowerCase();
  if (!planKey || !isPackageKey(planKey)) {
    return json({ ok: false, error: "Missing plan key." }, { status: 400 });
  }

  await updateAdminPlanDefinition({
    planKey,
    displayName: String(formData.get("displayName") || planKey),
    monthlyPrice: String(formData.get("monthlyPrice") || "$0"),
    yearlyPrice: String(formData.get("yearlyPrice") || "$0"),
    tagline: String(formData.get("tagline") || ""),
    bestFor: String(formData.get("bestFor") || ""),
    merchantFacingHighlights: parseTextareaList(formData.get("merchantFacingHighlights")),
    opsHighlights: parseTextareaList(formData.get("opsHighlights")),
    isActive: String(formData.get("isActive") || "") === "true",
    isPublic: String(formData.get("isPublic") || "") === "true",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });

  return json({ ok: true, message: `${getCanonicalPlanName(planKey)} package saved.` });
};

export default function InternalAdminSubscriptionsPage() {
  const { merchants, catalog } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [planFilter] = useState("ALL");
  const [toast, setToast] = useState<{ tone: "success" | "error"; message: string; key: number } | null>(null);

  useEffect(() => {
    if (!actionData) {
      return;
    }

    setToast({
      tone: actionData.ok ? "success" : "error",
      message: actionData.ok ? actionData.message : actionData.error,
      key: Date.now(),
    });
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

  const activeSavePlanKey =
    navigation.state === "submitting" && navigation.formData?.get("intent") === "updatePlanDefinition"
      ? String(navigation.formData.get("planKey") || "")
      : "";

  const filtered = useMemo(() => {
    return merchants.filter((merchant) =>
      planFilter === "ALL" ? true : merchant.entitlements.planKey === planFilter,
    );
  }, [merchants, planFilter]);

  const visibleCatalog = useMemo(
    () =>
      PACKAGE_KEYS.map((key) => catalog.find((plan) => plan.key === key)).filter(
        (plan): plan is (typeof catalog)[number] => Boolean(plan),
      ),
    [catalog],
  );

  const counts = {
    free: merchants.filter((merchant) => merchant.entitlements.planKey === "free").length,
    premium: merchants.filter((merchant) => merchant.entitlements.planKey === "growth").length,
    ultra: merchants.filter((merchant) => merchant.entitlements.planKey === "scale").length,
  };

  const tierConfigs: Record<string, { accent: string; tag: string; badge?: string; valueTone: string }> = {
    free: {
      accent: "#859399",
      tag: "Baseline",
      valueTone: "rgba(133, 147, 153, 0.9)",
    },
    growth: {
      accent: "#548dff",
      tag: "Acceleration",
      badge: "Popular",
      valueTone: "#548dff",
    },
    scale: {
      accent: "#3cf3ff",
      tag: "Architect",
      valueTone: "#3cf3ff",
    },
  };

  return (
    <div style={styles.page}>
      {toast ? (
        <div style={styles.toastViewport}>
          <div style={{ ...styles.toast, ...(toast.tone === "success" ? styles.toastSuccess : styles.toastError) }}>
            <div>
              <p style={styles.toastTitle}>{toast.tone === "success" ? "Package updated" : "Save failed"}</p>
              <p style={styles.toastMessage}>{toast.message}</p>
            </div>
            <button style={styles.toastCloseButton} type="button" onClick={() => setToast(null)}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <section style={styles.statsGrid}>
        <article style={{ ...styles.statCard, ...styles.statCardFree }}>
          <div>
            <p style={styles.statLabel}>Free Tier Active</p>
            <p style={styles.statValue}>{counts.free}</p>
          </div>
          <div style={styles.statTag}>Stable</div>
        </article>
        <article style={{ ...styles.statCard, ...styles.statCardGrowth }}>
          <div>
            <p style={{ ...styles.statLabel, color: "#548dff" }}>Premium Tier Active</p>
            <p style={styles.statValue}>{counts.premium}</p>
          </div>
          <div style={{ ...styles.statTag, color: "#548dff", background: "rgba(84,141,255,0.1)" }}>Trending up</div>
        </article>
        <article style={{ ...styles.statCard, ...styles.statCardScale }}>
          <div>
            <p style={{ ...styles.statLabel, color: "#3cf3ff" }}>Ultra Tier Active</p>
            <p style={styles.statValue}>{counts.ultra}</p>
          </div>
          <div style={{ ...styles.statTag, color: "#3cf3ff", background: "rgba(60,243,255,0.1)" }}>High value</div>
        </article>
      </section>

      <section style={styles.catalogGrid}>
        {visibleCatalog.map((plan) => {
          const config = tierConfigs[plan.key] || tierConfigs.free;
          return (
            <PackageCard key={plan.key} plan={plan} config={config} isSubmitting={activeSavePlanKey === plan.key} />
          );
        })}
      </section>

      <section style={styles.assignmentsCard}>
        <div style={styles.assignmentsHeader}>
          <div style={styles.assignmentsTitleRow}>
            <h3 style={styles.assignmentsTitle}>Assigned Merchants</h3>
            <span style={styles.assignmentPill}>+ {filtered.length} merchants total</span>
          </div>
          <div style={styles.assignmentsActions}>
            <button style={styles.toolbarButton} type="button">Filter</button>
            <button style={styles.toolbarButton} type="button">Export</button>
          </div>
        </div>

        <div style={styles.tableHeader}>
          <span>Merchant Name</span>
          <span>Primary Package</span>
          <span>Status Byte</span>
          <span>Last Activity</span>
          <span>Actions</span>
        </div>

        <div style={styles.tableBody}>
          {filtered.slice(0, 5).map((merchant) => (
            <div key={merchant.merchantId} style={styles.tableRow}>
              <div>
                <p style={styles.rowName}>{merchant.shopDomain.replace(/\.myshopify\.com$/i, "")}</p>
                <p style={styles.rowSubtext}>{merchant.shopDomain}</p>
              </div>
              <div>
                <p style={styles.rowName}>{getCanonicalPlanName(merchant.latestPlan?.planKey || merchant.latestPlan?.planName || merchant.catalog?.key || merchant.catalog?.name || "free")}</p>
                <p style={styles.rowSubtext}>{merchant.email || "No email stored"}</p>
              </div>
              <div>
                <span style={{ ...styles.statusPill, ...(merchant.isBlockedPaidMerchant ? styles.statusPillBlocked : styles.statusPillAllowed) }}>
                  {merchant.isBlockedPaidMerchant ? "Override" : "Current"}
                </span>
              </div>
              <div style={styles.rowSubtext}>{readRelativeTime(merchant.latestPlan?.createdAt || null)}</div>
              <div>
                <Link style={styles.rowActionLink} to={`/admin/merchants/${merchant.merchantId}`}>
                  ⋮
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.tableFooter}>
          <span>Showing 5 of {filtered.length} assigned merchants</span>
          <div style={styles.footerPager}>
            <button style={styles.pagerButton} type="button">Previous</button>
            <button style={styles.pagerButton} type="button">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function PackageCard({
  plan,
  config,
  isSubmitting,
}: {
  plan: {
    key: string;
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    tagline: string;
    bestFor: string;
    merchantFacingHighlights: string[];
    opsHighlights: string[];
    isActive: boolean;
    isPublic: boolean;
    sortOrder: number;
  };
  config: { accent: string; tag: string; badge?: string; valueTone: string };
  isSubmitting: boolean;
}) {
  const [isPublic, setIsPublic] = useState(plan.isPublic);

  return (
    <article style={{ ...styles.catalogCard, borderColor: `${config.accent}33` }}>
      {config.badge ? <div style={styles.cornerBadge}>{config.badge}</div> : null}
      <Form method="post" style={styles.formStack}>
        <input type="hidden" name="intent" value="updatePlanDefinition" />
        <input type="hidden" name="planKey" value={plan.key} />
        <input type="hidden" name="isPublic" value={isPublic ? "true" : "false"} />
        <input type="hidden" name="isActive" value={plan.isActive ? "true" : "false"} />
        <input type="hidden" name="bestFor" value={plan.bestFor} />
        <textarea name="merchantFacingHighlights" defaultValue={plan.merchantFacingHighlights.join("\n")} style={styles.hiddenField} readOnly />
        <textarea name="opsHighlights" defaultValue={plan.opsHighlights.join("\n")} style={styles.hiddenField} readOnly />
        <input type="hidden" name="sortOrder" value={String(plan.sortOrder)} />

        <div style={{ ...styles.cardTop, background: `${config.accent}12` }}>
          <div style={styles.cardTopRow}>
            <span style={{ ...styles.tierChip, color: config.valueTone, background: `${config.accent}12` }}>{config.tag}</span>
            <button
              type="button"
              style={styles.visibilityButton}
              onClick={() => setIsPublic((current) => !current)}
            >
              <span style={{ ...styles.visibilityText, color: config.valueTone }}>{isPublic ? "Visible" : "Hidden"}</span>
              <div style={{ ...styles.visibilityToggle, background: isPublic ? `${config.accent}33` : "rgba(133,147,153,0.22)" }}>
                <div
                  style={{
                    ...styles.visibilityKnob,
                    background: isPublic ? config.accent : "#859399",
                    left: isPublic ? "18px" : "2px",
                    right: "auto",
                  }}
                />
              </div>
            </button>
          </div>
          <input name="displayName" defaultValue={plan.name} style={styles.cardTitleInput} />
          <textarea
            name="tagline"
            defaultValue={plan.tagline}
            rows={3}
            style={{ ...styles.cardSubtitleInput, color: config.valueTone }}
          />
        </div>

        <div style={styles.cardBody}>
          <div>
            <div style={styles.priceDisplay}>
              <span style={styles.priceCurrency}>$</span>
              <input name="monthlyPrice" defaultValue={String(plan.monthlyPrice).replace(/[^0-9.]/g, "")} style={styles.priceValueInput} />
              <span style={styles.priceSuffix}>/mo</span>
            </div>
            <div style={styles.yearlyDisplay}>
              <span style={{ ...styles.priceCurrency, color: config.valueTone }}>$</span>
              <input name="yearlyPrice" defaultValue={String(plan.yearlyPrice).replace(/[^0-9.]/g, "")} style={styles.yearlyValueInput} />
              <span style={{ ...styles.priceSuffix, color: config.valueTone }}>/yr</span>
            </div>
          </div>

          <div style={styles.featuresBlock}>
            <p style={{ ...styles.featureLabel, color: `${config.valueTone}B3` }}>{plan.key === "free" ? "Core Features" : plan.key === "growth" ? "Premium Features" : "Ultra Features"}</p>
            <div style={styles.featureList}>
              {plan.merchantFacingHighlights.slice(0, 3).map((highlight) => (
                <div key={highlight} style={styles.featureRow}>
                  <span className="material-symbols-outlined" style={{ ...styles.featureIcon, color: config.accent }}>
                    {plan.key === "scale" ? "bolt" : "check_circle"}
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          style={{
            ...styles.saveButton,
            color: plan.key === "free" ? "#04141c" : "#03151c",
            borderColor: `${config.accent}80`,
            background: `linear-gradient(135deg, ${config.accent}, ${config.accent}CC)`,
            boxShadow: `0 16px 30px -20px ${config.accent}`,
            opacity: isSubmitting ? 0.78 : 1,
          }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save package"}
        </button>
      </Form>
    </article>
  );
}

function readRelativeTime(value: string | Date | null) {
  if (!value) return "No data";
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.round(diff / (1000 * 60 * 60)));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "grid", gap: "40px", color: "#dae2fd" },
  toastViewport: { position: "fixed", top: "88px", right: "32px", zIndex: 40, display: "flex", justifyContent: "end", pointerEvents: "none" },
  toast: { minWidth: "320px", maxWidth: "420px", padding: "16px 18px", borderRadius: "14px", border: "1px solid transparent", display: "flex", alignItems: "start", justifyContent: "space-between", gap: "16px", backdropFilter: "blur(18px)", boxShadow: "0 24px 60px rgba(3,8,20,0.45)", pointerEvents: "auto" },
  toastSuccess: { background: "rgba(8, 25, 36, 0.92)", borderColor: "rgba(60,243,255,0.28)", color: "#dafbff" },
  toastError: { background: "rgba(34, 12, 18, 0.94)", borderColor: "rgba(255,180,171,0.24)", color: "#ffe2dd" },
  toastTitle: { margin: 0, fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "16px", fontWeight: 800 },
  toastMessage: { margin: "6px 0 0", fontFamily: '"Space Grotesk", sans-serif', fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.88 },
  toastCloseButton: { border: "1px solid rgba(133,147,153,0.18)", background: "rgba(255,255,255,0.04)", color: "inherit", minWidth: "92px", height: "36px", borderRadius: "999px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px", marginTop: "4px" },
  statCard: { background: "#060e20", padding: "24px", borderLeft: "2px solid rgba(60, 73, 78, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", minHeight: "112px" },
  statCardFree: {},
  statCardGrowth: { borderLeftColor: "rgba(84, 141, 255, 0.5)", boxShadow: "0 10px 30px -15px rgba(84,141,255,0.1)" },
  statCardScale: { borderLeftColor: "rgba(60, 243, 255, 0.5)", boxShadow: "0 10px 30px -15px rgba(60,243,255,0.1)" },
  statLabel: { margin: "0 0 4px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#bbc9cf" },
  statValue: { margin: 0, fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "40px", fontWeight: 800, color: "#dae2fd" },
  statTag: { fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#00d6e1", background: "rgba(0,214,225,0.1)", padding: "4px 8px", borderRadius: "4px" },
  catalogGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "24px" },
  catalogCard: { position: "relative", background: "#171f33", border: "1px solid rgba(60, 73, 78, 0.1)", borderRadius: "8px", overflow: "hidden", minHeight: "560px" },
  cornerBadge: { position: "absolute", top: 0, right: 0, padding: "8px", zIndex: 1, fontFamily: '"Space Grotesk", sans-serif', fontSize: "9px", textTransform: "uppercase", background: "#548dff", color: "white", borderBottomLeftRadius: "4px", borderTopRightRadius: "8px", letterSpacing: "0.12em" },
  formStack: { display: "grid", minHeight: "100%" },
  cardTop: { padding: "24px" },
  cardTopRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  tierChip: { fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", padding: "4px 8px", borderRadius: "4px" },
  visibilityRow: { display: "flex", alignItems: "center", gap: "8px" },
  visibilityButton: { display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: 0, padding: 0, cursor: "pointer" },
  visibilityText: { fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px" },
  visibilityToggle: { width: "32px", height: "16px", borderRadius: "999px", position: "relative" },
  visibilityKnob: { position: "absolute", top: "2px", width: "12px", height: "12px", borderRadius: "999px", transition: "left 140ms ease" },
  cardTitleInput: { background: "transparent", border: "none", padding: 0, color: "#dae2fd", width: "100%", fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "32px", fontWeight: 800, outline: "none" },
  cardSubtitleInput: { marginTop: "8px", background: "transparent", border: "none", padding: 0, width: "100%", minHeight: "72px", resize: "vertical", lineHeight: 1.5, fontSize: "14px", fontStyle: "italic", fontFamily: '"Space Grotesk", sans-serif', outline: "none" },
  cardBody: { padding: "24px", display: "grid", gap: "24px", alignContent: "start", flex: 1 },
  priceDisplay: { display: "flex", alignItems: "baseline", gap: "4px" },
  yearlyDisplay: { display: "flex", alignItems: "baseline", gap: "4px", marginTop: "6px", opacity: 0.8 },
  priceCurrency: { color: "#bbc9cf", fontSize: "14px", fontFamily: '"Space Grotesk", sans-serif' },
  priceValueInput: { width: "88px", background: "transparent", border: "none", padding: 0, color: "#dae2fd", fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "52px", fontWeight: 800, outline: "none" },
  yearlyValueInput: { width: "96px", background: "transparent", border: "none", padding: 0, color: "#dae2fd", fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "24px", fontWeight: 700, outline: "none" },
  priceSuffix: { color: "#bbc9cf", fontSize: "13px", fontFamily: '"Space Grotesk", sans-serif' },
  featuresBlock: { display: "grid", gap: "12px" },
  featureLabel: { margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em" },
  featureList: { display: "grid", gap: "10px" },
  featureRow: { display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#dae2fd" },
  featureIcon: { fontSize: "14px" },
  checkboxLabel: { display: "none" },
  hiddenField: { display: "none" },
  saveButton: { margin: "0 24px 24px", width: "calc(100% - 48px)", height: "52px", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(133, 147, 153, 0.2)", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", cursor: "pointer", boxSizing: "border-box", transition: "transform 140ms ease, opacity 140ms ease, box-shadow 140ms ease" },
  assignmentsCard: { background: "#171f33", borderRadius: "8px", border: "1px solid rgba(60, 73, 78, 0.1)", overflow: "hidden" },
  assignmentsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid rgba(60,73,78,0.12)" },
  assignmentsTitleRow: { display: "flex", alignItems: "center", gap: "12px" },
  assignmentsTitle: { margin: 0, fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "18px", fontWeight: 800 },
  assignmentPill: { fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#548dff", background: "rgba(84,141,255,0.1)", padding: "4px 8px", borderRadius: "999px" },
  assignmentsActions: { display: "flex", gap: "10px" },
  toolbarButton: { border: "none", background: "transparent", color: "#bbc9cf", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer" },
  tableHeader: { display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 60px", gap: "16px", padding: "14px 24px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em" },
  tableBody: { display: "grid" },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 60px", gap: "16px", alignItems: "center", padding: "16px 24px", borderTop: "1px solid rgba(60,73,78,0.12)" },
  rowName: { margin: 0, fontSize: "14px", fontWeight: 600, color: "#dae2fd" },
  rowSubtext: { margin: "4px 0 0", fontSize: "11px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', textTransform: "uppercase", letterSpacing: "0.08em" },
  statusPill: { display: "inline-block", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", padding: "4px 8px", borderRadius: "999px" },
  statusPillAllowed: { color: "#3cf3ff", background: "rgba(60,243,255,0.1)" },
  statusPillBlocked: { color: "#ffb4ab", background: "rgba(255,180,171,0.1)" },
  rowActionLink: { color: "#dae2fd", textDecoration: "none", fontSize: "20px", lineHeight: 1 },
  tableFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderTop: "1px solid rgba(60,73,78,0.12)", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em" },
  footerPager: { display: "flex", gap: "8px" },
  pagerButton: { border: "1px solid rgba(60,73,78,0.2)", background: "transparent", color: "#dae2fd", padding: "6px 10px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer" },
};
