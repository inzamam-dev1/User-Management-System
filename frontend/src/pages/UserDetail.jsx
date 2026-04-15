import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUser, updateUser, deleteUser, deactivateUser } from "../api/user.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isAdmin, canManageUser, ROLES, formatDate } from "../utils/roleUtils.js";
import { RoleBadge, StatusBadge } from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "" });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await getUser(id);
      setUser(data.data);
      setEditForm({
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        status: data.data.status,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "User not found");
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { data } = await updateUser(id, editForm);
      setUser(data.data);
      setEditOpen(false);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    try {
      if (confirmDialog.type === "delete") {
        await deleteUser(id);
        toast.success("User deleted");
        navigate("/users");
      } else if (confirmDialog.type === "deactivate") {
        const { data } = await deactivateUser(id);
        setUser(data.data);
        toast.success("User deactivated");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, type: "" });
    }
  };

  const setF = (k) => (e) => setEditForm((f) => ({ ...f, [k]: e.target.value }));

  if (loading) return <Spinner fullscreen />;
  if (!user) return null;

  const canEdit = canManageUser(me, user);

  const InfoRow = ({ label, value }) => (
    <div style={{
      display: "flex", alignItems: "flex-start",
      padding: "12px 0", borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ width: 160, fontSize: 13, color: "var(--text-muted)", fontWeight: 500, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: "var(--text)" }}>{value}</span>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/users")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18 }}>
            ←
          </button>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>{user.name}</h1>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{user.email}</p>
          </div>
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>Edit</Button>
            {isAdmin(me) && user.status === "active" && user.role !== ROLES.ADMIN && (
              <Button variant="ghost" size="sm" onClick={() => setConfirmDialog({ open: true, type: "deactivate" })}>
                Deactivate
              </Button>
            )}
            {isAdmin(me) && (
              <Button variant="danger" size="sm" onClick={() => setConfirmDialog({ open: true, type: "delete" })}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Profile info */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)", padding: "20px 24px",
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--text-muted)" }}>
            PROFILE
          </h2>
          <InfoRow label="Full name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={<RoleBadge role={user.role} />} />
          <InfoRow label="Status" value={<StatusBadge status={user.status} />} />
        </div>

        {/* Audit info */}
        <div style={{
          background: "var(--surface)", borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)", padding: "20px 24px",
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--text-muted)" }}>
            AUDIT TRAIL
          </h2>
          <InfoRow label="Created at" value={formatDate(user.createdAt)} />
          <InfoRow
            label="Created by"
            value={user.createdBy ? `${user.createdBy.name} (${user.createdBy.email})` : "Self-registered"}
          />
          <InfoRow label="Last updated" value={formatDate(user.updatedAt)} />
          <InfoRow
            label="Updated by"
            value={user.updatedBy ? `${user.updatedBy.name} (${user.updatedBy.email})` : "—"}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit User" maxWidth={460}>
        <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full name" value={editForm.name || ""} onChange={setF("name")} />
          <Input label="Email" type="email" value={editForm.email || ""} onChange={setF("email")} />

          {isAdmin(me) && (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Role</label>
                <select value={editForm.role} onChange={setF("role")}
                  style={{ padding: "9px 13px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 14 }}>
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Status</label>
                <select value={editForm.status} onChange={setF("status")}
                  style={{ padding: "9px 13px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 14 }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" loading={editLoading}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: "" })}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmDialog.type === "delete" ? "Delete User" : "Deactivate User"}
        message={
          confirmDialog.type === "delete"
            ? `Permanently delete "${user.name}"? This cannot be undone.`
            : `Deactivate "${user.name}"? They won't be able to log in until reactivated.`
        }
        confirmLabel={confirmDialog.type === "delete" ? "Delete" : "Deactivate"}
      />
    </div>
  );
}
