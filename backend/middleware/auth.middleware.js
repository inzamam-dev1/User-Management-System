import { verifyAccessToken } from "../utils/jwt.utils.js";
import { sendError } from "../utils/response.utils.js";
import User from "../models/User.model.js";
import { STATUS } from "../config/constants.js";

/**
 * Protects routes — verifies the Bearer token and attaches req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Authentication required. Please log in.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    // Fetch fresh user to catch deactivated accounts
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return sendError(res, 401, "User no longer exists.");
    }

    if (user.status === STATUS.INACTIVE) {
      return sendError(res, 403, "Your account has been deactivated. Contact an administrator.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Session expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token. Please log in again.");
    }
    next(error);
  }
};
