import { inject, injectable } from 'inversify';
import TYPES from '@core/types';
import { IStock, IStockRepository, IStockService } from '../stock.interfaces';
import CompanyEntity from '@features/company/entities/company.entity';
import { ICreateStock } from '../data/request/createStock.dto';
import StockEntity from '../entities/stock.entity';
import ProductEntity from '@features/product/entities/product.entity';

@injectable()
export class StockService implements IStockService {
    constructor(
        @inject(TYPES.StockRepository) private stockRepository: IStockRepository
    ) {}

    async create(data: ICreateStock): Promise<IStock> {

        const newStock = new StockEntity();

        newStock.company = { id: data.companyId } as CompanyEntity;
        newStock.product = { id: data.productId } as ProductEntity;
        newStock.quantity = data.quantity;
        newStock.avgPrice = data.avgPrice;
        newStock.currentPrice = data.currentPrice || null;

        return await this.stockRepository.create(newStock);
    }

    async getAll(): Promise<IStock[]> {
        return await this.stockRepository.findAll();
    }

    async getByIdOrFail(id: string): Promise<IStock> {
        return await this.stockRepository.findByIdOrFail(id);
    }

    async update(id: string, data: Partial<IStock>): Promise<IStock> {
        return await this.stockRepository.update(id, data);
    }
}
