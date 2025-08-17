import { DatabaseService } from '@core/database/database.service';
import TYPES from '@core/types';
import { ContainerModule, interfaces } from 'inversify';
import { Repository } from 'typeorm';
import UserEntity from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './service/user.service';
import { UserController } from './user.controller';
import { IUserRepository, IUserService } from './user.interfaces';

const userModule = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<Repository<UserEntity>>(TYPES.UserModel).toDynamicValue((context: interfaces.Context) => {
		const database = context.container.get<DatabaseService>(TYPES.Database);
		return database.getDataSource().getRepository(UserEntity);
	});
});

export default userModule;
