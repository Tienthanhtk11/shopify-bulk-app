import type { AdminApiContext } from "@shopify/shopify-app-remix/server";

export type SubscriptionContractStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type SubscriptionContractRow = {
  id: string;
  shortId: string;
  status: SubscriptionContractStatus;
  createdAt: string;
  nextBillingDate: string | null;
  customerName: string;
  customerEmail: string;
  lineTitle: string;
  quantity: number;
};

type ShopifyContractNode = {
  id?: string;
  status?: SubscriptionContractStatus;
  createdAt?: string;
  nextBillingDate?: string | null;
  customer?: {
    displayName?: string | null;
    email?: string | null;
  } | null;
  lines?: {
    nodes?: Array<{
      title?: string | null;
      variantTitle?: string | null;
      quantity?: number | null;
    }>;
  } | null;
};

const SUPPORTED_STATUSES: SubscriptionContractStatus[] = [
  "ACTIVE",
  "PAUSED",
  "CANCELLED",
];

function parseContractShortId(id: string) {
  return id.split("/").pop() ?? id;
}

function mapContractNode(node: ShopifyContractNode): SubscriptionContractRow | null {
  if (!node.id || !node.status || !SUPPORTED_STATUSES.includes(node.status)) {
    return null;
  }

  const firstLine = node.lines?.nodes?.[0];
  const pieces = [firstLine?.title, firstLine?.variantTitle].filter(Boolean);

  return {
    id: node.id,
    shortId: parseContractShortId(node.id),
    status: node.status,
    createdAt: node.createdAt ?? new Date(0).toISOString(),
    nextBillingDate: node.nextBillingDate ?? null,
    customerName: node.customer?.displayName?.trim() || "Unknown customer",
    customerEmail: node.customer?.email?.trim() || "No email",
    lineTitle: pieces.join(" / ") || "Subscription",
    quantity:
      typeof firstLine?.quantity === "number" && Number.isFinite(firstLine.quantity)
        ? firstLine.quantity
        : 1,
  };
}

async function fetchContractsForStatus(
  admin: AdminApiContext,
  status: SubscriptionContractStatus,
  first = 100,
) {
  const res = await admin.graphql(
    `#graphql
    query SubBulkAdminContracts($first: Int!, $query: String!) {
      subscriptionContracts(first: $first, query: $query) {
        nodes {
          id
          status
          createdAt
          nextBillingDate
          customer {
            displayName
            email
          }
          lines(first: 3) {
            nodes {
              title
              variantTitle
              quantity
            }
          }
        }
      }
    }`,
    {
      variables: {
        first,
        query: `status:${status}`,
      },
    },
  );

  const json = await res.json();
  const nodes = (json.data?.subscriptionContracts?.nodes ?? []) as ShopifyContractNode[];

  return nodes
    .map(mapContractNode)
    .filter((row): row is SubscriptionContractRow => row !== null);
}

export async function listAdminSubscriptionContracts(
  admin: AdminApiContext,
  firstPerStatus = 100,
) {
  const results = await Promise.all(
    SUPPORTED_STATUSES.map((status) =>
      fetchContractsForStatus(admin, status, firstPerStatus),
    ),
  );

  const deduped = new Map<string, SubscriptionContractRow>();
  for (const rows of results) {
    for (const row of rows) deduped.set(row.id, row);
  }

  return [...deduped.values()].sort((a, b) => {
    const aTime = a.nextBillingDate
      ? new Date(a.nextBillingDate).getTime()
      : new Date(a.createdAt).getTime();
    const bTime = b.nextBillingDate
      ? new Date(b.nextBillingDate).getTime()
      : new Date(b.createdAt).getTime();
    return bTime - aTime;
  });
}

export function buildSubscriptionStatusCounts(rows: SubscriptionContractRow[]) {
  return {
    active: rows.filter((row) => row.status === "ACTIVE").length,
    paused: rows.filter((row) => row.status === "PAUSED").length,
    cancelled: rows.filter((row) => row.status === "CANCELLED").length,
  };
}

export function buildSubscriptionAnalytics(rows: SubscriptionContractRow[]) {
  const statusCounts = buildSubscriptionStatusCounts(rows);
  const total = rows.length;
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const last30 = now.getTime() - 30 * msPerDay;
  const prev30 = now.getTime() - 60 * msPerDay;

  const recentCreated = rows.filter(
    (row) => new Date(row.createdAt).getTime() >= last30,
  ).length;
  const previousCreated = rows.filter((row) => {
    const createdAt = new Date(row.createdAt).getTime();
    return createdAt >= prev30 && createdAt < last30;
  }).length;

  const growthRate =
    previousCreated > 0
      ? ((recentCreated - previousCreated) / previousCreated) * 100
      : recentCreated > 0
        ? 100
        : 0;

  const churnRate = total > 0 ? (statusCounts.cancelled / total) * 100 : 0;
  const activeRate = total > 0 ? (statusCounts.active / total) * 100 : 0;

  const dueIn7Days = rows.filter((row) => {
    if (!row.nextBillingDate) return false;
    const time = new Date(row.nextBillingDate).getTime();
    return time >= now.getTime() && time <= now.getTime() + 7 * msPerDay;
  }).length;

  const dueIn30Days = rows.filter((row) => {
    if (!row.nextBillingDate) return false;
    const time = new Date(row.nextBillingDate).getTime();
    return time >= now.getTime() && time <= now.getTime() + 30 * msPerDay;
  }).length;

  const monthFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "2-digit",
  });
  const monthlyMap = new Map<string, number>();
  for (const row of rows) {
    const key = monthFormatter.format(new Date(row.createdAt));
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
  }

  const topProducts = new Map<string, number>();
  for (const row of rows) {
    topProducts.set(row.lineTitle, (topProducts.get(row.lineTitle) ?? 0) + 1);
  }

  const averageQuantity =
    total > 0
      ? rows.reduce((sum, row) => sum + Math.max(1, row.quantity || 1), 0) / total
      : 0;

  const newestContracts = [...rows]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((row) => ({
      shortId: row.shortId,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      lineTitle: row.lineTitle,
      status: row.status,
      createdAt: row.createdAt,
      nextBillingDate: row.nextBillingDate,
    }));

  const healthSummary =
    total === 0
      ? "No subscription contracts yet. Once orders start coming in, this dashboard will show retention and growth signals."
      : churnRate > 25
        ? "Churn is relatively high versus the active base. Review cancellation reasons and subscription discounts."
        : growthRate < 0
          ? "Active base is healthy, but recent growth is cooling. Consider pushing rule-based offers to more products."
          : "Subscription health looks stable with a balanced active base and positive recent acquisition.";

  return {
    total,
    statusCounts,
    activeRate,
    churnRate,
    averageQuantity,
    recentCreated,
    previousCreated,
    growthRate,
    dueIn7Days,
    dueIn30Days,
    newestContracts,
    healthSummary,
    monthlySeries: [...monthlyMap.entries()]
      .map(([label, value]) => ({ label, value }))
      .slice(-6),
    topProducts: [...topProducts.entries()]
      .map(([title, contracts]) => ({ title, contracts }))
      .sort((a, b) => b.contracts - a.contracts)
      .slice(0, 5),
  };
}
