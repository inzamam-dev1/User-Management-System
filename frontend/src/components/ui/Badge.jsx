import { ROLE_COLORS, STATUS_COLORS, ROLE_LABELS } from "../../utils/roleUtils.js";

export function RoleBadge({ role }) {
  const colors = ROLE_COLORS[role] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      background: colors.bg,
      color: colors.color,
    }}>
      {ROLE_LABELS[role] || role}
    </span>
  );
}

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.02em",
      background: colors.bg,
      color: colors.color,
    }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
