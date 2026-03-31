import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import {
  authenticateInternalAdminLogin,
  createInternalAdminUserSession,
  getInternalAdminUser,
} from "../services/internal-admin-portal.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getInternalAdminUser(request);
  if (user) {
    throw redirect("/admin/merchants");
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await authenticateInternalAdminLogin(email, password);
  if (!user) {
    return json({ ok: false, error: "Invalid admin email or password." }, { status: 400 });
  }

  return createInternalAdminUserSession(request, user);
};

export default function InternalAdminLoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <main style={styles.page}>
      <div style={styles.glowLeft} />
      <div style={styles.glowRight} />
      <section style={styles.card}>
        <div style={styles.heroPanel}>
          <p style={styles.eyebrow}>admin-app.thanhpt.online</p>
          <h1 style={styles.title}>Modern merchant operations console</h1>
          <p style={styles.copy}>
            Monitor package state, merchant lifecycle, deletion workflows, and internal access from one secure control surface.
          </p>

          <div style={styles.bulletPanel}>
            {[
              "DB-backed internal admin accounts",
              "Live package and billing visibility",
              "Merchant timeline and operational control",
            ].map((item) => (
              <div key={item} style={styles.bulletRow}>
                <span style={styles.bulletDot} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.formPanel}>
          <p style={styles.formLabel}>Internal access</p>
          <h2 style={styles.formTitle}>Sign in</h2>

          <Form method="post" style={styles.form}>
            <label style={styles.label}>
              <span>Email</span>
              <input style={styles.input} type="email" name="email" autoComplete="username" required />
            </label>
            <label style={styles.label}>
              <span>Password</span>
              <input style={styles.input} type="password" name="password" autoComplete="current-password" required />
            </label>
            {actionData?.error ? <p style={styles.error}>{actionData.error}</p> : null}
            <button style={styles.button} type="submit">
              Enter portal
            </button>
          </Form>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background:
      "radial-gradient(circle at top left, rgba(31, 214, 194, 0.18), transparent 28%), radial-gradient(circle at 80% 20%, rgba(91, 123, 255, 0.2), transparent 26%), linear-gradient(180deg, #07111f 0%, #07101b 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: '"Space Grotesk", "Segoe UI Variable", "Trebuchet MS", sans-serif',
  },
  glowLeft: {
    position: "fixed",
    width: "420px",
    height: "420px",
    borderRadius: "999px",
    left: "-120px",
    top: "-100px",
    background: "rgba(40, 212, 200, 0.18)",
    filter: "blur(42px)",
  },
  glowRight: {
    position: "fixed",
    width: "380px",
    height: "380px",
    borderRadius: "999px",
    right: "-80px",
    bottom: "10%",
    background: "rgba(93, 108, 255, 0.18)",
    filter: "blur(42px)",
  },
  card: {
    width: "100%",
    maxWidth: "1040px",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    borderRadius: "30px",
    overflow: "hidden",
    background: "rgba(5, 11, 21, 0.82)",
    border: "1px solid rgba(109, 224, 216, 0.16)",
    boxShadow: "0 28px 90px rgba(0, 0, 0, 0.38)",
    backdropFilter: "blur(20px)",
    position: "relative",
    zIndex: 1,
  },
  heroPanel: {
    padding: "42px",
    background: "linear-gradient(160deg, rgba(8, 19, 37, 0.96), rgba(8, 14, 27, 0.92))",
    borderRight: "1px solid rgba(109, 224, 216, 0.12)",
  },
  formPanel: {
    padding: "42px",
    display: "grid",
    alignContent: "center",
    background: "linear-gradient(180deg, rgba(11, 20, 37, 0.92), rgba(7, 14, 25, 0.86))",
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    color: "#7ce7db",
    fontFamily: '"IBM Plex Mono", monospace',
  },
  title: {
    margin: "14px 0 14px",
    fontSize: "46px",
    lineHeight: 0.95,
    color: "#f3f9ff",
    letterSpacing: "-0.04em",
  },
  copy: {
    margin: 0,
    color: "rgba(215, 231, 247, 0.74)",
    lineHeight: 1.5,
    maxWidth: "480px",
  },
  bulletPanel: {
    marginTop: "28px",
    display: "grid",
    gap: "12px",
  },
  bulletRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d9e8f7",
    padding: "12px 14px",
    borderRadius: "16px",
    background: "rgba(16, 31, 55, 0.76)",
    border: "1px solid rgba(97, 154, 210, 0.14)",
  },
  bulletDot: {
    width: "9px",
    height: "9px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #20d7c4 0%, #6c84ff 100%)",
    boxShadow: "0 0 16px rgba(35, 217, 197, 0.6)",
  },
  formLabel: {
    margin: 0,
    color: "#7ce7db",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontFamily: '"IBM Plex Mono", monospace',
  },
  formTitle: {
    margin: "12px 0 0",
    color: "#f4fbff",
    fontSize: "32px",
  },
  form: {
    marginTop: "24px",
    display: "grid",
    gap: "16px",
  },
  label: {
    display: "grid",
    gap: "8px",
    color: "#d7e8fb",
    fontWeight: 600,
  },
  input: {
    border: "1px solid rgba(100, 154, 211, 0.18)",
    borderRadius: "16px",
    padding: "14px 16px",
    fontSize: "16px",
    background: "rgba(8, 16, 31, 0.82)",
    color: "#f5fbff",
  },
  error: {
    margin: 0,
    color: "#ff8a8a",
    fontWeight: 600,
  },
  button: {
    border: 0,
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1cd1c2 0%, #4d7fff 100%)",
    color: "#04101f",
    padding: "14px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 18px 34px rgba(23, 90, 145, 0.28)",
  },
};
