import { NotFoundError } from '@core/data/error/app.error';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import UserEntity from '@features/user/entities/user.entity';
import { IUserRepository, IUser } from '../user.interfaces';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.UserModel) private repository: Repository<UserEntity>
	) { }

	async create(user: Partial<IUser>): Promise<IUser> {
		this.logger.info('User created');

		const entity = this.repository.create(user);
		return await this.repository.save(entity);
	}

	async findAll(): Promise<IUser[]> {
		this.logger.info('Fetching all users');

		return await this.repository.find();
	}

	async findByIdOrFail(id: string): Promise<IUser> {
		this.logger.info('Fetching user by id', { id });

		const user = await this.repository.findOne({ where: { id } });
		if (!user) {
			throw new NotFoundError('User not found');
		}
		return user;
	}
}
