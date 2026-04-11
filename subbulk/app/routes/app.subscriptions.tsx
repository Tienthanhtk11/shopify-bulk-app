import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  EmptyState,
  InlineGrid,
  InlineStack,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { useEffect, useMemo, useState } from "react";
import { authenticate } from "../shopify.server";
import {
  buildSubscriptionStatusCounts,
  listAdminSubscriptionContracts,
  type SubscriptionContractRow,
  type SubscriptionContractStatus,
} from "../models/subscription-contracts.server";

type StatusFilter = "ALL" | SubscriptionContractStatus;

function formatDate(value: string | null) {
  if (!value) return "No upcoming billing";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatPaymentStatus(value: string | null) {
  if (!value) return "No billing attempt recorded in Shopify yet";
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function paymentMethodTone(status: SubscriptionContractRow["paymentMethodStatus"]) {
  switch (status) {
    case "ON_FILE":
      return "success" as const;
    case "REVOKED":
      return "critical" as const;
    default:
      return "attention" as const;
  }
}

function statusTone(status: SubscriptionContractStatus) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "PAUSED":
      return "attention" as const;
    case "CANCELLED":
      return "critical" as const;
  }
}

function matchesSearch(row: SubscriptionContractRow, query: string) {
  if (!query.trim()) return true;
  const normalized = query.toLowerCase();
  return [
    row.shortId,
    row.customerName,
    row.customerEmail,
    row.lineTitle,
    row.status,
    row.paymentMethodLabel ?? "",
    row.lastPaymentStatus ?? "",
  ].some((value) => value.toLowerCase().includes(normalized));
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  try {
    const rows = await listAdminSubscriptionContracts(admin, 100);
    const counts = buildSubscriptionStatusCounts(rows);

    return {
      rows,
      counts,
      scopeError: null,
    };
  } catch (error) {
    console.warn(
      "[subscriptions] Failed to load subscription contracts:",
      error instanceof Error ? error.message : error,
    );

    return {
      rows: [],
      counts: {
        active: 0,
        paused: 0,
        cancelled: 0,
      },
      scopeError:
        "Unable to load subscription data. The app may need additional API scopes (read_own_subscription_contracts) approved by Shopify.",
    };
  }
};

