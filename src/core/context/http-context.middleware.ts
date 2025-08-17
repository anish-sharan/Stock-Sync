import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import TYPES from '../types';
import { AsyncLocalStorage } from 'async_hooks';
import { interfaces } from 'inversify-express-utils';
import { METADATA_KEY } from 'inversify-express-utils';
import 'reflect-metadata';

@injectable()
export class HttpContextMiddleware extends BaseMiddleware {
	@inject(TYPES.HttpContextStorage)
	private readonly _httpContextStorage!: AsyncLocalStorage<interfaces.HttpContext>;

	public handler(req: Request, res: Response, next: NextFunction): void {
		const httpContext = Reflect.getMetadata(METADATA_KEY.httpContext, req);

		if (httpContext) {
			this._httpContextStorage.run(httpContext, () => {
				next();
			});
		} else {
			next();
		}
	}
}
