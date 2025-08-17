import { interfaces } from 'inversify-express-utils';

export default class GuestPrincipal implements interfaces.Principal {
	public details = { role: 'guest' };

	async isAuthenticated(): Promise<boolean> {
		return false;
	}

	async isInRole(): Promise<boolean> {
		return false;
	}

	async isResourceOwner(): Promise<boolean> {
		return false;
	}
}