export default function SubscriptionsPage() {
  const { rows, counts, scopeError } = useLoaderData<typeof loader>();
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEXT_BILLING_DESC");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    const next = rows
      .filter((row) => (status === "ALL" ? true : row.status === status))
      .filter((row) => matchesSearch(row, query));

    next.sort((a, b) => {
      if (sortBy === "CREATED_DESC") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      const aTime = a.nextBillingDate
        ? new Date(a.nextBillingDate).getTime()
        : new Date(a.createdAt).getTime();
      const bTime = b.nextBillingDate
        ? new Date(b.nextBillingDate).getTime()
        : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    return next;
  }, [query, rows, sortBy, status]);

  const pageSizeValue = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSizeValue));
  const pageStartIndex = filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSizeValue + 1;
  const pageEndIndex = Math.min(currentPage * pageSizeValue, filteredRows.length);
  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * pageSizeValue, currentPage * pageSizeValue),
    [currentPage, filteredRows, pageSizeValue],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, query, sortBy, status]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <Page>
      <TitleBar title="Subscriptions" />
      <BlockStack gap="500">
        {scopeError ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Limited data
              </Text>
              <Text as="p" variant="bodyMd">
                {scopeError}
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        <InlineGrid columns={{ xs: 1, md: 4 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Total subscriptions
              </Text>
              <Text as="p" variant="heading2xl">
                {rows.length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Active
              </Text>
              <Text as="p" variant="heading2xl">
                {counts.active}
              </Text>
              <Badge tone="success">Healthy</Badge>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Paused
              </Text>
              <Text as="p" variant="heading2xl">
                {counts.paused}
              </Text>
              <Badge tone="attention">Needs follow-up</Badge>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Cancelled
              </Text>
              <Text as="p" variant="heading2xl">
                {counts.cancelled}
              </Text>
              <Badge tone="critical">At risk</Badge>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h1" variant="headingLg">
                  Subscription list
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Search by customer, email, contract id, or subscribed product.
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Payment method badges come directly from Shopify. The payment status line stays empty until Shopify records a billing attempt for that contract.
                </Text>
              </BlockStack>
              <InlineStack gap="200">
                <Button disabled>Add subscription</Button>
                <Button disabled>Export</Button>
              </InlineStack>
            </InlineStack>

            <InlineStack gap="200">
              {[
                { id: "ALL", label: "All", count: rows.length },
                { id: "ACTIVE", label: "Active", count: counts.active },
                { id: "PAUSED", label: "Paused", count: counts.paused },
                { id: "CANCELLED", label: "Cancelled", count: counts.cancelled },
              ].map((tab) => {
                const selected = status === tab.id;
                return (
                  <Box
                    key={tab.id}
                    as="button"
                    paddingInline="300"
                    paddingBlock="200"
                    borderRadius="200"
                    borderWidth="025"
                    borderColor={selected ? "border-emphasis" : "border"}
                    background={selected ? "bg-surface-secondary" : "bg-surface"}
                    onClick={() => setStatus(tab.id as StatusFilter)}
                  >
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="span" variant="bodyMd" fontWeight="medium">
                        {tab.label}
                      </Text>
                      <Badge>{tab.count}</Badge>
                    </InlineStack>
                  </Box>
                );
              })}
            </InlineStack>

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="300">
              <TextField
                label="Search"
                labelHidden
                autoComplete="off"
                value={query}
                onChange={setQuery}
                placeholder="Search subscriptions"
              />
              <Select
                label="Records per page"
                labelHidden
                value={pageSize}
                onChange={setPageSize}
                options={[
                  { label: "Show 10 per page", value: "10" },
                  { label: "Show 25 per page", value: "25" },
                  { label: "Show 50 per page", value: "50" },
                  { label: "Show 100 per page", value: "100" },
                ]}
              />
              <Select
                label="Sort"
                labelHidden
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: "Next billing first", value: "NEXT_BILLING_DESC" },
                  { label: "Newest created first", value: "CREATED_DESC" },
                ]}
              />
            </InlineGrid>

            {filteredRows.length === 0 ? (
              <EmptyState
                heading={scopeError ? "Subscription data unavailable" : "No subscriptions found"}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>
                  {scopeError
                    ? "Approve the protected subscription scope in Shopify, then reinstall or reauthorize the app to load live contract data."
                    : "Try another search keyword or switch to another status."}
                </p>
              </EmptyState>
            ) : (
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Showing {pageStartIndex}-{pageEndIndex} of {filteredRows.length}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {query.trim()
                      ? `Filtered from ${status === "ALL" ? "the current Shopify snapshot" : `${status.toLowerCase()} subscriptions in the current Shopify snapshot`}`
                      : status === "ALL"
                        ? "Current Shopify snapshot"
                        : `${status.charAt(0)}${status.slice(1).toLowerCase()} subscriptions in the current Shopify snapshot`}
                  </Text>
                </InlineStack>

                {paginatedRows.map((row) => (
                  <Card key={row.id}>
                    <InlineGrid columns={{ xs: 1, md: "2fr 1fr 1fr" }} gap="400">
                      <BlockStack gap="100">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="h2" variant="headingMd">
                            #{row.shortId}
                          </Text>
                          <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                        </InlineStack>
                        <Text as="p" variant="bodyMd" fontWeight="medium">
                          {row.customerName}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {row.customerEmail}
                        </Text>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">
                          Product
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {row.lineTitle}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Qty {row.quantity}
                        </Text>
                        <InlineStack gap="200" blockAlign="center" wrap>
                          <Badge tone={paymentMethodTone(row.paymentMethodStatus)}>
                            {row.paymentMethodLabel || "Payment method details not exposed by Shopify yet"}
                          </Badge>
                        </InlineStack>
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">
                          Next billing
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {formatDate(row.nextBillingDate)}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Payment status: {formatPaymentStatus(row.lastPaymentStatus)}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Created {formatDate(row.createdAt)}
                        </Text>
                      </BlockStack>
                    </InlineGrid>
                  </Card>
                ))}

                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <InlineStack gap="200">
                    <Button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    >
                      Next
                    </Button>
                  </InlineStack>
                </InlineStack>
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
