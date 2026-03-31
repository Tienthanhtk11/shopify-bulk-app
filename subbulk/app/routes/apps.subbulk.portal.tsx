import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useMemo, useState } from "react";
import { listCustomerSubscriptionContracts } from "../models/subscription-contracts.server";
import {
  customerOwnsContract,
  isValidSubscriptionContractGid,
  normalizeCustomerGid,
} from "../services/customer-portal-access.shared";
import { getOrCreateWidgetSettings } from "../models/widget-settings.server";
import { authenticate } from "../shopify.server";

type ContractRow = {
  id: string;
  shortId: string;
  status: string;
  createdAt: string;
  nextBillingDate: string | null;
  lastPaymentStatus: string | null;
  paymentMethodLabel: string | null;
  paymentMethodStatus: "ON_FILE" | "REVOKED" | "UNAVAILABLE";
  lineTitle: string;
  quantity: number;
};

type LoaderData = {
  error: "no_app_session" | "login" | null;
  contracts: ContractRow[];
  portalPath: string;
  theme: {
    primaryColorHex: string;
    accentGreenHex: string;
    fontFamily: string;
    purchaseOptionsLabel: string;
    buyMoreHeading: string;
    subscriptionFooter: string;
    freeShippingNote: string;
  };
};

type ActionData = {
  error?: string;
  success?: string;
};

const DEFAULT_THEME = {
  primaryColorHex: "#D73C35",
  accentGreenHex: "#2E7D32",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  purchaseOptionsLabel: "Purchase options",
  buyMoreHeading: "Buy More, Save More",
  subscriptionFooter: "Powered by SubBulk",
  freeShippingNote: "Shipping calculated at checkout.",
};

function normalizeShop(shop: string | null) {
  if (!shop) return null;
  const normalized = shop.trim().toLowerCase();
  return normalized.endsWith(".myshopify.com") ? normalized : null;
}

