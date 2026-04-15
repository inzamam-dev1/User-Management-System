import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize, authorizeOwnerOrRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
} from "../validators/user.validator.js";
import { ROLES } from "../config/constants.js";

const router = Router();

// All routes require authentication
router.use(protect);

// ── Self ──────────────────────────────────────────────────
router.patch(
  "/me",
  updateProfileValidator,
  validate,
  userController.updateMyProfile
);

// ── Admin / Manager: list + view ─────────────────────────
router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  userController.getUsers
);

// ── Admin only: create ────────────────────────────────────
router.post(
  "/",
  authorize(ROLES.ADMIN),
  createUserValidator,
  validate,
  userController.createUser
);

// ── Single user ───────────────────────────────────────────
router.get(
  "/:id",
  authorizeOwnerOrRoles(ROLES.ADMIN, ROLES.MANAGER),
  userController.getUser
);

router.patch(
  "/:id",
  authorizeOwnerOrRoles(ROLES.ADMIN, ROLES.MANAGER),
  updateUserValidator,
  validate,
  userController.updateUser
);

// ── Admin only: deactivate + delete ──────────────────────
router.patch(
  "/:id/deactivate",
  authorize(ROLES.ADMIN),
  userController.deactivateUser
);

router.delete(
  "/:id",
  authorize(ROLES.ADMIN),
  userController.deleteUser
);

export default router;
