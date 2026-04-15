import { validationResult } from "express-validator";
import { sendError } from "../utils/response.utils.js";

/**
 * Runs after validation chains.
 * Collects errors and returns 422 if any exist.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return sendError(res, 422, "Validation failed", formatted);
  }
  next();
};
