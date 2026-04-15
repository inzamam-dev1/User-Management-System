import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
  };

  const padding = isMobile ? 20 : 40;
  const paddingH = isMobile ? 20 : 36;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0effe 0%, #e8f4ff 100%)",
      padding: 16,
    }}>
      <div style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        padding: `${padding}px ${paddingH}px`,
        width: "100%",
        maxWidth: 420,
        boxShadow: "var(--shadow-md)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 32 }}>
          <div style={{
            width: isMobile ? 44 : 52, height: isMobile ? 44 : 52,
            background: "var(--primary)",
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
            color: "#fff", fontWeight: 700, fontSize: isMobile ? 18 : 22,
          }}>U</div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, marginBottom: 4 }}>
            User Management System
          </h1>
          <p style={{ fontSize: isMobile ? 12 : 13, color: "var(--text-muted)" }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Input
            label="Email address"
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            error={errors.email}
            autoFocus
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            error={errors.password}
          />

          <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 4, minHeight: 44 }}>
            Sign in
          </Button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: isMobile ? 20 : 24,
          padding: isMobile ? "12px 14px" : "14px 16px",
          background: "var(--surface-2)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
        }}>
          <p style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
            DEMO CREDENTIALS
          </p>
          {[
            { role: "Admin", email: "admin@ums.com", pwd: "Admin@1234" },
            { role: "Manager", email: "manager@ums.com", pwd: "Manager@1234" },
            { role: "User", email: "user@ums.com", pwd: "User@1234" },
          ].map((c) => (
            <div
              key={c.role}
              onClick={() => setForm({ email: c.email, password: c.pwd })}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: isMobile ? 11 : 12,
                color: "var(--text-muted)",
                padding: "3px 0",
                cursor: "pointer",
                overflow: "hidden",
              }}
              title="Click to fill"
            >
              <strong style={{ color: "var(--primary)" }}>{c.role}</strong>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: isMobile ? 10 : 12 }}>
                {c.email}
              </span>
            </div>
          ))}
          <p style={{ fontSize: isMobile ? 10 : 11, color: "var(--text-light)", marginTop: 6 }}>
            Click to fill
          </p>
        </div>
      </div>
    </div>
  );
}
