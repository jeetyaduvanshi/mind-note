export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message
    };

    if (data) {
        response.data = data;
    }

    res.status(statusCode).json(response);
};

export const sendError = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

export const sendSuccess = (res, message, data = null, statusCode = 200) => {
    sendResponse(res, statusCode, true, message, data);
};

// Pagination helper
export const getPagination = (page, limit) => {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    return {
        page: pageNum,
        limit: limitNum,
        skip
    };
};

// Search helper
export const buildSearchQuery = (searchTerm, fields = []) => {
    if (!searchTerm) return {};

    const searchRegex = new RegExp(searchTerm, 'i');

    if (fields.length === 0) {
        return { $text: { $search: searchTerm } };
    }

    return {
        $or: fields.map(field => ({
            [field]: searchRegex
        }))
    };
};
