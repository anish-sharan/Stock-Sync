import { BaseEntity } from '@core/data/entity/baseEntity.model';
import { Entity, Column } from 'typeorm';
import { ICompany } from '../company.interfaces';
import { CompanyStatus } from '../data/enum/company.enum';

@Entity('companies')
export default class CompanyEntity extends BaseEntity implements ICompany {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
    registrationNumber!: string;

    @Column({ type: 'enum', enum: CompanyStatus, nullable: false })
    status!: CompanyStatus;
}
