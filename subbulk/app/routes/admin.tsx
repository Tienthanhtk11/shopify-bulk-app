import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { requireInternalAdminUser } from "../services/internal-admin-portal.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&family=Space+Grotesk:wght@500;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
  },
];

const NAV_ITEMS = [
  {
    to: "/admin/merchants",
    label: "Merchants",
    meta: "Live merchant intelligence",
    compactMeta: "MERCHANTS",
    icon: "storefront",
  },
  {
    to: "/admin/subscriptions",
    label: "Packages",
    meta: "Commercial plan control",
    compactMeta: "PACKAGES",
    icon: "inventory_2",
  },
  {
    to: "/admin/admins",
    label: "Admins",
    meta: "Internal access management",
    compactMeta: "ADMINS",
    icon: "admin_panel_settings",
  },
] as const;

function getPageMeta(pathname: string) {
  if (pathname === "/admin" || pathname === "/admin/") {
    return {
      eyebrow: "SYSTEM_OVERVIEW",
      title: "Control Grid live operations shell",
    };
  }

  if (pathname.startsWith("/admin/subscriptions")) {
    return {
      eyebrow: "COMMERCIAL_OPS",
      title: "Package ladder and merchant coverage",
    };
  }

  if (pathname.startsWith("/admin/admins")) {
    return {
      eyebrow: "ACCESS_CONTROL",
      title: "Database-backed internal admin management",
    };
  }

  return {
    eyebrow: "MERCHANT_OPERATIONS",
    title: "Merchant lifecycle and billing oversight",
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const pathname = new URL(request.url).pathname;
  const isAuthRoute = pathname === "/admin/login" || pathname === "/admin/logout";

  if (isAuthRoute) {
    return { user: null, isAuthRoute, pathname, pageMeta: getPageMeta(pathname) };
  }

  const user = await requireInternalAdminUser(request);
  return { user, isAuthRoute, pathname, pageMeta: getPageMeta(pathname) };
};

export default function InternalAdminLayout() {
  const { user, isAuthRoute, pageMeta } = useLoaderData<typeof loader>();

  if (isAuthRoute || !user) {
    return <Outlet />;
  }

  return (
    <main style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.brandRow}>
            <div style={styles.brandIcon}>
              <span className="material-symbols-outlined" style={styles.brandIconGlyph}>grid_view</span>
            </div>
            <h1 style={styles.brandTitle}>Control Grid</h1>
          </div>

          <nav style={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : null),
                })}
              >
                <span className="material-symbols-outlined" style={styles.navIcon}>{item.icon}</span>
                <span style={styles.navLabel}>{item.compactMeta}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.profileCard}>
            <div style={styles.profileRow}>
              <div style={styles.profileAvatar}>{user.displayName.slice(0, 1).toUpperCase()}</div>
              <div>
                <p style={styles.profileName}>{user.displayName}</p>
                <p style={styles.profileMeta}>SubBulk Internal</p>
              </div>
            </div>
            <button style={styles.liveButton} type="button">
              Live Production
            </button>
          </div>

          <Form method="post" action="/admin/logout">
            <button style={styles.logoutButton} type="submit">
              <span className="material-symbols-outlined" style={styles.logoutIcon}>logout</span>
              Log out
            </button>
          </Form>
        </div>
      </aside>

      <header style={styles.topbar}>
        <div style={styles.topbarLeft}>
          <span style={styles.topbarEyebrow}>{pageMeta.eyebrow}</span>
          <div style={styles.topbarDivider} />
          <h2 style={styles.topbarTitle}>{pageMeta.title}</h2>
        </div>

        <div style={styles.topbarRight}>
          <div style={styles.searchShell}>
            <span className="material-symbols-outlined" style={styles.searchIcon}>search</span>
            <input style={styles.searchInput} placeholder="Search system metrics..." />
          </div>
          <div style={styles.topbarActions}>
            <span className="material-symbols-outlined" style={styles.topbarActionIcon}>notifications</span>
            <span className="material-symbols-outlined" style={styles.topbarActionIcon}>settings</span>
            <span className="material-symbols-outlined" style={styles.topbarActionIcon}>terminal</span>
          </div>
        </div>
      </header>

      <section style={styles.content}>
        <Outlet />
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    minHeight: "100vh",
    background: "#0b1326",
    color: "#dae2fd",
    fontFamily: 'Inter, "Segoe UI", sans-serif',
  },
  sidebar: {
    position: "fixed",
    inset: "0 auto 0 0",
    width: "256px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid rgba(60, 73, 78, 0.15)",
    background: "#131b2e",
    zIndex: 50,
  },
  sidebarTop: {
    display: "grid",
    gap: "8px",
    padding: "24px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #3cf3ff 0%, #00d6e1 100%)",
    boxShadow: "0 0 15px rgba(60,243,255,0.2)",
  },
  brandIconGlyph: {
    color: "#00363a",
    fontSize: "20px",
    fontVariationSettings: '"FILL" 1',
  },
  brandTitle: {
    margin: 0,
    fontWeight: 700,
    fontSize: "20px",
    letterSpacing: "-0.02em",
    color: "#dae2fd",
    fontFamily: 'Manrope, "Segoe UI", sans-serif',
  },
  nav: {
    display: "grid",
    gap: "4px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    color: "rgba(218, 226, 253, 0.6)",
    textDecoration: "none",
    transition: "all 140ms ease",
  },
  navLinkActive: {
    background: "#171f33",
    color: "#3cf3ff",
    borderRight: "2px solid #3cf3ff",
    boxShadow: "0 0 15px rgba(60,243,255,0.1)",
  },
  navIcon: {
    fontSize: "20px",
  },
  navLabel: {
    fontFamily: 'Inter, "Segoe UI", sans-serif',
    fontSize: "14px",
    letterSpacing: "0.01em",
    fontWeight: 600,
  },
  sidebarBottom: {
    display: "grid",
    gap: "16px",
    padding: "24px",
  },
  profileCard: {
    padding: "16px",
    borderRadius: "8px",
    background: "rgba(34, 42, 61, 0.4)",
    border: "1px solid rgba(60, 73, 78, 0.1)",
  },
  profileRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "8px",
  },
  profileAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "999px",
    background: "#2d3449",
    display: "grid",
    placeItems: "center",
    color: "#dae2fd",
    fontWeight: 700,
    fontSize: "12px",
  },
  profileName: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 600,
    color: "#dae2fd",
  },
  profileMeta: {
    margin: "2px 0 0",
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#bbc9cf",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  liveButton: {
    width: "100%",
    marginTop: "8px",
    padding: "8px 12px",
    background: "rgba(60, 243, 255, 0.1)",
    border: "1px solid rgba(60, 243, 255, 0.2)",
    color: "#3cf3ff",
    borderRadius: "4px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontFamily: '"Space Grotesk", sans-serif',
    cursor: "pointer",
  },
  logoutButton: {
    width: "100%",
    border: 0,
    borderRadius: "4px",
    background: "transparent",
    color: "rgba(255, 180, 171, 0.8)",
    padding: "12px 16px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "flex-start",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: "11px",
    fontFamily: '"Space Grotesk", sans-serif',
  },
  logoutIcon: {
    fontSize: "20px",
  },
  topbar: {
    position: "fixed",
    top: 0,
    left: "256px",
    right: 0,
    height: "64px",
    zIndex: 40,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    background: "rgba(11, 19, 38, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(60, 73, 78, 0.15)",
  },
  topbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  topbarEyebrow: {
    fontFamily: '"Space Grotesk", sans-serif',
    fontSize: "10px",
    color: "rgba(60, 243, 255, 0.6)",
    letterSpacing: "0.2em",
  },
  topbarDivider: {
    width: "1px",
    height: "16px",
    background: "rgba(133, 147, 153, 0.3)",
  },
  topbarTitle: {
    margin: 0,
    fontFamily: 'Manrope, "Segoe UI", sans-serif',
    fontSize: "18px",
    fontWeight: 700,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  searchShell: {
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    color: "#bbc9cf",
  },
  searchInput: {
    width: "256px",
    border: "none",
    borderRadius: "8px",
    background: "#131b2e",
    color: "#dae2fd",
    fontSize: "13px",
    padding: "8px 14px 8px 36px",
    outline: "none",
  },
  topbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  topbarActionIcon: {
    fontSize: "20px",
    color: "#bbc9cf",
    cursor: "pointer",
  },
  content: {
    marginLeft: "256px",
    padding: "96px 32px 48px",
  },
};
