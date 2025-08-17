import { AppResponse } from '@core/data/response/app.response';
import { ValidationError } from '@core/data/error/app.error';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function ValidateMiddleware(schema: AnyZodObject) {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const validatedData = await schema.parseAsync(req.body);
			req.body = validatedData;

			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errors = formatZodErrors(error);
				const response = AppResponse.errorFromException(new ValidationError('Validation failed', errors));
				res.status(400).json(response);
				return;
			}
			next(error);
		}
	};
}

export async function validate(data: any, schema: AnyZodObject) {
	try {
		const validatedData = await schema.parseAsync(data);
		return validatedData;
	} catch (error) {
		if (error instanceof ZodError) {
			const errors = formatZodErrors(error);
			throw new ValidationError('Validation failed', errors);
		}
	}
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
	const errors: Record<string, string[]> = {};

	error.errors.forEach(err => {
		const path = err.path.join('.');

		if (!errors[path]) {
			errors[path] = [];
		}

		errors[path].push(err.message);
	});

	return errors;
}
