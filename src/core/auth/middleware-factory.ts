import { DatabaseService } from '@core/database/database.service';
import { Request } from 'express';
import { interfaces, TYPE } from 'inversify-express-utils';
import User from '@features/user/entities/user.entity';
import container from '../di/inversify.config';
import { ILogger } from '../logger/logger.interface';
import TYPES from '../types';
import AuthPrincipal from './principal/auth.principal';
import GuestPrincipal from './principal/guest.principal';
import { TokenResolver } from './token-resolver';

export async function getPrincipal(req: Request): Promise<interfaces.Principal> {
	try {
		const authHeader = req.headers.authorization || '';
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return new GuestPrincipal();
		}

		const token = authHeader.replace('Bearer ', '');
		const tokenResolver = container.get<TokenResolver>(TYPES.CognitoTokenResolver);
		const externalId = await tokenResolver.getExternalId(token);
		const database = container.get<DatabaseService>(TYPES.Database);
		const userRepository = database.getDataSource().getRepository(User);
		const currentUser = await userRepository.findOne({
			where: { externalId, active: true },
			relations: { company: { owner: true } }
			// ToDo: fix this once role is implemented
			//relations: { role: true },
		});
		if (!currentUser) {
			return new GuestPrincipal();
		}
		return new AuthPrincipal(currentUser);
	} catch (error: any) {
		const logger = container.get<ILogger>(TYPES.Logger);
		logger.error('Error extracting principal:', error);
		return new GuestPrincipal();
	}
}

export async function getPrincipalFromContext(req: Request): Promise<interfaces.Principal> {
	try {
		//ToDo: To fix injecting existing httpContext, and remove getPrincipal ussage
		const httpContext = container.get<interfaces.HttpContext>(TYPE.HttpContext);
		if (httpContext && httpContext.user) {
			return httpContext.user;
		}
		return getPrincipal(req);
	} catch (error: any) {
		const logger = container.get<ILogger>(TYPES.Logger);
		logger.error('Error getting principal from context:', error);
		return new GuestPrincipal();
	}
}
