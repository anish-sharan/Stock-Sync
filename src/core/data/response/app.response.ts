interface ErrorResponse {
	code: string;
	message: string;
}

export class AppResponse<T> {
	data: T | null;
	status: 'success' | 'error';
	error: ErrorResponse | null;

	private constructor(data: T | null, status: 'success' | 'error', error: ErrorResponse | null) {
		if (!data && !error) {
			throw new Error('Internal Server Error');
		}

		this.data = data;
		this.status = status;
		this.error = error;
	}

	static success<T>(data: T): AppResponse<T> {
		return new AppResponse(data, 'success', null);
	}

	static error(code: string, message: string): AppResponse<null> {
		return new AppResponse(null, 'error', { code, message });
	}

	static errorFromException(err: any): AppResponse<null> {
		const errorCode = (err as any).code || 'INTERNAL_SERVER_ERROR';
		let errorMessage = err.message || 'Internal Server Error';

		if (errorCode === 'VALIDATION_ERROR' && err.cause) {
			errorMessage = err.cause;
		}

		return new AppResponse(null, 'error', { code: errorCode, message: errorMessage });
	}
}
