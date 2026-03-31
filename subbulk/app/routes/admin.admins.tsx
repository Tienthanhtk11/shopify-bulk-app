import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import {
  createInternalAdminAccount,
  deleteInternalAdminAccount,
  listInternalAdminAccounts,
  updateInternalAdminAccount,
} from "../services/internal-admin-accounts.server";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";

function parseCheckbox(value: FormDataEntryValue | null) {
  return String(value || "") === "true";
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value || "").trim().toLowerCase();
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const currentUser = await requireInternalAdminUser(request);
  const admins = await listInternalAdminAccounts();
  return { currentUser, admins };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const currentUser = await requireInternalAdminUser(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  try {
    if (intent === "create") {
      const email = normalizeEmail(formData.get("email"));
      const displayName = String(formData.get("displayName") || "").trim();
      const password = String(formData.get("password") || "").trim();
      const isActive = parseCheckbox(formData.get("isActive"));

      if (!email || !displayName || !password) {
        return json({ ok: false, error: "Email, display name, and password are required." }, { status: 400 });
      }

      await createInternalAdminAccount({ email, displayName, password, isActive });
      return json({ ok: true, message: `Created admin ${email}.` });
    }

    if (intent === "update") {
      const id = String(formData.get("id") || "").trim();
      const email = normalizeEmail(formData.get("email"));
      const displayName = String(formData.get("displayName") || "").trim();
      const password = String(formData.get("password") || "").trim();
      const isActive = parseCheckbox(formData.get("isActive"));

      if (!id || !email || !displayName) {
        return json({ ok: false, error: "Missing admin account data." }, { status: 400 });
      }

      if (currentUser.id === id && !isActive) {
        return json({ ok: false, error: "You cannot deactivate the admin account currently in use." }, { status: 400 });
      }

      await updateInternalAdminAccount({
        id,
        email,
        displayName,
        password: password || undefined,
        isActive,
      });
      return json({ ok: true, message: `Updated admin ${email}.` });
    }

    if (intent === "delete") {
      const id = String(formData.get("id") || "").trim();
      if (!id) {
        return json({ ok: false, error: "Missing admin account id." }, { status: 400 });
      }

      if (currentUser.id === id) {
        return json({ ok: false, error: "You cannot delete the admin account currently in use." }, { status: 400 });
      }

      await deleteInternalAdminAccount(id);
      return json({ ok: true, message: "Deleted admin account." });
    }

    return json({ ok: false, error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update admin accounts.";
    return json({ ok: false, error: message }, { status: 400 });
  }
};

function formatDateTime(value: string | Date | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function InternalAdminAccountsPage() {
  const { admins, currentUser } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const lastSubmittedFormRef = useRef<HTMLFormElement | null>(null);
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

    if (actionData.ok) {
      lastSubmittedFormRef.current?.reset();
      lastSubmittedFormRef.current = null;
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
              <p style={styles.toastTitle}>{toast.tone === "success" ? "Admin accounts updated" : "Update failed"}</p>
              <p style={styles.toastMessage}>{toast.message}</p>
            </div>
            <button style={styles.toastCloseButton} type="button" onClick={() => setToast(null)}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Portal access</p>
          <h2 style={styles.heading}>Internal admin accounts</h2>
        </div>
        <p style={styles.subcopy}>
          Manage who can sign in to the standalone internal portal. Accounts are now stored in PostgreSQL instead of relying on hardcoded credentials.
        </p>
      </header>

      <section style={styles.createCard}>
        <Form
          method="post"
          style={styles.createForm}
          onSubmit={(event) => {
            lastSubmittedFormRef.current = event.currentTarget;
          }}
        >
          <input type="hidden" name="intent" value="create" />
          <label style={styles.label}>
            <span>Email</span>
            <input name="email" type="email" style={styles.input} required />
          </label>
          <label style={styles.label}>
            <span>Display name</span>
            <input name="displayName" style={styles.input} required />
          </label>
          <label style={styles.label}>
            <span>Password</span>
            <input name="password" type="password" style={styles.input} minLength={8} required />
          </label>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="isActive" value="true" defaultChecked />
            <span>Active</span>
          </label>
          <button style={styles.primaryButton} type="submit">Add admin</button>
        </Form>
      </section>

      <section style={styles.list}>
        {admins.map((admin) => (
          <article key={admin.id} style={styles.card}>
            <Form
              method="post"
              style={styles.cardForm}
              onSubmit={(event) => {
                lastSubmittedFormRef.current = event.currentTarget;
                if (!window.confirm(`Confirm update for ${admin.email}?`)) {
                  event.preventDefault();
                  lastSubmittedFormRef.current = null;
                }
              }}
            >
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="id" value={admin.id} />
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.cardTitle}>{admin.displayName}</h3>
                  <p style={styles.cardMeta}>{admin.email}</p>
                </div>
                <div style={admin.isActive ? styles.badgeSuccess : styles.badgeMuted}>
                  {admin.isActive ? "Active" : "Disabled"}
                </div>
              </div>
              <div style={styles.infoGrid}>
                <p style={styles.infoItem}><strong>Created:</strong> {formatDateTime(admin.createdAt)}</p>
                <p style={styles.infoItem}><strong>Last login:</strong> {formatDateTime(admin.lastLoginAt)}</p>
                <p style={styles.infoItem}><strong>Session owner:</strong> {currentUser.id === admin.id ? "Current account" : "Other admin"}</p>
              </div>
              <div style={styles.formGrid}>
                <label style={styles.label}>
                  <span>Email</span>
                  <input name="email" type="email" defaultValue={admin.email} style={styles.input} required />
                </label>
                <label style={styles.label}>
                  <span>Display name</span>
                  <input name="displayName" defaultValue={admin.displayName} style={styles.input} required />
                </label>
                <label style={styles.label}>
                  <span>New password</span>
                  <input name="password" type="password" placeholder="Leave blank to keep current password" style={styles.input} />
                </label>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" name="isActive" value="true" defaultChecked={admin.isActive} />
                  <span>Active</span>
                </label>
              </div>
              <div style={styles.actionsRow}>
                <button style={styles.primaryButton} type="submit">Save</button>
              </div>
            </Form>

            <Form
              method="post"
              onSubmit={(event) => {
                lastSubmittedFormRef.current = event.currentTarget;
                if (!window.confirm(`Delete admin account ${admin.email}? This cannot be undone.`)) {
                  event.preventDefault();
                  lastSubmittedFormRef.current = null;
                }
              }}
            >
              <input type="hidden" name="intent" value="delete" />
              <input type="hidden" name="id" value={admin.id} />
              <button style={styles.deleteButton} type="submit" disabled={currentUser.id === admin.id}>
                Delete
              </button>
            </Form>
          </article>
        ))}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: "grid", gap: "24px", color: "#edf7ff" },
  toastViewport: { position: "fixed", top: "88px", right: "32px", zIndex: 40, display: "flex", justifyContent: "end", pointerEvents: "none" },
  toast: { minWidth: "320px", maxWidth: "420px", padding: "16px 18px", borderRadius: "14px", border: "1px solid transparent", display: "flex", alignItems: "start", justifyContent: "space-between", gap: "16px", backdropFilter: "blur(18px)", boxShadow: "0 24px 60px rgba(3,8,20,0.45)", pointerEvents: "auto" },
  toastSuccess: { background: "rgba(8, 25, 36, 0.92)", borderColor: "rgba(60,243,255,0.28)", color: "#dafbff" },
  toastError: { background: "rgba(34, 12, 18, 0.94)", borderColor: "rgba(255,180,171,0.24)", color: "#ffe2dd" },
  toastTitle: { margin: 0, fontFamily: 'Manrope, "Segoe UI", sans-serif', fontSize: "16px", fontWeight: 800 },
  toastMessage: { margin: "6px 0 0", fontFamily: '"Space Grotesk", sans-serif', fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase", opacity: 0.88 },
  toastCloseButton: { border: "1px solid rgba(133,147,153,0.18)", background: "rgba(255,255,255,0.04)", color: "inherit", minWidth: "92px", height: "36px", borderRadius: "999px", fontFamily: '"Space Grotesk", sans-serif', fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.14em", cursor: "pointer" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: "20px" },
  eyebrow: { margin: 0, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#7ce7db", fontFamily: '"IBM Plex Mono", monospace' },
  heading: { margin: "8px 0 0", fontSize: "38px", letterSpacing: "-0.03em" },
  subcopy: { margin: 0, maxWidth: "620px", color: "rgba(211, 227, 245, 0.7)", lineHeight: 1.5 },
  createCard: { background: "linear-gradient(180deg, rgba(12, 23, 40, 0.92), rgba(8, 17, 30, 0.86))", border: "1px solid rgba(96, 156, 214, 0.14)", borderRadius: "24px", padding: "22px", boxShadow: "0 18px 34px rgba(0, 0, 0, 0.18)" },
  createForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" },
  label: { display: "grid", gap: "6px", fontWeight: 600, color: "#dceaf7" },
  input: { border: "1px solid rgba(100, 154, 211, 0.18)", borderRadius: "16px", padding: "10px 12px", background: "rgba(10, 21, 37, 0.8)", fontSize: "15px", color: "#f5fbff" },
  checkboxLabel: { display: "flex", gap: "8px", alignItems: "center", color: "#dceaf7", fontWeight: 600 },
  primaryButton: { border: 0, borderRadius: "16px", background: "linear-gradient(135deg, #1cd1c2 0%, #4d7fff 100%)", color: "#04101f", padding: "12px 14px", fontWeight: 700, cursor: "pointer", minHeight: "44px", boxShadow: "0 14px 26px rgba(18, 80, 138, 0.28)" },
  list: { display: "grid", gap: "16px" },
  card: { background: "linear-gradient(180deg, rgba(12, 23, 40, 0.92), rgba(8, 17, 30, 0.86))", border: "1px solid rgba(96, 156, 214, 0.14)", borderRadius: "24px", padding: "22px", display: "grid", gap: "14px", boxShadow: "0 18px 34px rgba(0, 0, 0, 0.18)" },
  cardForm: { display: "grid", gap: "14px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" },
  cardTitle: { margin: 0, fontSize: "22px", color: "#f6fbff" },
  cardMeta: { margin: "6px 0 0", color: "rgba(202, 219, 238, 0.66)" },
  badgeSuccess: { padding: "8px 10px", borderRadius: "999px", background: "rgba(18, 73, 61, 0.74)", color: "#8ef1c9", fontWeight: 700, fontSize: "13px" },
  badgeMuted: { padding: "8px 10px", borderRadius: "999px", background: "rgba(49, 58, 75, 0.76)", color: "#c4d5ea", fontWeight: 700, fontSize: "13px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" },
  infoItem: { margin: 0, color: "rgba(202, 219, 238, 0.7)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" },
  actionsRow: { display: "flex", justifyContent: "flex-start" },
  deleteButton: { border: "1px solid rgba(245, 118, 144, 0.22)", borderRadius: "16px", background: "rgba(87, 24, 33, 0.56)", color: "#ff9ab0", padding: "12px 14px", fontWeight: 700, cursor: "pointer" },
};