import User from "../models/User.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.js";
import { STATUS } from "../config/constants.js";

/**
 * Registers a new user (self-registration as role=user).
 */
export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("An account with that email already exists.");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  const tokens = generateTokens(user);
  await saveRefreshToken(user, tokens.refreshToken);

  return { user: user.toPublicJSON(), ...tokens };
};

/**
 * Logs in a user with email + password.
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  if (user.status === STATUS.INACTIVE) {
    const err = new Error("Your account has been deactivated. Contact an administrator.");
    err.statusCode = 403;
    throw err;
  }

  const tokens = generateTokens(user);
  await saveRefreshToken(user, tokens.refreshToken);

  return { user: user.toPublicJSON(), ...tokens };
};

/**
 * Issues a new access token using a valid refresh token.
 */
export const refreshAccessToken = async (token) => {
  if (!token) {
    const err = new Error("Refresh token required.");
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    const err = new Error("Invalid or expired refresh token.");
    err.statusCode = 401;
    throw err;
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    const err = new Error("Refresh token reuse detected. Please log in again.");
    err.statusCode = 401;
    throw err;
  }

  const tokens = generateTokens(user);
  await saveRefreshToken(user, tokens.refreshToken);

  return tokens;
};

/**
 * Clears the refresh token on logout.
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// ── Helpers ───────────────────────────────────────────────

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const saveRefreshToken = async (user, refreshToken) => {
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
};
