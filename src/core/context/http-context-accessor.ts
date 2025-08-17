import { inject, injectable } from 'inversify';
import { IHttpContextAccessor } from './http-context';
import { interfaces } from 'inversify-express-utils';
import User from '@features/user/entities/user.entity';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import TYPES from '../types';

@injectable()
export class HttpContextAccessor implements IHttpContextAccessor {
	constructor(@inject(TYPES.HttpContextStorage) private readonly storage: AsyncLocalStorage<interfaces.HttpContext>) {}

	getHttpContext(): interfaces.HttpContext | undefined {
		return this.storage.getStore();
	}

	getRequest(): Request | undefined {
		const context = this.getHttpContext();
		return context?.request;
	}

	getResponse(): Response | undefined {
		const context = this.getHttpContext();
		return context?.response;
	}

	getUser(): User | undefined {
		const context = this.getHttpContext();
		const user = context?.user?.details;
		if (!user) {
			return undefined;
		}
		return user as User;
	}

	getUserId(): string | undefined {
		const user = this.getUser();
		return user?.id;
	}
}
