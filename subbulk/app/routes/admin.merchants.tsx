import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, Outlet, useActionData, useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { useDeferredValue, useMemo, useState } from "react";
import { createManualMerchant, listMerchantAdminSummaries } from "../models/merchant.server";
import { getCanonicalPlanName } from "../services/admin-plan-catalog.shared";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";
import { isExpiredMerchantPlan } from "../services/merchant-plan-timeline.shared";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireInternalAdminUser(request);

  if (params.merchantId) {
    return { merchants: [] };
  }

  const merchants = await listMerchantAdminSummaries();
  return { merchants };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireInternalAdminUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "").trim();

  if (intent === "exportXml") {
    const merchants = await listMerchantAdminSummaries();
    const xml = buildMerchantExportXml(merchants);
    const stamp = new Date().toISOString().slice(0, 10);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="subbulk-merchants-${stamp}.xml"`,
      },
    });
  }

  if (intent === "createMerchant") {
    const rawShopDomain = String(formData.get("shopDomain") || "").trim().toLowerCase();
    const shopDomain = rawShopDomain.endsWith(".myshopify.com") ? rawShopDomain : `${rawShopDomain}.myshopify.com`;
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!rawShopDomain) {
      return Response.json({ ok: false, error: "Shop domain is required." }, { status: 400 });
    }

    if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shopDomain)) {
      return Response.json({ ok: false, error: "Shop domain must be a valid myshopify domain." }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: "Email format is invalid." }, { status: 400 });
    }

    try {
      const merchant = await createManualMerchant({
        actor: user.email,
        shopDomain,
        shopName: String(formData.get("shopName") || "").trim(),
        email,
        countryCode: String(formData.get("countryCode") || "").trim().toUpperCase(),
        currencyCode: String(formData.get("currencyCode") || "").trim().toUpperCase(),
        timezone: String(formData.get("timezone") || "").trim(),
      });

      return redirect(`/admin/merchants/${merchant.id}`);
    } catch (error) {
      return Response.json(
        { ok: false, error: error instanceof Error ? error.message : "Unable to create merchant." },
        { status: 400 },
      );
    }
  }

  return Response.json({ ok: false, error: "Unsupported action." }, { status: 400 });
};

export default function InternalAdminMerchantsPage() {
  const { merchants } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const { merchantId } = useParams();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const deferredQuery = useDeferredValue(query);
  const showCreateMerchant = searchParams.get("create") === "1";

  const filteredMerchants = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return merchants.filter((merchant) => {
      if (statusFilter !== "ALL" && merchant.merchantStatus !== statusFilter) {
        return false;
      }

      if (planFilter !== "ALL" && merchant.entitlements.planKey !== planFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        merchant.shopDomain,
        merchant.email || "",
        merchant.latestPlan?.planName || merchant.entitlements.planKey,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [deferredQuery, merchants, planFilter, statusFilter]);

  if (merchantId) {
    return <Outlet />;
  }

  const stats = {
    total: merchants.length,
    active: merchants.filter((merchant) => merchant.merchantStatus === "active").length,
    uninstalled: merchants.filter((merchant) => merchant.merchantStatus === "uninstalled").length,
    blockedPaid: merchants.filter((merchant) => merchant.isBlockedPaidMerchant).length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Merchants</h1>
          <p style={styles.subcopy}>
            <span style={styles.liveDot} />
            Live merchant intelligence
          </p>
        </div>

        <div style={styles.headerActions}>
          <Form method="post">
            <input type="hidden" name="intent" value="exportXml" />
            <button style={styles.secondaryButton} type="submit">
              Export XML
            </button>
          </Form>
          <Link to={showCreateMerchant ? "/admin/merchants" : "/admin/merchants?create=1#create-merchant"} style={styles.primaryButtonLink}>
            New Merchant
          </Link>
        </div>
      </div>

      {showCreateMerchant ? (
        <section id="create-merchant" style={styles.createCard}>
          <div style={styles.createCardHeader}>
            <div>
              <h2 style={styles.createHeading}>New Merchant Intake</h2>
              <p style={styles.createMeta}>Create an operator-managed merchant record and jump directly into the detail workspace.</p>
            </div>
            <Link to="/admin/merchants" style={styles.dismissLink}>
              Dismiss
            </Link>
          </div>

          {actionData && !actionData.ok ? <div style={styles.createError}>{actionData.error}</div> : null}

          <Form method="post" style={styles.createGrid}>
            <input type="hidden" name="intent" value="createMerchant" />
            <label style={styles.fieldLabel}>
              <span>Shop Domain</span>
              <input name="shopDomain" style={styles.fieldInput} placeholder="blue-bottle-coffee or blue-bottle-coffee.myshopify.com" required />
            </label>
            <label style={styles.fieldLabel}>
              <span>Store Name</span>
              <input name="shopName" style={styles.fieldInput} placeholder="Blue Bottle Coffee" />
            </label>
            <label style={styles.fieldLabel}>
              <span>Contact Email</span>
              <input name="email" type="email" style={styles.fieldInput} placeholder="ops@merchant.com" />
            </label>
            <label style={styles.fieldLabel}>
              <span>Country Code</span>
              <input name="countryCode" style={styles.fieldInput} placeholder="US" maxLength={2} />
            </label>
            <label style={styles.fieldLabel}>
              <span>Currency Code</span>
              <input name="currencyCode" style={styles.fieldInput} placeholder="USD" maxLength={3} />
            </label>
            <label style={styles.fieldLabel}>
              <span>Timezone</span>
              <input name="timezone" style={styles.fieldInput} placeholder="America/Los_Angeles" />
            </label>
            <div style={styles.createActions}>
              <button style={styles.primaryButton} type="submit">
                Create Merchant
              </button>
            </div>
          </Form>
        </section>
      ) : null}

      <section style={styles.statsGrid}>
        <article style={{ ...styles.totalCard, gridColumn: "span 4" }}>
          <p style={styles.cardLabel}>Total Merchants</p>
          <div style={styles.totalValueRow}>
            <h2 style={styles.totalValue}>{formatNumber(stats.total)}</h2>
            <span style={styles.trendBadge}>+12% MoM</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: "84%" }} />
          </div>
        </article>

        <article style={styles.metricCard}>
          <p style={styles.cardLabel}>Active</p>
          <h3 style={{ ...styles.metricValue, color: "#73f1e4" }}>{formatNumber(stats.active)}</h3>
          <p style={styles.metricMeta}>82.5% of base</p>
        </article>

        <article style={styles.metricCard}>
          <p style={styles.cardLabel}>Uninstalled</p>
          <h3 style={styles.metricValue}>{formatNumber(stats.uninstalled)}</h3>
          <p style={styles.metricMeta}>Lifetime retention</p>
        </article>

        <article style={{ ...styles.metricCardWide, gridColumn: "span 4" }}>
          <div>
            <p style={styles.cardLabel}>Blocked Paid</p>
            <h3 style={{ ...styles.metricValue, color: "#ffb4ab" }}>{formatNumber(stats.blockedPaid)}</h3>
            <p style={{ ...styles.metricMeta, color: "rgba(255,180,171,0.72)" }}>Requires immediate action</p>
          </div>
          <div style={styles.warningBadge}>warning</div>
        </article>
      </section>

      <section style={styles.tableCard}>
        <div style={styles.filtersBar}>
          <div style={styles.filtersLeft}>
            <label style={styles.filterChip}>
              <span>Status:</span>
              <select style={styles.filterSelect} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="ALL">ALL_OPERATIONAL</option>
                <option value="active">ACTIVE</option>
                <option value="frozen">FROZEN</option>
                <option value="disabled">DISABLED</option>
                <option value="uninstalled">UNINSTALLED</option>
              </select>
            </label>
            <label style={styles.filterChip}>
              <span>Package:</span>
              <select style={styles.filterSelect} value={planFilter} onChange={(event) => setPlanFilter(event.target.value)}>
                <option value="ALL">ANY_TIER</option>
                <option value="scale">ULTRA</option>
                <option value="growth">PREMIUM</option>
                <option value="free">FREE</option>
              </select>
            </label>
            <input
              style={styles.searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="QUERY DATABASE..."
            />
          </div>

          <div style={styles.filtersRight}>
            <span>
              SHOWING {Math.min(filteredMerchants.length, 50)} OF {formatNumber(filteredMerchants.length)} ENTRIES
            </span>
            <div style={styles.pagerCluster}>
              <button style={styles.pagerButton} type="button">
                ‹
              </button>
              <button style={styles.pagerButton} type="button">
                ›
              </button>
            </div>
          </div>
        </div>

        <div style={styles.tableHeader}>
          <div>Merchant Entity / Domain</div>
          <div style={styles.centerCell}>Operational Status</div>
          <div style={styles.centerCell}>Subscription Tier</div>
          <div style={styles.centerCell}>Latest Event</div>
          <div style={styles.centerCell}>Detail</div>
        </div>

        <div>
          {filteredMerchants.map((merchant, index) => (
            <div key={merchant.merchantId} style={{ ...styles.tableRow, ...(index % 2 === 0 ? styles.tableRowAlt : null) }}>
              <div>
                <Link to={`/admin/merchants/${merchant.merchantId}`} style={styles.rowTitleLink}>
                  {merchant.shopDomain}
                </Link>
                <p style={styles.rowMeta}>{merchant.email || "No email stored"}</p>
              </div>
              <div style={styles.centerCell}>
                <span style={{ ...styles.statusBadge, ...(merchant.merchantStatus === "active" ? styles.statusActive : styles.statusMuted) }}>
                  {merchant.merchantStatus.toUpperCase()}
                </span>
              </div>
              <div style={styles.centerCell}>
                <div style={styles.planBadgeStack}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(merchant.entitlements.planKey === "scale"
                        ? styles.planUltra
                        : merchant.entitlements.planKey === "growth"
                          ? styles.planPremium
                          : styles.planFree),
                    }}
                  >
                    {getCanonicalPlanName(merchant.latestPlan?.planKey || merchant.entitlements.planKey).toUpperCase()}
                  </span>
                  {isExpiredMerchantPlan(merchant.latestPlan) ? <span style={{ ...styles.statusBadge, ...styles.planExpired }}>Expired</span> : null}
                </div>
              </div>
              <div style={styles.centerCell}>
                <span style={styles.eventText}>{readLatestEvent(merchant.events)}</span>
              </div>
              <div style={styles.centerCell}>
                <Link to={`/admin/merchants/${merchant.merchantId}`} style={styles.controlLink}>
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function readLatestEvent(events: Array<{ type: string; createdAt: string | Date }>) {
  const latest = events[0];
  if (!latest) {
    return "NO_SIGNAL";
  }

  return `${latest.type.toUpperCase()} · ${formatShortTime(latest.createdAt)}`;
}

function formatShortTime(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function buildMerchantExportXml(
  merchants: Array<{
    merchantId: string;
    shopDomain: string;
    merchantStatus: string;
    email: string | null;
    installedAt: string | Date;
    uninstalledAt: string | Date | null;
    latestPlan: { planKey: string; planName: string; status: string; billingInterval: string | null } | null;
    events: Array<{ type: string; createdAt: string | Date }>;
  }>,
) {
  const body = merchants
    .map((merchant) => {
      const latestEvent = merchant.events[0] ?? null;
      return [
        `  <merchant id="${escapeXml(merchant.merchantId)}">`,
        `    <shopDomain>${escapeXml(merchant.shopDomain)}</shopDomain>`,
        `    <status>${escapeXml(merchant.merchantStatus)}</status>`,
        `    <email>${escapeXml(merchant.email || "")}</email>`,
        `    <installedAt>${escapeXml(new Date(merchant.installedAt).toISOString())}</installedAt>`,
        `    <uninstalledAt>${escapeXml(merchant.uninstalledAt ? new Date(merchant.uninstalledAt).toISOString() : "")}</uninstalledAt>`,
        `    <planKey>${escapeXml(merchant.latestPlan?.planKey || "free")}</planKey>`,
        `    <planName>${escapeXml(merchant.latestPlan?.planName || "Free")}</planName>`,
        `    <billingStatus>${escapeXml(merchant.latestPlan?.status || "unknown")}</billingStatus>`,
        `    <billingInterval>${escapeXml(merchant.latestPlan?.billingInterval || "")}</billingInterval>`,
        `    <latestEventType>${escapeXml(latestEvent?.type || "")}</latestEventType>`,
        `    <latestEventAt>${escapeXml(latestEvent ? new Date(latestEvent.createdAt).toISOString() : "")}</latestEventAt>`,
        "  </merchant>",
      ].join("\n");
    })
    .join("\n");

  return ['<?xml version="1.0" encoding="UTF-8"?>', `<merchants exportedAt="${new Date().toISOString()}">`, body, "</merchants>"].join("\n");
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "grid", gap: "40px", color: "#dae2fd" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px" },
  heading: { margin: 0, fontSize: "40px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif', letterSpacing: "-0.03em" },
  subcopy: { margin: "10px 0 0", color: "#bbc9cf", display: "flex", alignItems: "center", gap: "10px" },
  liveDot: { width: "8px", height: "8px", borderRadius: "999px", background: "#3cf3ff", boxShadow: "0 0 12px rgba(60,243,255,0.6)", display: "inline-block" },
  headerActions: { display: "flex", gap: "12px" },
  secondaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(133,147,153,0.24)", background: "transparent", color: "#dae2fd", padding: "12px 16px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer" },
  primaryButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: 0, background: "linear-gradient(135deg, #3cf3ff, #00d6e1)", color: "#00363a", padding: "12px 18px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", cursor: "pointer", boxShadow: "0 0 20px rgba(60,243,255,0.2)" },
  primaryButtonLink: { display: "inline-flex", alignItems: "center", justifyContent: "center", border: 0, background: "linear-gradient(135deg, #3cf3ff, #00d6e1)", color: "#00363a", padding: "12px 18px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", textDecoration: "none", boxShadow: "0 0 20px rgba(60,243,255,0.2)" },
  createCard: { background: "linear-gradient(180deg, rgba(23,31,51,0.9), rgba(19,27,46,0.94))", borderRadius: "12px", border: "1px solid rgba(60,243,255,0.14)", padding: "24px", display: "grid", gap: "20px", boxShadow: "0 0 30px rgba(60,243,255,0.08)" },
  createCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" },
  createHeading: { margin: 0, fontSize: "24px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  createMeta: { margin: "8px 0 0", color: "#bbc9cf", maxWidth: "780px" },
  dismissLink: { color: "#3cf3ff", textDecoration: "none", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em" },
  createError: { padding: "12px 14px", borderRadius: "8px", background: "rgba(147,0,10,0.22)", color: "#ffb4ab", border: "1px solid rgba(255,180,171,0.18)" },
  createGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "16px" },
  fieldLabel: { display: "grid", gap: "8px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", color: "#859399" },
  fieldInput: { border: "1px solid rgba(60,73,78,0.22)", background: "#060e20", color: "#dae2fd", padding: "12px 14px", fontFamily: 'Inter, "Segoe UI", sans-serif', fontSize: "14px", outline: "none" },
  createActions: { display: "flex", justifyContent: "end", alignItems: "end", gridColumn: "1 / -1", marginTop: "4px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "24px" },
  totalCard: { background: "#131b2e", borderRadius: "8px", padding: "24px", position: "relative", overflow: "hidden", minHeight: "190px" },
  cardLabel: { margin: 0, fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em", color: "#859399" },
  totalValueRow: { display: "flex", alignItems: "baseline", gap: "14px", marginTop: "20px" },
  totalValue: { margin: 0, fontSize: "52px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  trendBadge: { fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", color: "#3cf3ff", background: "rgba(60,243,255,0.08)", padding: "5px 9px", borderRadius: "999px" },
  progressTrack: { height: "4px", borderRadius: "999px", marginTop: "26px", background: "#222a3d", overflow: "hidden" },
  progressFill: { height: "100%", background: "#3cf3ff" },
  metricCard: { gridColumn: "span 2", background: "#171f33", borderLeft: "2px solid #53d4c8", borderRadius: "8px", padding: "24px" },
  metricCardWide: { background: "#171f33", borderLeft: "2px solid #93000a", borderRadius: "8px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  metricValue: { margin: "8px 0 0", fontSize: "34px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  metricMeta: { margin: "8px 0 0", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em" },
  warningBadge: { fontFamily: '"Material Symbols Outlined"', fontSize: "26px", color: "#ffb4ab", background: "rgba(255,180,171,0.08)", borderRadius: "999px", width: "48px", height: "48px", display: "grid", placeItems: "center" },
  tableCard: { background: "#131b2e", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(60,73,78,0.12)" },
  filtersBar: { padding: "16px 20px", borderBottom: "1px solid rgba(60,73,78,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", flexWrap: "wrap", background: "rgba(34,42,61,0.45)" },
  filtersLeft: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  filterChip: { display: "flex", alignItems: "center", gap: "8px", background: "#060e20", border: "1px solid rgba(60,73,78,0.2)", padding: "8px 12px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  filterSelect: { background: "transparent", border: 0, color: "#3cf3ff", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", outline: "none" },
  searchInput: { minWidth: "260px", border: "1px solid rgba(60,73,78,0.2)", background: "#060e20", color: "#dae2fd", padding: "8px 12px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", outline: "none" },
  filtersRight: { display: "flex", alignItems: "center", gap: "16px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  pagerCluster: { display: "flex", gap: "4px" },
  pagerButton: { width: "24px", height: "24px", border: 0, background: "#060e20", color: "#dae2fd", cursor: "pointer" },
  tableHeader: { display: "grid", gridTemplateColumns: "4fr 2fr 2fr 2fr 1fr", gap: "16px", padding: "16px 24px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em" },
  tableRow: { display: "grid", gridTemplateColumns: "4fr 2fr 2fr 2fr 1fr", gap: "16px", alignItems: "center", padding: "18px 24px", color: "#dae2fd", borderTop: "1px solid rgba(60,73,78,0.08)" },
  tableRowAlt: { background: "rgba(23,31,51,0.24)" },
  rowTitle: { margin: 0, fontSize: "15px", fontWeight: 600 },
  rowTitleLink: { display: "inline-flex", alignItems: "center", color: "#dae2fd", textDecoration: "none", fontSize: "15px", fontWeight: 600 },
  rowMeta: { margin: "6px 0 0", fontSize: "11px", color: "#859399", fontFamily: '"Space Grotesk", sans-serif', textTransform: "uppercase", letterSpacing: "0.08em" },
  centerCell: { display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" },
  planBadgeStack: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" },
  statusBadge: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "96px", padding: "6px 10px", borderRadius: "999px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em" },
  statusActive: { color: "#73f1e4", background: "rgba(83,212,200,0.12)" },
  statusMuted: { color: "#bbc9cf", background: "rgba(133,147,153,0.12)" },
  planFree: { color: "#859399", background: "rgba(133,147,153,0.12)" },
  planPremium: { color: "#548dff", background: "rgba(84,141,255,0.12)" },
  planUltra: { color: "#3cf3ff", background: "rgba(60,243,255,0.12)" },
  planExpired: { color: "#ffb4ab", background: "rgba(147,0,10,0.22)", minWidth: "auto" },
  eventText: { color: "#bbc9cf", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em" },
  controlArrow: { color: "#859399", fontSize: "20px" },
  controlLink: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "92px", minHeight: "36px", padding: "0 14px", borderRadius: "999px", color: "#3cf3ff", border: "1px solid rgba(60,243,255,0.22)", background: "rgba(60,243,255,0.08)", textDecoration: "none", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em" },
};
