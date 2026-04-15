export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

export const ROLE_LABELS = {
  admin: "Admin",
  manager: "Manager",
  user: "User",
};

export const ROLE_COLORS = {
  admin: { bg: "#ede9ff", color: "#5a52e0" },
  manager: { bg: "#dbeafe", color: "#1d4ed8" },
  user: { bg: "#d1fae5", color: "#065f46" },
};

export const STATUS_COLORS = {
  active: { bg: "#d1fae5", color: "#065f46" },
  inactive: { bg: "#fee2e2", color: "#991b1b" },
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isManager = (user) => user?.role === ROLES.MANAGER;
export const isAdminOrManager = (user) =>
  user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

export const canManageUser = (actor, target) => {
  if (!actor || !target) return false;
  if (actor.role === ROLES.ADMIN) return true;
  if (actor.role === ROLES.MANAGER && target.role !== ROLES.ADMIN) return true;
  return false;
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};
