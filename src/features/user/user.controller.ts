import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost, queryParam, requestBody, requestParam } from 'inversify-express-utils';
import { IUserService } from './user.interfaces';
import { ValidateMiddleware } from '@core/middleware/validate.middleware';
import { AppResponse } from '@core/data/response/app.response';
import { createUserDto, ICreateUser } from './data/request/createUser.dto';

@controller('/api/users')
export class UserController extends BaseHttpController {
	constructor(
		@inject(TYPES.UserService) private userService: IUserService
	) {
		super();
	}

	@httpPost('/register', ValidateMiddleware(createUserDto))
	async registerUser(@requestBody() body: ICreateUser) {
		const user = await this.userService.create(body);
		return this.ok(AppResponse.success(user));
	}

	@httpGet('/')
	async getAllUsers() {
		const users = await this.userService.getAll();
		return this.ok(AppResponse.success(users));
	}

	@httpGet('/:id')
	async getUserById(@requestParam('id') id: string) {
		const user = await this.userService.getByIdOrFail(id);
		return this.ok(AppResponse.success(user));
	}
}
