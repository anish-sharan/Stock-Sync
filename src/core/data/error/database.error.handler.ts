import { QueryFailedError } from 'typeorm';
import { BadRequestError, ConflictError, DatabaseError } from './app.error';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import container from '@core/di/inversify.config';

/**
 * Handles database errors and converts them into application-specific errors
 * @param error The error thrown by TypeORM
 * @returns A properly formatted application error
 */
export function handleDatabaseError(error: unknown): Error {
	const logger = container.get<ILogger>(TYPES.Logger);

	// Handle TypeORM's QueryFailedError
	if (error instanceof QueryFailedError) {
		const { driverError } = error;
		logger.debug('Database error details', {
			errorCode: driverError?.code,
			detail: driverError?.detail,
			message: error.message
		});

		// PostgreSQL unique constraint violation
		if (driverError && driverError.code === '23505') {
			// First try to extract from detail message
			const detailMatch = driverError.detail?.match(/Key \((.*?)\)=\((.*?)\) already exists/);
			logger.debug('Error message', { message: detailMatch });
			if (detailMatch) {
				const [, field, value] = detailMatch;
				return new BadRequestError(`${field} '${value}' is already in use`);
			}

			// If we can't extract from detail, try to determine from the error message
			// This approach doesn't rely on specific constraint names which can vary across databases

			// Check for common field patterns in the constraint name or error message
			const errorMsg = error.message.toLowerCase();
			logger.debug('Error message', { message: errorMsg });

			// Try to identify the field from the error message
			const fieldPatterns = [
				{ pattern: /email/i, field: 'email' },
				{ pattern: /phone/i, field: 'phone number' },
				{ pattern: /username/i, field: 'username' },
				{ pattern: /external.*id/i, field: 'external ID' }
				// Add more patterns as needed
			];

			for (const { pattern, field } of fieldPatterns) {
				if (pattern.test(errorMsg) || (driverError.detail && pattern.test(driverError.detail))) {
					return new BadRequestError(`This ${field} is already in use`);
				}
			}

			// If we can't determine the specific field, log the constraint for future reference
			const constraintMatch = error.message.match(/"([^"]+)"/);
			if (constraintMatch) {
				const constraintName = constraintMatch[1];
				logger.debug(`Unhandled constraint violation: ${constraintName}`);
			}

			return new ConflictError('A record with these details already exists');
		}

		// Foreign key constraint violation
		if (driverError && driverError.code === '23503') {
			return new BadRequestError('Referenced record does not exist');
		}

		// Check constraint violation
		if (driverError && driverError.code === '23514') {
			return new BadRequestError('Data validation failed');
		}
	}

	// If it's already an application error, just return it
	if (error instanceof Error) {
		return error;
	}

	// Default case: wrap in a generic database error
	return new DatabaseError('An unexpected database error occurred');
}
