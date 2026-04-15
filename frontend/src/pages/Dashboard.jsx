import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUsers } from "../api/user.api.js";
import { isAdminOrManager } from "../utils/roleUtils.js";
import { RoleBadge, StatusBadge } from "../components/ui/Badge.jsx";
import { formatDate } from "../utils/roleUtils.js";

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    padding: "22px 24px",
    border: "1px solid var(--border)",
    display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{
      width: 46, height: 46, borderRadius: 12,
      background: color + "22",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 20, color,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, admins: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAdminOrManager(user)) return;
    setLoading(true);
    Promise.all([
      getUsers({ limit: 100 }),
      getUsers({ limit: 5 }),
    ])
      .then(([all, recRes]) => {
        const users = all.data.data;
        setStats({
          total: all.data.pagination.total,
          active: users.filter((u) => u.status === "active").length,
          inactive: users.filter((u) => u.status === "inactive").length,
          admins: users.filter((u) => u.role === "admin").length,
        });
        setRecent(recRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Here's what's happening in your system.
        </p>
      </div>

      {isAdminOrManager(user) ? (
        <>
          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16, marginBottom: 32,
          }}>
            <StatCard label="Total Users" value={stats.total} color="#6c63ff" icon="◉" />
            <StatCard label="Active Users" value={stats.active} color="#10b981" icon="✓" />
            <StatCard label="Inactive Users" value={stats.inactive} color="#ef4444" icon="✕" />
            <StatCard label="Admins" value={stats.admins} color="#f59e0b" icon="★" />
          </div>

          {/* Recent users */}
          <div style={{
            background: "var(--surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>Recent Users</h2>
              <button
                onClick={() => navigate("/users")}
                style={{
                  fontSize: 13, color: "var(--primary)", background: "none",
                  border: "none", cursor: "pointer", fontWeight: 500,
                }}
              >
                View all →
              </button>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "var(--surface-2)" }}>
                    {["Name", "Email", "Role", "Status", "Created"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 16px", textAlign: "left",
                        fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((u, i) => (
                    <tr
                      key={u._id}
                      onClick={() => navigate(`/users/${u._id}`)}
                      style={{
                        borderTop: "1px solid var(--border)",
                        cursor: "pointer", transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}><RoleBadge role={u.role} /></td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={u.status} /></td>
                      <td style={{ padding: "12px 16px", color: "var(--text-light)", fontSize: 12 }}>
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        /* Regular user view */
        <div style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          border: "1px solid var(--border)",
          maxWidth: 500,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Your Account</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Name", user?.name],
              ["Email", user?.email],
              ["Role", <RoleBadge key="r" role={user?.role} />],
              ["Status", <StatusBadge key="s" status={user?.status} />],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", gap: 16 }}>
                <span style={{ width: 80, fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 14 }}>{val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/profile")}
            style={{
              marginTop: 20,
              padding: "9px 20px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Edit my profile →
          </button>
        </div>
      )}
    </div>
  );
}
