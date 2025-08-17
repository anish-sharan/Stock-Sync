import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { AppResponse } from '../data/response/app.response';
import { handleDatabaseError } from '../data/error/database.error.handler';
import { ILogger } from '../logger/logger.interface';
import TYPES from '../types';
import { QueryFailedError } from 'typeorm';

@injectable()
export class ErrorHandlerMiddleware {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handle(err: Error, req: Request, res: Response, _next: NextFunction): void {
		// Handle database errors specifically
		if (err instanceof QueryFailedError) {
			const handledError = handleDatabaseError(err);
			const statusCode = (handledError as any).statusCode || 500;
			const errorCode = (handledError as any).code || 'DATABASE_ERROR';
			const errorMessage = handledError.message || 'Database Error';

			this.logger.error(`Database Error: ${errorMessage}`, err);
			res.status(statusCode).json(AppResponse.error(errorCode, errorMessage));
			return;
		}

		// Handle other errors
		const statusCode = (err as any).statusCode || 500;
		const errorCode = (err as any).code || 'INTERNAL_SERVER_ERROR';
		const errorMessage = err.message || 'Internal Server Error';

		this.logger.error(`Error: ${errorMessage}`, err);
		res.status(statusCode).json(AppResponse.error(errorCode, errorMessage));
	}
}
