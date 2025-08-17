import { NotFoundError } from '@core/data/error/app.error';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import CompanyEntity from '@features/company/entities/company.entity';
import { ICompany, ICompanyRepository } from '../company.interfaces';

@injectable()
export class CompanyRepository implements ICompanyRepository {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CompanyModel) private repository: Repository<CompanyEntity>
    ) { }

    async create(company: Partial<ICompany>): Promise<ICompany> {
        this.logger.info('Company created');

        const entity = this.repository.create(company);
        return await this.repository.save(entity);
    }

    async findAll(): Promise<ICompany[]> {
        this.logger.info('Fetching all companies');
        return this.repository.find();
    }

    async findByIdOrFail(id: string): Promise<ICompany> {
        this.logger.info('Fetching company by id', { id });

        const company = await this.repository.findOne({ where: { id } });
        if (!company) {
            throw new NotFoundError('Company not found');
        }
        return company;
    }
}
