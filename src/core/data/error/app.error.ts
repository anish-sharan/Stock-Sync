export class AppError extends Error {
	constructor(
		public statusCode: number,
		public code: string,
		message: string,
		public cause?: Record<string, string[]>,
		public isOperational = true
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

// Common error types
export class ValidationError extends AppError {
	constructor(message: string, cause: Record<string, string[]>) {
		super(400, 'VALIDATION_ERROR', message, cause);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string = 'Bad request') {
		super(400, 'BAD_REQUEST', message);
	}
}

export class AuthenticationError extends AppError {
	constructor(message: string = 'Authentication failed') {
		super(401, 'AUTHENTICATION_ERROR', message);
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Not authorized to perform this action') {
		super(403, 'AUTHORIZATION_ERROR', message);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(404, 'NOT_FOUND', message);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource already exists') {
		super(409, 'CONFLICT', message);
	}
}

export class DatabaseError extends AppError {
	constructor(message: string = 'Database operation failed') {
		super(500, 'DATABASE_ERROR', message);
	}
}

export class InternalServerError extends AppError {
	constructor(message: string = 'Internal server error') {
		super(500, 'INTERNAL_SERVER_ERROR', message);
	}
}

export class ExternalServiceError extends AppError {
	constructor(message: string = 'External service error') {
		super(502, 'EXTERNAL_SERVICE_ERROR', message);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(403, 'FORBIDDEN', message);
	}
}
