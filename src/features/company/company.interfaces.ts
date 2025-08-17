export interface ICompany {
    id: string;
    name: string;
    registrationNumber?: string;
    createdDate?: Date;
    updatedDate?: Date;
}

export interface ICompanyRepository {
    create(company: Partial<ICompany>): Promise<ICompany>;
    findAll(): Promise<ICompany[]>;
    findByIdOrFail(id: string): Promise<ICompany>;
}

export interface ICompanyService {
    create(company: Partial<ICompany>): Promise<ICompany>;
    getAll(): Promise<ICompany[]>;
    getByIdOrFail(id: string): Promise<ICompany>;
}
