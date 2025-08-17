import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { IUser, IUserRepository, IUserService } from '../user.interfaces';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) { }

	async create(user: IUser): Promise<IUser> {
		return await this.userRepository.create(user);
	}

	async getAll(): Promise<IUser[]> {
		return await this.userRepository.findAll();

	}
	async getByIdOrFail(id: string): Promise<IUser> {
		return await this.userRepository.findByIdOrFail(id);
	}


}
