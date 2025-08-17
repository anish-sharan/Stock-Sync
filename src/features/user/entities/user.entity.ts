import { BaseEntity } from '@core/data/entity/baseEntity.model';
import { Entity, Column } from 'typeorm';
import { UserRole } from '@features/user/data/enums/user.enums';
import { IUser } from '@features/user/user.interfaces';

@Entity('users')
export default class UserEntity extends BaseEntity implements IUser {
	@Column({ type: 'varchar', length: 50, nullable: true })
	firstName!: string;

	@Column({ type: 'varchar', length: 50, nullable: true })
	lastName!: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	address!: string;

	@Column({ type: 'enum', enum: UserRole, nullable: false })
	role!: UserRole;
}
