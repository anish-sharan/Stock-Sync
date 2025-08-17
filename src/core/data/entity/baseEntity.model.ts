import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ nullable: false, default: true })
	active: boolean = true;

	@CreateDateColumn()
	createdDate!: Date;

	@UpdateDateColumn()
	updatedDate!: Date;

	@Column({ type: 'uuid', nullable: true })
	createdBy?: string;

	@Column({ type: 'uuid', nullable: true })
	updatedBy?: string;
}
