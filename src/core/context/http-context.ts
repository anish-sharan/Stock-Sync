import { Request, Response } from 'express';
import { interfaces } from 'inversify-express-utils';
import User from '@features/user/entities/user.entity';

export interface IHttpContextAccessor {
	getHttpContext(): interfaces.HttpContext | undefined;
	getRequest(): Request | undefined;
	getResponse(): Response | undefined;
	getUser(): User | undefined;
	getUserId(): string | undefined;
}
