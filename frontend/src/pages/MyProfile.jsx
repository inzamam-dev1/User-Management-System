import { useState } from "react";
import toast from "react-hot-toast";
import { updateMyProfile } from "../api/user.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { RoleBadge, StatusBadge } from "../components/ui/Badge.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { formatDate } from "../utils/roleUtils.js";

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.password && form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password && form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      const { data } = await updateMyProfile(payload);
      updateUser(data.data);
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const InfoRow = ({ label, value }) => (
    <div style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ width: 140, fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14 }}>{value}</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Manage your personal information</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900 }}>
        {/* Read-only info */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)", padding: "20px 24px",
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 4 }}>
            ACCOUNT DETAILS
          </h2>
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Role" value={<RoleBadge role={user?.role} />} />
          <InfoRow label="Status" value={<StatusBadge status={user?.status} />} />
          <InfoRow label="Member since" value={formatDate(user?.createdAt)} />

          <div style={{
            marginTop: 16, padding: "12px 14px",
            background: "var(--info-light)", borderRadius: "var(--radius)",
            fontSize: 12, color: "var(--info)",
          }}>
            ℹ Your email and role can only be changed by an administrator.
          </div>
        </div>

        {/* Edit form */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)", padding: "20px 24px",
        }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 16 }}>
            EDIT PROFILE
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Full name"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              placeholder="Your name"
            />

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
                Leave blank to keep your current password
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Input
                  label="New password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  placeholder="Min. 6 characters"
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={errors.confirmPassword}
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} style={{ marginTop: 4 }}>
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
