import { UserRole } from "./data/enums/user.enums";

export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	address: string;
	role: UserRole;
	createdBy?: string;
	updatedBy?: string;
}

export interface IUserRepository {
	create(user: Partial<IUser>): Promise<IUser>;
	findAll(): Promise<IUser[]>;
	findByIdOrFail(id: string): Promise<IUser>;

}

export interface IUserService {
	create(user: Partial<IUser>): Promise<IUser>;
	getAll(): Promise<IUser[]>;
	getByIdOrFail(id: string): Promise<IUser>;
}
