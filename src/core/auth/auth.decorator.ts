import { NextFunction, Request, Response } from 'express';
import { httpDelete, httpGet, httpPatch, httpPost, httpPut, Middleware, withMiddleware } from 'inversify-express-utils';
import { AppResponse } from '../data/response/app.response';
import { getPrincipalFromContext } from './middleware-factory';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
type AuthRequirement = 'public' | 'authenticated' | 'authorized' | 'owner';

function createHttpDecorator(
	method: HttpMethod,
	path: string,
	authType: AuthRequirement,
	authOptions?: {
		roles?: string[];
		resourceIdExtractor?: (req: Request) => string;
		rateLimit?: number;
	},
	...middlewares: Middleware[]
) {
	const httpMethodDecorator = getHttpMethodDecorator(method);
	const authMiddleware = createAuthMiddleware(authType, authOptions);

	return function (target: any, key: string, descriptor: PropertyDescriptor) {
		withMiddleware(authMiddleware)(target, key);
		for (const middleware of middlewares) {
			withMiddleware(middleware)(target, key);
		}
		return httpMethodDecorator(path)(target, key, descriptor);
	};
}

function getHttpMethodDecorator(method: HttpMethod): (path: string) => any {
	switch (method) {
		case 'get':
			return httpGet;
		case 'post':
			return httpPost;
		case 'put':
			return httpPut;
		case 'delete':
			return httpDelete;
		case 'patch':
			return httpPatch;
		default:
			return httpGet;
	}
}

function createAuthMiddleware(
	authType: AuthRequirement,
	options?: {
		roles?: string[];
		resourceIdExtractor?: (req: Request) => string;
		rateLimit?: number;
	}
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		switch (authType) {
			case 'public':
				return next();

			case 'authenticated': {
				const principal = await getPrincipalFromContext(req);
				(req as any).principal = principal;
				const isAuthenticated = await principal.isAuthenticated();
				if (!isAuthenticated) {
					return res.status(401).json(AppResponse.error('UNAUTHORIZE', 'Unauthorized - Authentication required'));
				}
				return next();
			}

			case 'authorized': {
				const principal = await getPrincipalFromContext(req);
				(req as any).principal = principal;
				if (!options?.roles || options.roles.length === 0) {
					return res
						.status(500)
						.json(AppResponse.error('INTERNAL_SERVER_ERROR', 'Server configuration error - no roles specified'));
				}

				const isAuthenticated = await principal.isAuthenticated();
				if (!isAuthenticated) {
					return res.status(401).json(AppResponse.error('UNAUTHORIZE', 'Unauthorized - Authentication required'));
				}

				for (const role of options.roles) {
					const hasRole = await principal.isInRole(role);
					if (hasRole) {
						return next();
					}
				}

				return res.status(403).json(AppResponse.error('UNAUTHORIZE', 'Forbidden - Insufficient permissions'));
			}

			case 'owner': {
				const principal = await getPrincipalFromContext(req);
				(req as any).principal = principal;
				if (!options?.resourceIdExtractor) {
					return res
						.status(500)
						.json(AppResponse.error('INTERNAL_SERVER_ERROR', 'Server configuration error - no resource ID extractor'));
				}

				const isAuthenticated = await principal.isAuthenticated();
				if (!isAuthenticated) {
					return res.status(401).json(AppResponse.error('UNAUTHORIZE', 'Unauthorized - Authentication required'));
				}

				const resourceId = options.resourceIdExtractor(req);
				const isOwner = await principal.isResourceOwner(resourceId);

				if (!isOwner) {
					return res.status(403).json(AppResponse.error('UNAUTHORIZE', 'Forbidden - You do not own this resource'));
				}

				return next();
			}

			default:
				return next();
		}
	};
}

export const httpPublic = {
	get: (path: string, rateLimit?: number, ...middleware: Middleware[]) =>
		createHttpDecorator('get', path, 'public', { rateLimit }, ...middleware),
	post: (path: string, rateLimit?: number, ...middleware: Middleware[]) =>
		createHttpDecorator('post', path, 'public', { rateLimit }, ...middleware),
	put: (path: string, rateLimit?: number, ...middleware: Middleware[]) =>
		createHttpDecorator('put', path, 'public', { rateLimit }, ...middleware),
	delete: (path: string, rateLimit?: number, ...middleware: Middleware[]) =>
		createHttpDecorator('delete', path, 'public', { rateLimit }, ...middleware),
	patch: (path: string, rateLimit?: number, ...middleware: Middleware[]) =>
		createHttpDecorator('patch', path, 'public', { rateLimit }, ...middleware)
};

export const httpAuthenticated = {
	get: (path: string, ...middleware: Middleware[]) =>
		createHttpDecorator('get', path, 'authenticated', {}, ...middleware),
	post: (path: string, ...middleware: Middleware[]) =>
		createHttpDecorator('post', path, 'authenticated', {}, ...middleware),
	put: (path: string, ...middleware: Middleware[]) =>
		createHttpDecorator('put', path, 'authenticated', {}, ...middleware),
	delete: (path: string, ...middleware: Middleware[]) =>
		createHttpDecorator('delete', path, 'authenticated', {}, ...middleware),
	patch: (path: string, ...middleware: Middleware[]) =>
		createHttpDecorator('patch', path, 'authenticated', {}, ...middleware)
};

export const httpAuthorized = {
	get: (path: string, roles: string[], ...middleware: Middleware[]) =>
		createHttpDecorator('get', path, 'authorized', { roles }, ...middleware),
	post: (path: string, roles: string[], ...middleware: Middleware[]) =>
		createHttpDecorator('post', path, 'authorized', { roles }, ...middleware),
	put: (path: string, roles: string[], ...middleware: Middleware[]) =>
		createHttpDecorator('put', path, 'authorized', { roles }, ...middleware),
	delete: (path: string, roles: string[], ...middleware: Middleware[]) =>
		createHttpDecorator('delete', path, 'authorized', { roles }, ...middleware),
	patch: (path: string, roles: string[], ...middleware: Middleware[]) =>
		createHttpDecorator('patch', path, 'authorized', { roles }, ...middleware)
};

export const httpOwnerOnly = {
	get: (path: string, resourceIdExtractor: (req: Request) => string, ...middleware: Middleware[]) =>
		createHttpDecorator('get', path, 'owner', { resourceIdExtractor }, ...middleware),
	post: (path: string, resourceIdExtractor: (req: Request) => string, ...middleware: Middleware[]) =>
		createHttpDecorator('post', path, 'owner', { resourceIdExtractor }, ...middleware),
	put: (path: string, resourceIdExtractor: (req: Request) => string, ...middleware: Middleware[]) =>
		createHttpDecorator('put', path, 'owner', { resourceIdExtractor }, ...middleware),
	delete: (path: string, resourceIdExtractor: (req: Request) => string, ...middleware: Middleware[]) =>
		createHttpDecorator('delete', path, 'owner', { resourceIdExtractor }, ...middleware),
	patch: (path: string, resourceIdExtractor: (req: Request) => string, ...middleware: Middleware[]) =>
		createHttpDecorator('patch', path, 'owner', { resourceIdExtractor }, ...middleware)
};
