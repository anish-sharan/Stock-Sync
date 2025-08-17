// src/features/stocks/repositories/stock.repository.ts
import { NotFoundError } from '@core/data/error/app.error';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { IStock, IStockRepository } from '../stock.interfaces';
import StockEntity from '../entities/stock.entity';

@injectable()
export class StockRepository implements IStockRepository {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.StockModel) private repository: Repository<StockEntity>
    ) { }

    async create(stock: Partial<IStock>): Promise<IStock> {
        this.logger.info('Creating stock entry');

        const entity = this.repository.create(stock);
        return await this.repository.save(entity);
    }

    async findAll(): Promise<IStock[]> {
        this.logger.info('Fetching all stock holdings');

        return await this.repository.find({ relations: ['company', 'product'] });
    }

    async findByIdOrFail(id: string): Promise<IStock> {
        this.logger.info('Fetching stock by id', { id });

        const stock = await this.repository.findOne({ where: { id }, relations: ['company', 'product'] });
        if (!stock) throw new NotFoundError('Stock not found');
        return stock;
    }

    async update(id: string, stock: Partial<IStock>): Promise<IStock> {
        this.logger.info('Updating stock', { id });

        const existing = await this.findByIdOrFail(id);
        const updated = this.repository.merge(existing, stock);
        return await this.repository.save(updated);
    }

    async findByCompanyAndProduct(companyId: string, productId: string): Promise<IStock | null> {
        this.logger.info('Fetching stock by company and product', { companyId, productId });

        const stock = await this.repository.findOne({
            where: {
                company: { id: companyId },
                product: { id: productId }
            },
            relations: {
                company: true,
                product: true
            },
            select: {
                company: {
                    id: true
                },
                product: {
                    id: true
                }
            }
        });

        if (!stock) throw new NotFoundError('Stock not found');
        return stock;
    }
}
