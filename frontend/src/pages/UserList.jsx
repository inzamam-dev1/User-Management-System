import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, createUser, deleteUser, deactivateUser } from "../api/user.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isAdmin, ROLES } from "../utils/roleUtils.js";
import { RoleBadge, StatusBadge } from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import Table from "../components/ui/Table.jsx";
import { formatDate } from "../utils/roleUtils.js";

const EMPTY_FORM = { name: "", email: "", password: "", role: ROLES.USER, status: "active", autoPassword: false };

export default function UserList() {
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", role: "", status: "", page: 1 });

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createErrors, setCreateErrors] = useState({});

  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", userId: null, userName: "" });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: 10 };
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const { data } = await getUsers(params);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => ({ ...f, page: 1 })), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!createForm.name.trim()) errs.name = "Name is required";
    if (!createForm.email.trim()) errs.email = "Email is required";
    if (!createForm.autoPassword && createForm.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (Object.keys(errs).length) { setCreateErrors(errs); return; }

    setCreateLoading(true);
    try {
      const payload = { ...createForm };
      if (createForm.autoPassword) delete payload.password;
      const { data } = await createUser(payload);
      toast.success(
        data.data.generatedPassword
          ? `User created! Temp password: ${data.data.generatedPassword}`
          : "User created successfully!"
      );
      setCreateOpen(false);
      setCreateForm(EMPTY_FORM);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    setActionLoading(true);
    try {
      if (confirmDialog.type === "delete") {
        await deleteUser(confirmDialog.userId);
        toast.success("User deleted");
      } else if (confirmDialog.type === "deactivate") {
        await deactivateUser(confirmDialog.userId);
        toast.success("User deactivated");
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, type: "", userId: null, userName: "" });
    }
  };

  const setFilter = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value, page: 1 }));

  const setForm = (key) => (e) =>
    setCreateForm((f) => ({ ...f, [key]: e.target.value }));

  const columns = [
    {
      key: "name", label: "User",
      render: (u) => (
        <div>
          <div style={{ fontWeight: 500 }}>{u.name}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email}</div>
        </div>
      ),
    },
    { key: "role", label: "Role", render: (u) => <RoleBadge role={u.role} /> },
    { key: "status", label: "Status", render: (u) => <StatusBadge status={u.status} /> },
    {
      key: "createdAt", label: "Created",
      render: (u) => (
        <div>
          <div style={{ fontSize: 12 }}>{formatDate(u.createdAt)}</div>
          {u.createdBy && (
            <div style={{ fontSize: 11, color: "var(--text-light)" }}>
              by {u.createdBy?.name || "system"}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions", label: "Actions",
      render: (u) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Button size="sm" variant="secondary" onClick={() => navigate(`/users/${u._id}`)}>
            View
          </Button>
          {isAdmin(me) && u.status === "active" && u.role !== ROLES.ADMIN && (
            <Button
              size="sm" variant="ghost"
              onClick={() => setConfirmDialog({ open: true, type: "deactivate", userId: u._id, userName: u.name })}
            >
              Deactivate
            </Button>
          )}
          {isAdmin(me) && (
            <Button
              size="sm" variant="danger"
              onClick={() => setConfirmDialog({ open: true, type: "delete", userId: u._id, userName: u.name })}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        marginBottom: 24,
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 12 : 0,
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, marginBottom: 2 }}>Users</h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {pagination.total} total users
          </p>
        </div>
        {isAdmin(me) && (
          <Button onClick={() => setCreateOpen(true)} size={isMobile ? "md" : "md"}>+ Create User</Button>
        )}
      </div>

      {/* Filters */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr auto auto auto",
        gap: isMobile ? 8 : 12,
        marginBottom: 20,
        background: "var(--surface)",
        padding: isMobile ? "12px 14px" : "16px 20px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
      }}>
        <input
          placeholder="Search name or email…"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          style={{
            padding: "8px 13px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 14,
            outline: "none",
            minHeight: 40,
          }}
        />
        <select
          value={filters.role}
          onChange={setFilter("role")}
          style={{
            padding: "8px 13px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 14,
            background: "var(--surface)",
            minHeight: 40,
            cursor: "pointer",
          }}
        >
          <option value="">All roles</option>
          {Object.values(ROLES).map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={setFilter("status")}
          style={{
            padding: "8px 13px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 14,
            background: "var(--surface)",
            minHeight: 40,
            cursor: "pointer",
          }}
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(filters.search || filters.role || filters.status) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ search: "", role: "", status: "", page: 1 })}
            style={{ gridColumn: isMobile ? "1" : "auto" }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <Table columns={columns} data={users} loading={loading} emptyText="No users match your filters." />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <Button
            variant="secondary" size="sm"
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
          >← Prev</Button>
          <span style={{ padding: "7px 14px", fontSize: 13, color: "var(--text-muted)" }}>
            Page {filters.page} of {pagination.totalPages}
          </span>
          <Button
            variant="secondary" size="sm"
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
          >Next →</Button>
        </div>
      )}

      {/* Create User Modal */}
      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); setCreateErrors({}); }} title="Create New User" maxWidth={480}>
        <form onSubmit={handleCreateSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Full name" value={createForm.name} onChange={setForm("name")} error={createErrors.name} placeholder="Jane Doe" />
          <Input label="Email address" type="email" value={createForm.email} onChange={setForm("email")} error={createErrors.email} placeholder="jane@example.com" />

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Role</label>
              <select value={createForm.role} onChange={setForm("role")}
                style={{ padding: "9px 13px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 14 }}>
                {Object.values(ROLES).map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>Status</label>
              <select value={createForm.status} onChange={setForm("status")}
                style={{ padding: "9px 13px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 14 }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
              <input type="checkbox" checked={createForm.autoPassword}
                onChange={(e) => setCreateForm((f) => ({ ...f, autoPassword: e.target.checked, password: "" }))} />
              Auto-generate password
            </label>
          </div>

          {!createForm.autoPassword && (
            <Input
              label="Password"
              type="password"
              value={createForm.password}
              onChange={setForm("password")}
              error={createErrors.password}
              placeholder="Min. 6 characters"
            />
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" loading={createLoading}>Create User</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: "", userId: null, userName: "" })}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={confirmDialog.type === "delete" ? "Delete User" : "Deactivate User"}
        message={
          confirmDialog.type === "delete"
            ? `Permanently delete "${confirmDialog.userName}"? This cannot be undone.`
            : `Deactivate "${confirmDialog.userName}"? They won't be able to log in.`
        }
        confirmLabel={confirmDialog.type === "delete" ? "Delete" : "Deactivate"}
      />
    </div>
  );
}
