import { body } from "express-validator";
import { ROLES, STATUS } from "../config/constants.js";

export const createUserValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(", ")}`),

  body("status")
    .optional()
    .isIn(Object.values(STATUS)).withMessage(`Status must be one of: ${Object.values(STATUS).join(", ")}`),

  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("role")
    .optional()
    .isIn(Object.values(ROLES)).withMessage(`Role must be one of: ${Object.values(ROLES).join(", ")}`),

  body("status")
    .optional()
    .isIn(Object.values(STATUS)).withMessage(`Status must be one of: ${Object.values(STATUS).join(", ")}`),
];

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be 2–50 characters"),

  body("password")
    .optional()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("role")
    .not().exists().withMessage("You cannot change your own role."),
];