function escapeCssValue(value: string) {
  return String(value).replace(/"/g, '\\"');
}

function portalStyles(theme: LoaderData["theme"]) {
  return `
    .subbulk-portal {
      --portal-primary: ${theme.primaryColorHex};
      --portal-accent: ${theme.accentGreenHex};
      --portal-text: #14213d;
      --portal-muted: #5b667a;
      --portal-border: #e3e8ef;
      --portal-panel: rgba(255, 255, 255, 0.92);
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, color-mix(in srgb, ${theme.primaryColorHex} 14%, #fff4df) 0, color-mix(in srgb, ${theme.primaryColorHex} 14%, #fff4df) 18%, transparent 18%),
        linear-gradient(180deg, #fffdf8 0%, #f6f8fb 100%);
    }

    .subbulk-portal * {
      box-sizing: border-box;
    }

    .subbulk-portal__wrap {
      max-width: 1040px;
      margin: 0 auto;
      padding: 32px 20px 56px;
      color: var(--portal-text);
      font-family: ${escapeCssValue(theme.fontFamily)};
    }

    .subbulk-portal__hero {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(260px, 1fr);
      gap: 20px;
      align-items: stretch;
      margin-bottom: 24px;
    }

    .subbulk-portal__card,
    .subbulk-portal__panel {
      background: var(--portal-panel);
      border: 1px solid var(--portal-border);
      border-radius: 24px;
      box-shadow: 0 16px 40px rgba(20, 33, 61, 0.08);
      backdrop-filter: blur(4px);
    }

    .subbulk-portal__card {
      padding: 24px;
    }

    .subbulk-portal__panel {
      padding: 20px;
    }

    .subbulk-portal__eyebrow {
      font-size: 12px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--portal-primary);
      margin-bottom: 10px;
      font-weight: 700;
    }

    .subbulk-portal__title {
      font-size: 34px;
      line-height: 1.04;
      margin: 0 0 12px;
      color: var(--portal-text);
    }

    .subbulk-portal__body,
    .subbulk-portal__small {
      margin: 0;
      line-height: 1.6;
      color: var(--portal-muted);
    }

    .subbulk-portal__small {
      font-size: 13px;
    }

    .subbulk-portal__stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 18px;
    }

    .subbulk-portal__stat {
      background: #fff;
      border: 1px solid var(--portal-border);
      border-radius: 18px;
      padding: 16px;
    }

    .subbulk-portal__stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7b8794;
      margin-bottom: 8px;
    }

    .subbulk-portal__stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--portal-text);
    }

    .subbulk-portal__pills,
    .subbulk-portal__meta,
    .subbulk-portal__actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .subbulk-portal__pills {
      margin-top: 18px;
    }

    .subbulk-portal__meta {
      margin-top: 10px;
      margin-bottom: 14px;
    }

    .subbulk-portal__pill {
      padding: 8px 12px;
      border-radius: 999px;
      background: #f6f8fb;
      color: #44556b;
      font-size: 13px;
      border: 1px solid var(--portal-border);
    }

    .subbulk-portal__search-row {
      display: flex;
      gap: 12px;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .subbulk-portal__search {
      flex: 1 1 280px;
      min-width: 220px;
      border: 1px solid #d6dae1;
      border-radius: 999px;
      padding: 12px 16px;
      font-size: 15px;
      outline: none;
      background: #fbfcfe;
      color: var(--portal-text);
    }

    .subbulk-portal__search:focus {
      border-color: color-mix(in srgb, ${theme.primaryColorHex} 60%, #d6dae1);
      box-shadow: 0 0 0 4px color-mix(in srgb, ${theme.primaryColorHex} 14%, transparent);
    }

    .subbulk-portal__cards {
      display: grid;
      gap: 16px;
    }

    .subbulk-portal__contract {
      background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
      border: 1px solid #e6eaf0;
      border-radius: 22px;
      padding: 20px;
    }

    .subbulk-portal__contract-header {
      display: flex;
      gap: 12px;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .subbulk-portal__contract-title {
      font-size: 22px;
      line-height: 1.2;
      margin: 0 0 6px;
      color: var(--portal-text);
    }

    .subbulk-portal__status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 700;
      border: 1px solid;
      white-space: nowrap;
    }

    .subbulk-portal__button,
    .subbulk-portal__link {
      appearance: none;
      border-radius: 999px;
      padding: 11px 16px;
      border: 1px solid #cbd5e1;
      background: #fff;
      color: var(--portal-text);
      font-weight: 700;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }

    .subbulk-portal__button:hover,
    .subbulk-portal__link:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 18px rgba(20, 33, 61, 0.08);
    }

    .subbulk-portal__button:disabled {
      cursor: wait;
      opacity: 0.65;
      transform: none;
      box-shadow: none;
    }

    .subbulk-portal__button--primary,
    .subbulk-portal__link {
      background: var(--portal-primary);
      border-color: var(--portal-primary);
      color: #fff;
    }

    .subbulk-portal__button--danger {
      background: #fff5f5;
      border-color: #f0b8b8;
      color: #8f1d1d;
    }

    .subbulk-portal__notice {
      padding: 14px 16px;
      border-radius: 18px;
      margin-bottom: 16px;
      border: 1px solid;
    }

    .subbulk-portal__notice--error {
      border-color: #f0b8b8;
      background: #fff5f5;
      color: #8f1d1d;
    }

    .subbulk-portal__notice--success {
      border-color: color-mix(in srgb, ${theme.accentGreenHex} 40%, #d0ead7);
      background: color-mix(in srgb, ${theme.accentGreenHex} 14%, #f6fff9);
      color: color-mix(in srgb, ${theme.accentGreenHex} 82%, #123d26);
    }

    .subbulk-portal__empty {
      text-align: center;
      padding: 32px 20px;
      border: 1px dashed #d6dae1;
      border-radius: 22px;
      color: #54657d;
      background: #fbfcfe;
    }

    .subbulk-portal__empty-title {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 22px;
      color: var(--portal-text);
    }

    .subbulk-portal__section-title {
      margin: 0 0 6px;
      font-size: 24px;
      color: var(--portal-text);
    }

    .subbulk-portal__footer-note {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid var(--portal-border);
      color: var(--portal-muted);
      font-size: 13px;
    }

    @media (max-width: 820px) {
      .subbulk-portal__hero {
        grid-template-columns: 1fr;
      }

      .subbulk-portal__stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .subbulk-portal__wrap {
        padding: 18px 14px 36px;
      }

      .subbulk-portal__card,
      .subbulk-portal__panel,
      .subbulk-portal__contract {
        padding: 16px;
        border-radius: 18px;
      }

      .subbulk-portal__title {
        font-size: 28px;
      }

      .subbulk-portal__stats {
        grid-template-columns: 1fr;
      }

      .subbulk-portal__contract-header,
      .subbulk-portal__search-row,
      .subbulk-portal__actions {
        flex-direction: column;
        align-items: stretch;
      }

      .subbulk-portal__status,
      .subbulk-portal__button,
      .subbulk-portal__link {
        justify-content: center;
        width: 100%;
      }

      .subbulk-portal__search {
        width: 100%;
      }
    }
  `;
}

function formatDate(value: string | null, withTime = false) {
  if (!value) return "Not scheduled yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled yet";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

function formatPaymentStatus(value: string | null) {
  if (!value) return "No payment status yet";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusMeta(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        tone: "#17603a",
        background: "#e8f7ee",
        border: "#b8e3c9",
        summary: "Your subscription is running normally.",
      };
    case "PAUSED":
      return {
        label: "Paused",
        tone: "#8a5a00",
        background: "#fff3d6",
        border: "#f0d28a",
        summary: "Billing is paused until you reactivate it.",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        tone: "#9f1c1c",
        background: "#fdeaea",
        border: "#f3b7b7",
        summary: "This subscription will not renew again.",
      };
    default:
      return {
        label: status,
        tone: "#334155",
        background: "#eef2f7",
        border: "#d7dee8",
        summary: "Subscription status information is available.",
      };
  }
}

function buildStatusCounts(contracts: ContractRow[]) {
  return contracts.reduce(
    (acc, contract) => {
      if (contract.status === "ACTIVE") acc.active += 1;
      if (contract.status === "PAUSED") acc.paused += 1;
      if (contract.status === "CANCELLED") acc.cancelled += 1;
      return acc;
    },
    { active: 0, paused: 0, cancelled: 0 },
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ctx = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const loggedInCustomerId = normalizeCustomerGid(
    url.searchParams.get("logged_in_customer_id"),
  );
  const shop = normalizeShop(url.searchParams.get("shop"));
  const theme = shop
    ? await getOrCreateWidgetSettings(shop)
    : DEFAULT_THEME;

  if (!ctx.admin) {
    return {
      error: "no_app_session" as const,
      contracts: [] as ContractRow[],
      portalPath: "/apps/subbulk/portal",
      theme,
    } satisfies LoaderData;
  }

  if (!loggedInCustomerId) {
    return {
      error: "login" as const,
      contracts: [] as ContractRow[],
      portalPath: "/apps/subbulk/portal",
      theme,
    } satisfies LoaderData;
  }

  const contracts: ContractRow[] = await listCustomerSubscriptionContracts(
    ctx.admin,
    loggedInCustomerId,
    20,
  );

  return {
    error: null as const,
    contracts,
    portalPath: "/apps/subbulk/portal",
    theme,
  } satisfies LoaderData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const ctx = await authenticate.public.appProxy(request);
  if (!ctx.admin) {
    return json({ error: "Your store session is not available right now." } satisfies ActionData);
  }

  const url = new URL(request.url);
  const loggedInCustomerId = normalizeCustomerGid(
    url.searchParams.get("logged_in_customer_id"),
  );

  if (!loggedInCustomerId) {
    return json({ error: "Sign in to manage your subscriptions." } satisfies ActionData);
  }

  const fd = await request.formData();
  const intent = String(fd.get("intent"));
  const contractId = String(fd.get("contractId") || "");

  if (!isValidSubscriptionContractGid(contractId)) {
    return json({ error: "The subscription reference is invalid." } satisfies ActionData);
  }

  const existingContracts = await listCustomerSubscriptionContracts(
    ctx.admin,
    loggedInCustomerId,
    50,
  );

  if (!customerOwnsContract(existingContracts, contractId)) {
    return json({ error: "This subscription does not belong to the current customer." } satisfies ActionData, { status: 403 });
  }

  try {
    if (intent === "pause") {
      const r = await ctx.admin.graphql(
        `#graphql
        mutation P($id: ID!) {
          subscriptionContractPause(subscriptionContractId: $id) {
            userErrors { message }
          }
        }`,
        { variables: { id: contractId } },
      );
      const j = await r.json();
      const err = j.data?.subscriptionContractPause?.userErrors?.[0]?.message;
      if (err) return json({ error: err } satisfies ActionData);
      return json({ success: "Your subscription has been paused." } satisfies ActionData);
    } else if (intent === "resume") {
      const r = await ctx.admin.graphql(
        `#graphql
        mutation R($id: ID!) {
          subscriptionContractActivate(subscriptionContractId: $id) {
            userErrors { message }
          }
        }`,
        { variables: { id: contractId } },
      );
      const j = await r.json();
      const err = j.data?.subscriptionContractActivate?.userErrors?.[0]?.message;
      if (err) return json({ error: err } satisfies ActionData);
      return json({ success: "Your subscription has been resumed." } satisfies ActionData);
    } else if (intent === "cancel") {
      const r = await ctx.admin.graphql(
        `#graphql
        mutation C($id: ID!) {
          subscriptionContractCancel(subscriptionContractId: $id) {
            userErrors { message }
          }
        }`,
        { variables: { id: contractId } },
      );
      const j = await r.json();
      const err = j.data?.subscriptionContractCancel?.userErrors?.[0]?.message;
      if (err) return json({ error: err } satisfies ActionData);
      return json({ success: "Your subscription has been cancelled." } satisfies ActionData);
    } else {
      return json({ error: "This action is not supported." } satisfies ActionData);
    }
  } catch (e) {
    return json({
      error:
        e instanceof Error
          ? e.message
          : "We could not update your subscription.",
    } satisfies ActionData);
  }
};

export default function SubbulkCustomerPortal() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const [query, setQuery] = useState("");
  const busy = nav.state !== "idle";
  const pendingIntent = nav.formData?.get("intent");
  const pendingContractId = nav.formData?.get("contractId");

  const counts = useMemo(() => buildStatusCounts(data.contracts), [data.contracts]);
  const filteredContracts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data.contracts;
    return data.contracts.filter((contract) =>
      [contract.lineTitle, contract.shortId, contract.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [data.contracts, query]);

  const returnUrl = encodeURIComponent(data.portalPath);
  const loginHref = `/account/login?return_url=${returnUrl}`;
  const themeCss = useMemo(() => portalStyles(data.theme), [data.theme]);

  const styles = {
    wrap: {
      fontFamily: data.theme.fontFamily,
      maxWidth: 980,
      margin: "0 auto",
      padding: "32px 20px 56px",
      color: "#14213d",
    },
    shell: {
      minHeight: "100vh",
      background: "transparent",
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.7fr) minmax(260px, 1fr)",
      gap: 20,
      alignItems: "stretch",
      marginBottom: 24,
    },
    heroCard: {
      background: "rgba(255,255,255,0.92)",
      border: "1px solid #e5e7eb",
      borderRadius: 24,
      padding: 24,
      boxShadow: "0 18px 40px rgba(20, 33, 61, 0.08)",
    },
    eyebrow: {
      fontSize: 12,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      color: data.theme.primaryColorHex,
      marginBottom: 10,
    },
    h1: {
      fontSize: 34,
      lineHeight: 1.05,
      margin: "0 0 12px",
      color: "#14213d",
    },
    p: {
      color: "#4f5d75",
      margin: 0,
      lineHeight: 1.6,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 12,
      marginTop: 18,
    },
    statCard: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 18,
      padding: 16,
    },
    statLabel: {
      fontSize: 12,
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      color: "#7b8794",
      marginBottom: 8,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 700,
      color: "#14213d",
    },
    panel: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 24,
      padding: 20,
      boxShadow: "0 12px 24px rgba(20, 33, 61, 0.06)",
    },
    searchRow: {
      display: "flex",
      gap: 12,
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap" as const,
      marginBottom: 16,
    },
    searchInput: {
      flex: "1 1 260px",
      minWidth: 220,
      border: "1px solid #d6dae1",
      borderRadius: 999,
      padding: "12px 16px",
      fontSize: 15,
      outline: "none",
      background: "#fbfcfe",
    },
    cards: {
      display: "grid",
      gap: 16,
    },
    contractCard: {
      background: "linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)",
      border: "1px solid #e6eaf0",
      borderRadius: 22,
      padding: 20,
    },
    contractHeader: {
      display: "flex",
      gap: 12,
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap" as const,
      marginBottom: 14,
    },
    contractTitle: {
      fontSize: 22,
      lineHeight: 1.2,
      margin: "0 0 6px",
      color: "#14213d",
    },
    contractMeta: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap" as const,
      marginTop: 10,
      marginBottom: 14,
    },
    metaPill: {
      padding: "8px 12px",
      borderRadius: 999,
      background: "#f3f6fa",
      color: "#44556b",
      fontSize: 13,
      border: "1px solid #e1e7ef",
    },
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      borderRadius: 999,
      padding: "8px 12px",
      fontSize: 13,
      fontWeight: 700,
      border: "1px solid",
    },
    actions: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap" as const,
      marginTop: 14,
    },
    btn: {
      appearance: "none" as const,
      borderRadius: 999,
      padding: "11px 16px",
      cursor: "pointer" as const,
      border: "1px solid #cbd5e1",
      background: "#fff",
      color: "#14213d",
      fontWeight: 700,
      fontSize: 14,
    },
    primaryBtn: {
      background: data.theme.primaryColorHex,
      borderColor: data.theme.primaryColorHex,
      color: "#fff",
    },
    dangerBtn: {
      background: "#fff5f5",
      borderColor: "#f0b8b8",
      color: "#8f1d1d",
    },
    notice: {
      padding: "14px 16px",
      borderRadius: 18,
      marginBottom: 16,
      border: "1px solid #f0b8b8",
      background: "#fff5f5",
      color: "#8f1d1d",
    },
    empty: {
      textAlign: "center" as const,
      padding: "32px 20px",
      border: "1px dashed #d6dae1",
      borderRadius: 22,
      color: "#54657d",
      background: "#fbfcfe",
    },
    linkButton: {
      display: "inline-block",
      marginTop: 16,
      textDecoration: "none",
      borderRadius: 999,
      padding: "11px 18px",
      background: data.theme.primaryColorHex,
      color: "#fff",
      fontWeight: 700,
    },
    small: {
      fontSize: 13,
      color: "#66768b",
      lineHeight: 1.5,
    },
  };

  if (data.error === "no_app_session") {
    return (
      <div style={styles.shell}>
        <div style={styles.wrap}>
          <div style={styles.panel}>
            <div style={styles.eyebrow}>SubBulk customer portal</div>
            <h1 style={styles.h1}>We could not open your subscription portal.</h1>
            <p style={styles.p}>
              The store session for this app is unavailable. Make sure SubBulk is
              installed on this store and the app proxy is active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data.error === "login") {
    return (
      <div style={styles.shell}>
        <div style={styles.wrap}>
          <div style={styles.panel}>
            <div style={styles.eyebrow}>SubBulk customer portal</div>
            <h1 style={styles.h1}>Sign in to manage your subscriptions.</h1>
            <p style={styles.p}>
              Your customer account is not logged in on this storefront yet. Sign
              in first, then reopen this page to manage billing and subscription
              status.
            </p>
            <a href={loginHref} style={styles.linkButton}>
              Go to customer login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.shell} className="subbulk-portal">
      <style>{themeCss}</style>
      <div style={styles.wrap} className="subbulk-portal__wrap">
        <div style={styles.hero} className="subbulk-portal__hero">
          <section style={styles.heroCard} className="subbulk-portal__card">
            <div style={styles.eyebrow}>SubBulk customer portal</div>
            <h1 style={styles.h1}>Manage your recurring orders without leaving the store.</h1>
            <p style={styles.p}>
              Review your subscription status, check the next billing date, and
              pause, resume, or cancel each plan from one page.
            </p>
            <div style={{ ...styles.contractMeta, marginTop: 18, marginBottom: 0 }} className="subbulk-portal__pills">
              <span style={styles.metaPill} className="subbulk-portal__pill">Saved payment methods stay managed by Shopify</span>
              <span style={styles.metaPill} className="subbulk-portal__pill">Last payment status is shown per subscription</span>
            </div>
            <div style={styles.statsGrid} className="subbulk-portal__stats">
              <div style={styles.statCard} className="subbulk-portal__stat">
                <div style={styles.statLabel} className="subbulk-portal__stat-label">Total plans</div>
                <div style={styles.statValue} className="subbulk-portal__stat-value">{data.contracts.length}</div>
              </div>
              <div style={styles.statCard} className="subbulk-portal__stat">
                <div style={styles.statLabel} className="subbulk-portal__stat-label">Active</div>
                <div style={styles.statValue} className="subbulk-portal__stat-value">{counts.active}</div>
              </div>
              <div style={styles.statCard} className="subbulk-portal__stat">
                <div style={styles.statLabel} className="subbulk-portal__stat-label">Paused</div>
                <div style={styles.statValue} className="subbulk-portal__stat-value">{counts.paused}</div>
              </div>
            </div>
          </section>

          <aside style={styles.heroCard} className="subbulk-portal__card">
            <div style={styles.eyebrow}>What you can do here</div>
            <p style={styles.p}>Keep your subscription account under control.</p>
            <div style={{ ...styles.contractMeta, marginTop: 18, marginBottom: 0 }} className="subbulk-portal__pills">
              <span style={styles.metaPill} className="subbulk-portal__pill">Pause before the next charge</span>
              <span style={styles.metaPill} className="subbulk-portal__pill">Resume whenever you are ready</span>
              <span style={styles.metaPill} className="subbulk-portal__pill">Cancel plans you no longer need</span>
            </div>
            <div className="subbulk-portal__footer-note">
              {data.theme.purchaseOptionsLabel} · {data.theme.buyMoreHeading} · {data.theme.subscriptionFooter}
            </div>
          </aside>
        </div>

        <section style={styles.panel} className="subbulk-portal__panel">
          <div style={styles.searchRow} className="subbulk-portal__search-row">
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 24 }} className="subbulk-portal__section-title">Your subscriptions</h2>
              <p style={styles.small} className="subbulk-portal__small">
                Search by product title, status, or subscription reference.
              </p>
            </div>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search your subscriptions"
              aria-label="Search your subscriptions"
              style={styles.searchInput}
              className="subbulk-portal__search"
            />
          </div>

          {actionData && actionData.success ? (
            <div className="subbulk-portal__notice subbulk-portal__notice--success">
              {actionData.success}
            </div>
          ) : null}

          {actionData && "error" in actionData && actionData.error ? (
            <div style={styles.notice} className="subbulk-portal__notice subbulk-portal__notice--error">{actionData.error}</div>
          ) : null}

          {filteredContracts.length === 0 ? (
            <div style={styles.empty} className="subbulk-portal__empty">
              {data.contracts.length === 0 ? (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 22 }} className="subbulk-portal__empty-title">
                    No subscriptions yet
                  </h3>
                  <p style={styles.p} className="subbulk-portal__body">
                    Once you purchase a subscription product, it will appear here
                    with billing status and self-service actions.
                  </p>
                </>
              ) : (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 22 }} className="subbulk-portal__empty-title">
                    No matching subscriptions
                  </h3>
                  <p style={styles.p} className="subbulk-portal__body">
                    Try another keyword to find a plan by product name, status, or
                    subscription id.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={styles.cards} className="subbulk-portal__cards">
              {filteredContracts.map((contract) => {
                const meta = statusMeta(contract.status);
                const isPending =
                  busy && pendingContractId === contract.id;

                return (
                  <article key={contract.id} style={styles.contractCard} className="subbulk-portal__contract">
                    <div style={styles.contractHeader} className="subbulk-portal__contract-header">
                      <div>
                        <div style={styles.eyebrow}>Subscription #{contract.shortId}</div>
                        <h3 style={styles.contractTitle} className="subbulk-portal__contract-title">{contract.lineTitle}</h3>
                        <p style={styles.small} className="subbulk-portal__small">{meta.summary}</p>
                      </div>
                      <span
                        className="subbulk-portal__status"
                        style={{
                          ...styles.statusPill,
                          color: meta.tone,
                          background: meta.background,
                          borderColor: meta.border,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div style={styles.contractMeta} className="subbulk-portal__meta">
                      <span style={styles.metaPill} className="subbulk-portal__pill">
                        Next billing: {formatDate(contract.nextBillingDate, true)}
                      </span>
                      <span style={styles.metaPill} className="subbulk-portal__pill">
                        Started: {formatDate(contract.createdAt)}
                      </span>
                      <span style={styles.metaPill} className="subbulk-portal__pill">
                        Quantity per order: {contract.quantity}
                      </span>
                      <span style={styles.metaPill} className="subbulk-portal__pill">
                        Payment method: {contract.paymentMethodLabel || "Not visible yet"}
                      </span>
                      <span style={styles.metaPill} className="subbulk-portal__pill">
                        Last payment: {formatPaymentStatus(contract.lastPaymentStatus)}
                      </span>
                    </div>

                    {(contract.status === "ACTIVE" || contract.status === "PAUSED") ? (
                      <div style={styles.actions} className="subbulk-portal__actions">
                        {contract.status === "ACTIVE" ? (
                          <Form method="post">
                            <input type="hidden" name="contractId" value={contract.id} />
                            <input type="hidden" name="intent" value="pause" />
                            <button
                              type="submit"
                              style={{ ...styles.btn, ...styles.primaryBtn }}
                              className="subbulk-portal__button subbulk-portal__button--primary"
                              disabled={isPending}
                            >
                              {isPending && pendingIntent === "pause"
                                ? "Pausing..."
                                : "Pause subscription"}
                            </button>
                          </Form>
                        ) : null}

                        {contract.status === "PAUSED" ? (
                          <Form method="post">
                            <input type="hidden" name="contractId" value={contract.id} />
                            <input type="hidden" name="intent" value="resume" />
                            <button
                              type="submit"
                              style={{ ...styles.btn, ...styles.primaryBtn }}
                              className="subbulk-portal__button subbulk-portal__button--primary"
                              disabled={isPending}
                            >
                              {isPending && pendingIntent === "resume"
                                ? "Resuming..."
                                : "Resume subscription"}
                            </button>
                          </Form>
                        ) : null}

                        <Form
                          method="post"
                          onSubmit={(event) => {
                            if (
                              !window.confirm(
                                `Cancel subscription #${contract.shortId}? This stops future renewals.`,
                              )
                            ) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="contractId" value={contract.id} />
                          <input type="hidden" name="intent" value="cancel" />
                          <button
                            type="submit"
                            style={{ ...styles.btn, ...styles.dangerBtn }}
                            className="subbulk-portal__button subbulk-portal__button--danger"
                            disabled={isPending}
                          >
                            {isPending && pendingIntent === "cancel"
                              ? "Cancelling..."
                              : "Cancel subscription"}
                          </button>
                        </Form>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          <div className="subbulk-portal__footer-note">
            {data.theme.freeShippingNote} You can also reopen this page any time from the account portal or product page link.
          </div>
        </section>
      </div>
    </div>
  );
}
