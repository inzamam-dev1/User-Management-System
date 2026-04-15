export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
};

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Role hierarchy — higher index = higher privilege
export const ROLE_HIERARCHY = [ROLES.USER, ROLES.MANAGER, ROLES.ADMIN];

export const PERMISSIONS = {
  // User management
  CREATE_USER: [ROLES.ADMIN],
  DELETE_USER: [ROLES.ADMIN],
  CHANGE_ROLE: [ROLES.ADMIN],
  VIEW_ALL_USERS: [ROLES.ADMIN, ROLES.MANAGER],
  UPDATE_ANY_USER: [ROLES.ADMIN, ROLES.MANAGER],

  // Self
  VIEW_OWN_PROFILE: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
  UPDATE_OWN_PROFILE: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER],
};
