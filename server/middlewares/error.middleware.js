export class AppError extends Error {
    constructor(
        message,
        statusCode,
        isOperational,
        details
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details
        Error.captureStackTrace(this);
    }
}

// Not Found Error
export class NotFoundError extends AppError {
    constructor(message = "Resources not found") {
        super(message, 404);
    }
}

// Validation Error
export class ValidationError extends AppError {
    constructor(message = "Invalid request data") {
        super(message, 400, true);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

// Forbidden Error (Insufficient Permissions)
export class ForbiddenError extends AppError {
    constructor(message = "Forbidden Access") {
        super(message, 403);
    }
}

// Database Error
export class DatabaseError extends AppError {
    constructor(message = "Database Error") {
        super(message, 500, true);
    }
}

// Rate Limit Error
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later") {
        super(message, 429);
    }
}

export const errorMiddleware = (
    err, req, res, next
) => {
    if (err instanceof AppError) {
        console.log(`Error ${req.method} ${req.url} - ${err.message}`);

        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    console.log("Unhandled Error:", err);

    return res.status(500).json({ error: "" });
};

export default errorMiddleware