import { interfaces } from 'inversify-express-utils';
import User from '@features/user/entities/user.entity';
import container from '../../di/inversify.config';
import { ILogger } from '../../logger/logger.interface';
import TYPES from '../../types';

export default class AuthPrincipal implements interfaces.Principal<User> {
	public details: User;
	private readonly logger: ILogger;

	constructor(user: User) {
		this.details = user;
		this.logger = container.get<ILogger>(TYPES.Logger);
	}

	async isAuthenticated(): Promise<boolean> {
		return Promise.resolve(!!this.details);
	}

	async isResourceOwner(resourceId: unknown): Promise<boolean> {
		const isOwner = this.details.id === resourceId;

		this.logger.debug('isOwner', { isOwner });
		return Promise.resolve(isOwner);
	}

	async isInRole(role: string): Promise<boolean> {
		// ToDo: Fix me with proper role management logic
		// const isAllowed = [this.details?.role?.name].includes(role) || false;
		const isAllowed = [this.details?.firstName].includes(role) || false;
		this.logger.debug('isAllowed', { isAllowed });
		return Promise.resolve(isAllowed);
	}
}
