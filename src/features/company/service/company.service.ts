import { inject, injectable } from 'inversify';
import TYPES from '@core/types';
import { ICompany, ICompanyRepository, ICompanyService } from '../company.interfaces';

@injectable()
export class CompanyService implements ICompanyService {
    constructor(
        @inject(TYPES.CompanyRepository) private companyRepository: ICompanyRepository
    ) { }

    async create(company: Partial<ICompany>): Promise<ICompany> {
        return await this.companyRepository.create(company);
    }

    async getAll(): Promise<ICompany[]> {
        return await this.companyRepository.findAll();
    }

    async getByIdOrFail(id: string): Promise<ICompany> {
        return await this.companyRepository.findByIdOrFail(id);
    }
}
