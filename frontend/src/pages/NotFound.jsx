import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontSize: 64, fontWeight: 700, color: "var(--primary)" }}>404</div>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Page not found</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
        The page you're looking for doesn't exist or you don't have access.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 24px", background: "var(--primary)", color: "#fff",
          border: "none", borderRadius: "var(--radius)", fontSize: 14,
          fontWeight: 500, cursor: "pointer",
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
