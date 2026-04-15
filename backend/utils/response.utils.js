/**
 * Sends a standardized success response.
 */
export const sendSuccess = (res, statusCode = 200, message = "Success", data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 */
export const sendError = (res, statusCode = 500, message = "Something went wrong", errors = null) => {
  const response = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
};

/**
 * Sends a paginated list response.
 */
export const sendPaginated = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    message: "Data retrieved successfully",
    data,
    pagination,
  });
};
