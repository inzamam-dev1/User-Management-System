import { sendError } from "../utils/response.utils.js";

/**
 * Role-based access control middleware.
 * Usage: authorize("admin", "manager")
 *
 * Must be used after `protect` so req.user is available.
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Authentication required.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. This action requires one of the following roles: ${allowedRoles.join(", ")}.`
      );
    }

    next();
  };
};

/**
 * Allows access only to the resource owner OR specified roles.
 * Usage: authorizeOwnerOrRoles("admin", "manager")
 *
 * Checks req.params.id against req.user._id for ownership.
 */
export const authorizeOwnerOrRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Authentication required.");
    }

    const isOwner = req.user._id.toString() === req.params.id;
    const hasRole = allowedRoles.includes(req.user.role);

    if (!isOwner && !hasRole) {
      return sendError(res, 403, "Access denied. You can only access your own profile.");
    }

    next();
  };
};
