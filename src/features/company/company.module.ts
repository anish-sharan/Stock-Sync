import { DatabaseService } from '@core/database/database.service';
import TYPES from '@core/types';
import { ContainerModule, interfaces } from 'inversify';
import { Repository } from 'typeorm';
import CompanyEntity from './entities/company.entity';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyService } from './service/company.service';
import { CompanyController } from './company.controller';
import { ICompanyRepository, ICompanyService } from './company.interfaces';

const companyModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<ICompanyRepository>(TYPES.CompanyRepository).to(CompanyRepository).inSingletonScope();
    bind<ICompanyService>(TYPES.CompanyService).to(CompanyService).inSingletonScope();
    bind<CompanyController>(TYPES.CompanyController).to(CompanyController).inSingletonScope();
    bind<Repository<CompanyEntity>>(TYPES.CompanyModel).toDynamicValue((context: interfaces.Context) => {
        const database = context.container.get<DatabaseService>(TYPES.Database);
        return database.getDataSource().getRepository(CompanyEntity);
    });
});

export default companyModule;
