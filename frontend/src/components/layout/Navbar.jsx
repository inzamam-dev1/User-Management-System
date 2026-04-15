import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header style={{
      height: 60,
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "0 12px" : "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        style={{
          background: "none", border: "none", fontSize: isMobile ? 18 : 20,
          cursor: "pointer", color: "var(--text-muted)",
          padding: "8px 12px", borderRadius: 6,
          minHeight: 44,
          minWidth: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Toggle sidebar"
      >
        ☰
      </button>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16 }}>
        {!isMobile && (
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Hello, <strong style={{ color: "var(--text)" }}>{user?.name}</strong>
          </span>
        )}

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: isMobile ? 2 : 6,
            padding: isMobile ? "7px 10px" : "7px 14px",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: isMobile ? 12 : 13,
            fontWeight: 500,
            color: "var(--text-muted)",
            cursor: "pointer",
            transition: "all 0.15s",
            minHeight: 44,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--danger)";
            e.currentTarget.style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          ↩ {!isMobile && "Logout"}
        </button>
      </div>
    </header>
  );
}
