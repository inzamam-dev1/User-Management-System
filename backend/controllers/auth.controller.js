import * as authService from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.utils.js";

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, 201, "Account created successfully.", result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, 200, "Login successful.", result);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    return sendSuccess(res, 200, "Token refreshed.", tokens);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    return sendSuccess(res, 200, "Logged out successfully.");
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  return sendSuccess(res, 200, "Profile fetched.", req.user.toPublicJSON());
};
