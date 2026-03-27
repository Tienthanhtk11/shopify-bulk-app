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
import { useMemo, useState } from "react";
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
  ].some((value) => value.toLowerCase().includes(normalized));
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const rows = await listAdminSubscriptionContracts(admin, 100);
  const counts = buildSubscriptionStatusCounts(rows);

  return {
    rows,
    counts,
  };
};

export default function SubscriptionsPage() {
  const { rows, counts } = useLoaderData<typeof loader>();
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("NEXT_BILLING_DESC");

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

  return (
    <Page>
      <TitleBar title="Subscriptions" />
      <BlockStack gap="500">
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
                label="Sort"
                labelHidden
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { label: "Next billing first", value: "NEXT_BILLING_DESC" },
                  { label: "Newest created first", value: "CREATED_DESC" },
                ]}
              />
              <Card>
                <InlineStack align="space-between">
                  <Text as="p" variant="bodyMd">
                    Showing {filteredRows.length}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Latest 100 per status
                  </Text>
                </InlineStack>
              </Card>
            </InlineGrid>

            {filteredRows.length === 0 ? (
              <EmptyState
                heading="No subscriptions found"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Try another search keyword or switch to another status.</p>
              </EmptyState>
            ) : (
              <BlockStack gap="300">
                {filteredRows.map((row) => (
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
                      </BlockStack>

                      <BlockStack gap="100">
                        <Text as="p" variant="bodySm" tone="subdued">
                          Next billing
                        </Text>
                        <Text as="p" variant="bodyMd">
                          {formatDate(row.nextBillingDate)}
                        </Text>
                        <Text as="p" variant="bodySm" tone="subdued">
                          Created {formatDate(row.createdAt)}
                        </Text>
                      </BlockStack>
                    </InlineGrid>
                  </Card>
                ))}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
