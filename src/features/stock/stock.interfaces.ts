import { ICompany } from '@features/company/company.interfaces';
import { IProduct } from '@features/product/product.interface';

export interface IStock {
    id: string;
    quantity: number;
    avgPrice: number;
    currentPrice?: number | null;
    product: IProduct;
    company?: ICompany;
    createdDate: Date;
    updatedDate: Date;
}

export interface IStockRepository {
    create(stock: Partial<IStock>): Promise<IStock>;
    findAll(): Promise<IStock[]>;
    findByIdOrFail(id: string): Promise<IStock>;
    update(id: string, stock: Partial<IStock>): Promise<IStock>;
    findByCompanyAndProduct(companyId: string, productId: string): Promise<IStock | null>;
}

export interface IStockService {
    create(data: Partial<IStock>): Promise<IStock>;
    getAll(): Promise<IStock[]>;
    getByIdOrFail(id: string): Promise<IStock>;
    update(id: string, data: Partial<IStock>): Promise<IStock>;
}
