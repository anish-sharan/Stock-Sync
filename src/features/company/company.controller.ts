import TYPES from '@core/types';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPost,
    requestBody,
    requestParam
} from 'inversify-express-utils';
import { ICompanyService } from './company.interfaces';
import { AppResponse } from '@core/data/response/app.response';
import { ValidateMiddleware } from '@core/middleware/validate.middleware';
import { createCompanyDto, ICreateCompany } from './data/request/createCompany.dto';

@controller('/api/companies')
export class CompanyController extends BaseHttpController {
    constructor(
        @inject(TYPES.CompanyService) private companyService: ICompanyService
    ) {
        super();
    }

    @httpPost('/', ValidateMiddleware(createCompanyDto))
    async createCompany(@requestBody() body: ICreateCompany) {
        const company = await this.companyService.create(body);
        return this.ok(AppResponse.success(company));
    }

    @httpGet('/')
    async getAllCompanies() {
        const companies = await this.companyService.getAll();
        return this.ok(AppResponse.success(companies));
    }

    @httpGet('/:id')
    async getCompanyById(@requestParam('id') id: string) {
        const company = await this.companyService.getByIdOrFail(id);
        return this.ok(AppResponse.success(company));
    }
}
