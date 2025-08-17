import { NotFoundError } from '@core/data/error/app.error';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import ProductEntity from '../entities/product.entity';
import { IProduct, IProductRepository } from '../product.interface';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.ProductModel) private repository: Repository<ProductEntity>
	) {}

	async create(product: Partial<IProduct>): Promise<IProduct> {
		this.logger.info('Creating product', { name: product.name });

		const entity = this.repository.create(product);
		return await this.repository.save(entity);
	}

	async findAll(): Promise<IProduct[]> {
		this.logger.info('Fetching all products');

		return await this.repository.find();
	}

	async findByIdOrFail(id: string): Promise<IProduct> {
		this.logger.info('Fetching product by id', { id });

		const product = await this.repository.findOne({ where: { id } });
		if (!product) {
			throw new NotFoundError('Product not found');
		}
		return product;
	}
}
