import * as userService from "../services/user.service.js";
import { sendSuccess, sendPaginated } from "../utils/response.utils.js";

export const getUsers = async (req, res, next) => {
  try {
    const { page, limit, role, status, search } = req.query;
    const result = await userService.getAllUsers({ page, limit, role, status, search });
    return sendPaginated(res, result.users, result.pagination);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched.", user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user._id);
    return sendSuccess(res, 201, "User created successfully.", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );
    return sendSuccess(res, 200, "User updated successfully.", user);
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateOwnProfile(
      req.user._id,
      req.body,
      req.user._id
    );
    return sendSuccess(res, 200, "Profile updated successfully.", user);
  } catch (err) {
    next(err);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(req.params.id, req.user._id);
    return sendSuccess(res, 200, "User deactivated.", user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user._id);
    return sendSuccess(res, 200, "User deleted permanently.");
  } catch (err) {
    next(err);
  }
};
