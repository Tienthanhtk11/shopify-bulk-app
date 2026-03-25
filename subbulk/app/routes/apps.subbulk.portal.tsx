import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";

type ContractRow = {
  id: string;
  status: string;
  nextBillingDate: string | null;
  lineTitle: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const ctx = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const loggedInCustomerId = url.searchParams.get("logged_in_customer_id");

  if (!ctx.admin) {
    return {
      error: "no_app_session" as const,
      contracts: [] as ContractRow[],
    };
  }

  if (!loggedInCustomerId) {
    return {
      error: "login" as const,
      contracts: [] as ContractRow[],
    };
  }

  const customerGid = `gid://shopify/Customer/${loggedInCustomerId}`;
  const res = await ctx.admin.graphql(
    `#graphql
    query SubBulkPortalContracts($id: ID!) {
      customer(id: $id) {
        id
        subscriptionContracts(first: 20) {
          nodes {
            id
            status
            nextBillingDate
            lines(first: 1) {
              nodes {
                title
                variantTitle
              }
            }
          }
        }
      }
    }`,
    { variables: { id: customerGid } },
  );
  const json = await res.json();
  const nodes = json.data?.customer?.subscriptionContracts?.nodes ?? [];

  const contracts: ContractRow[] = nodes.map(
    (n: {
      id: string;
      status: string;
      nextBillingDate: string | null;
      lines?: { nodes?: { title?: string; variantTitle?: string }[] };
    }) => {
      const line = n.lines?.nodes?.[0];
      const lineTitle =
        [line?.title, line?.variantTitle].filter(Boolean).join(" — ") ||
        "Subscription";
      return {
        id: n.id,
        status: n.status,
        nextBillingDate: n.nextBillingDate ?? null,
        lineTitle,
      };
    },
  );

  return { error: null as const, contracts };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const ctx = await authenticate.public.appProxy(request);
  if (!ctx.admin) {
    return { error: "no_app_session" };
  }
  const fd = await request.formData();
  const intent = String(fd.get("intent"));
  const contractId = String(fd.get("contractId") || "");

  if (!contractId.startsWith("gid://shopify/SubscriptionContract/")) {
    return { error: "contract_invalid" };
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
      if (err) return { error: err };
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
      if (err) return { error: err };
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
      if (err) return { error: err };
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Lỗi" };
  }

  return redirect(request.url);
};

export default function SubbulkCustomerPortal() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";

  const styles = {
    wrap: {
      fontFamily: "system-ui, sans-serif",
      maxWidth: 720,
      margin: "24px auto",
      padding: 16,
    },
    h1: { fontSize: 22, marginBottom: 8 },
    p: { color: "#444", marginBottom: 16 },
    table: { width: "100%", borderCollapse: "collapse" as const },
    th: {
      textAlign: "left" as const,
      borderBottom: "1px solid #ddd",
      padding: "8px 4px",
    },
    td: { borderBottom: "1px solid #eee", padding: "10px 4px", verticalAlign: "top" as const },
    btn: {
      marginRight: 8,
      marginTop: 4,
      padding: "6px 10px",
      cursor: "pointer" as const,
    },
  };

  if (data.error === "no_app_session") {
    return (
      <div style={styles.wrap}>
        <h1 style={styles.h1}>SubBulk</h1>
        <p style={styles.p}>
          App chưa có phiên bản làm việc với cửa hàng này. Hãy cài đặt SubBulk
          và đảm bảo app proxy đã bật.
        </p>
      </div>
    );
  }

  if (data.error === "login") {
    return (
      <div style={styles.wrap}>
        <h1 style={styles.h1}>Đăng nhập để xem subscription</h1>
        <p style={styles.p}>
          Vui lòng đăng nhập tài khoản khách trên cửa hàng, sau đó mở lại trang
          này.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Subscription của bạn</h1>
      <p style={styles.p}>Tạm dừng, tiếp tục hoặc hủy gói đăng ký.</p>
      {actionData && "error" in actionData && actionData.error ? (
        <p style={{ ...styles.p, color: "#b00020" }}>{actionData.error}</p>
      ) : null}
      {data.contracts.length === 0 ? (
        <p style={styles.p}>Không có subscription nào.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sản phẩm</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Lần charge tiếp</th>
              <th style={styles.th}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.contracts.map((c) => (
              <tr key={c.id}>
                <td style={styles.td}>{c.lineTitle}</td>
                <td style={styles.td}>{c.status}</td>
                <td style={styles.td}>
                  {c.nextBillingDate
                    ? new Date(c.nextBillingDate).toLocaleString()
                    : "—"}
                </td>
                <td style={styles.td}>
                  {c.status === "ACTIVE" ? (
                    <Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="contractId" value={c.id} />
                      <input type="hidden" name="intent" value="pause" />
                      <button type="submit" style={styles.btn} disabled={busy}>
                        Tạm dừng
                      </button>
                    </Form>
                  ) : null}
                  {c.status === "PAUSED" ? (
                    <Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="contractId" value={c.id} />
                      <input type="hidden" name="intent" value="resume" />
                      <button type="submit" style={styles.btn} disabled={busy}>
                        Tiếp tục
                      </button>
                    </Form>
                  ) : null}
                  {c.status === "ACTIVE" || c.status === "PAUSED" ? (
                    <Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="contractId" value={c.id} />
                      <input type="hidden" name="intent" value="cancel" />
                      <button type="submit" style={styles.btn} disabled={busy}>
                        Hủy
                      </button>
                    </Form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
