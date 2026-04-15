import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { isAdminOrManager } from "../../utils/roleUtils.js";
import { RoleBadge } from "../ui/Badge.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "◈" },
  { to: "/users", label: "Users", icon: "◉", adminOnly: true },
  { to: "/profile", label: "My Profile", icon: "◎" },
];

export default function Sidebar({ open, isMobile = false }) {
  const { user } = useAuth();

  const linkStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? "var(--primary)" : "var(--text-muted)",
    background: isActive ? "var(--primary-light)" : "transparent",
    transition: "all 0.15s",
    textDecoration: "none",
  });

  return (
    <aside style={{
      width: isMobile ? "100vw" : 240,
      maxWidth: 240,
      position: isMobile ? "fixed" : "fixed",
      top: 60,
      left: 0,
      bottom: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      padding: "0 12px",
      transform: open ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.25s",
      zIndex: 100,
      overflowY: "auto",
    }}>
      {/* Logo */}
      <div style={{
        padding: "22px 8px 18px",
        borderBottom: "1px solid var(--border)",
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "var(--primary)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 16,
          }}>U</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>UMS</div>
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>User Management</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map((item) => {
          if (item.adminOnly && !isAdminOrManager(user)) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => linkStyle(isActive)}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes("primary"))
                  e.currentTarget.style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes("primary"))
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      {user && (
        <div style={{
          padding: "14px 8px",
          borderTop: "1px solid var(--border)",
          marginTop: "auto",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
            {user.name}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 8 }}>
            {user.email}
          </div>
          <RoleBadge role={user.role} />
        </div>
      )}
    </aside>
  );
}
