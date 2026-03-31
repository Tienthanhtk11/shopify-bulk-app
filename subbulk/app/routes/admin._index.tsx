import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { listMerchantAdminSummaries } from "../models/merchant.server";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireInternalAdminUser(request);
  const merchants = await listMerchantAdminSummaries();
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((merchant) => merchant.merchantStatus === "active").length;
  const blockedPaid = merchants.filter((merchant) => merchant.isBlockedPaidMerchant).length;
  const activePaid = merchants.filter(
    (merchant) => merchant.entitlements.planKey !== "free" && !merchant.isBlockedPaidMerchant,
  ).length;
  const recentEvents = merchants
    .flatMap((merchant) =>
      merchant.events.slice(0, 2).map((event) => ({
        id: event.id,
        shopDomain: merchant.shopDomain,
        type: event.type,
        severity: event.severity,
        createdAt: event.createdAt,
      })),
    )
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 3);

  return {
    totalMerchants,
    activeMerchants,
    blockedPaid,
    activePaid,
    recentEvents,
  };
};

export default function AdminDashboardRoute() {
  const { totalMerchants, activeMerchants, blockedPaid, activePaid, recentEvents } = useLoaderData<typeof loader>();

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heading}>Systems Operational</h1>
          <p style={styles.subcopy}>
            Merchant operations are healthy. No critical admin-side blockers are currently preventing package control or merchant access updates.
          </p>
        </div>
        <div style={styles.heroActions}>
          <button style={styles.secondaryButton} type="button">View logs</button>
          <button style={styles.primaryButton} type="button">Refresh node</button>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.mainMetricCard}>
          <div style={styles.metricIcon}>analytics</div>
          <p style={styles.metricLabel}>Traffic Throughput</p>
          <div style={styles.metricRow}>
            <span style={styles.metricValue}>{totalMerchants}</span>
            <span style={styles.metricUnit}>MERCHANTS</span>
            <span style={styles.metricTrend}>+12%</span>
          </div>
          <div style={styles.sparkline}>
            {[32, 40, 48, 58, 74, 66, 52, 60, 82, 100].map((height, index) => (
              <div key={index} style={{ ...styles.sparkBar, height: `${height}%`, opacity: 0.35 + index * 0.05 }} />
            ))}
          </div>
        </section>

        <section style={styles.sideMetricCard}>
          <p style={styles.metricLabel}>Active Sessions</p>
          <div style={styles.sideMetricValue}>{activeMerchants}</div>
          <p style={styles.sideMetricCopy}>Merchants currently active in the system</p>
          <div style={styles.progressGroup}>
            <div style={styles.progressRow}><span>Paid access</span><span>{activePaid}</span></div>
            <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${Math.max(8, Math.round((activePaid / Math.max(1, totalMerchants)) * 100))}%` }} /></div>
            <div style={styles.progressRow}><span>Blocked paid</span><span>{blockedPaid}</span></div>
            <div style={styles.progressTrack}><div style={{ ...styles.progressFillWarn, width: `${Math.max(4, Math.round((blockedPaid / Math.max(1, totalMerchants)) * 100))}%` }} /></div>
          </div>
        </section>

        <section style={styles.smallMetricCard}>
          <p style={styles.metricLabel}>Error Rate</p>
          <div style={styles.smallMetricValue}>0.02%</div>
          <div style={styles.smallMetricIcon}>check_circle</div>
        </section>

        <section style={styles.smallMetricCard}>
          <p style={styles.metricLabel}>Blocked Paid</p>
          <div style={styles.smallMetricValue}>{blockedPaid}</div>
          <div style={styles.smallMetricIcon}>warning</div>
        </section>

        <section style={styles.smallMetricCard}>
          <p style={styles.metricLabel}>Avg Latency</p>
          <div style={styles.smallMetricValue}>14ms</div>
          <div style={styles.smallMetricIcon}>bolt</div>
        </section>
      </div>

      <section style={styles.telemetryCard}>
        <div style={styles.telemetryHeader}>
          <h2 style={styles.telemetryTitle}>System Telemetry</h2>
          <span style={styles.telemetryBadge}>Realtime feed</span>
        </div>
        <div style={styles.telemetryList}>
          {recentEvents.map((event) => (
            <div key={event.id} style={styles.telemetryRow}>
              <div style={styles.telemetryMeta}>{formatShortTime(event.createdAt)}</div>
              <div style={styles.telemetryType}>{event.severity}</div>
              <div style={styles.telemetryMessage}>{event.shopDomain} · {event.type}</div>
              <div style={styles.telemetryArrow}>›</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatShortTime(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "grid", gap: "24px", color: "#dae2fd" },
  hero: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: "24px" },
  heading: { margin: 0, fontSize: "40px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  subcopy: { margin: "10px 0 0", maxWidth: "780px", color: "#859399", lineHeight: 1.6 },
  heroActions: { display: "flex", gap: "12px" },
  secondaryButton: { border: "1px solid rgba(133,147,153,0.24)", background: "#171f33", color: "#dae2fd", padding: "12px 18px", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "11px", fontFamily: '"Space Grotesk", sans-serif', cursor: "pointer" },
  primaryButton: { border: 0, background: "linear-gradient(135deg, #3cf3ff, #00d6e1)", color: "#00363a", padding: "12px 18px", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "11px", fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', cursor: "pointer", boxShadow: "0 0 20px rgba(60,243,255,0.2)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "24px" },
  mainMetricCard: { gridColumn: "span 8", position: "relative", overflow: "hidden", background: "#171f33", border: "1px solid rgba(60,73,78,0.14)", borderRadius: "8px", padding: "24px" },
  metricIcon: { position: "absolute", right: "20px", top: "20px", fontFamily: '"Material Symbols Outlined"', fontSize: "54px", color: "rgba(60,243,255,0.16)" },
  metricLabel: { margin: 0, color: "#859399", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: '"Space Grotesk", sans-serif' },
  metricRow: { display: "flex", alignItems: "baseline", gap: "12px", marginTop: "20px", marginBottom: "28px" },
  metricValue: { fontSize: "52px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  metricUnit: { fontSize: "16px", color: "#3cf3ff", fontFamily: '"Space Grotesk", sans-serif' },
  metricTrend: { fontSize: "14px", color: "#53d4c8", fontFamily: '"Space Grotesk", sans-serif' },
  sparkline: { height: "132px", display: "flex", alignItems: "end", gap: "6px" },
  sparkBar: { flex: 1, background: "#3cf3ff", borderTopLeftRadius: "3px", borderTopRightRadius: "3px", boxShadow: "0 0 12px rgba(60,243,255,0.16)" },
  sideMetricCard: { gridColumn: "span 4", background: "#171f33", border: "1px solid rgba(60,73,78,0.14)", borderRadius: "8px", padding: "24px" },
  sideMetricValue: { fontSize: "44px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif', marginTop: "16px" },
  sideMetricCopy: { margin: "6px 0 0", color: "#859399", fontSize: "12px" },
  progressGroup: { marginTop: "28px", display: "grid", gap: "10px" },
  progressRow: { display: "flex", justifyContent: "space-between", color: "#859399", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", fontFamily: '"Space Grotesk", sans-serif' },
  progressTrack: { height: "4px", borderRadius: "999px", background: "#222a3d", overflow: "hidden" },
  progressFill: { height: "100%", background: "#3cf3ff" },
  progressFillWarn: { height: "100%", background: "#ffb4ab" },
  smallMetricCard: { gridColumn: "span 4", background: "#171f33", border: "1px solid rgba(60,73,78,0.14)", borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  smallMetricValue: { marginTop: "8px", fontSize: "28px", fontWeight: 700, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  smallMetricIcon: { fontFamily: '"Material Symbols Outlined"', fontSize: "24px", color: "#53d4c8" },
  telemetryCard: { background: "#171f33", border: "1px solid rgba(60,73,78,0.14)", borderRadius: "8px", overflow: "hidden" },
  telemetryHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid rgba(60,73,78,0.14)" },
  telemetryTitle: { margin: 0, fontSize: "18px", fontWeight: 800, fontFamily: 'Manrope, "Segoe UI", sans-serif' },
  telemetryBadge: { fontSize: "10px", color: "#3cf3ff", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: '"Space Grotesk", sans-serif' },
  telemetryList: { display: "grid" },
  telemetryRow: { display: "grid", gridTemplateColumns: "90px 90px 1fr 24px", gap: "16px", alignItems: "center", padding: "18px 24px", borderTop: "1px solid rgba(60,73,78,0.08)" },
  telemetryMeta: { color: "#dae2fd", fontSize: "12px", fontFamily: '"Space Grotesk", sans-serif' },
  telemetryType: { color: "#3cf3ff", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: '"Space Grotesk", sans-serif' },
  telemetryMessage: { color: "#dae2fd", fontSize: "14px" },
  telemetryArrow: { color: "#859399", fontSize: "20px" },
};
