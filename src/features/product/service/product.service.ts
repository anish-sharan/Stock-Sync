import { inject, injectable } from 'inversify';
import TYPES from '@core/types';
import ProductEntity from '../entities/product.entity';
import { IProduct, IProductRepository, IProductService } from '../product.interface';

@injectable()
export class ProductService implements IProductService {
    constructor(
        @inject(TYPES.ProductRepository) private productRepository: IProductRepository
    ) { }

    async create(data: Partial<IProduct>): Promise<IProduct> {
        return await this.productRepository.create(data);
    }

    async getAll(): Promise<IProduct[]> {
        return await this.productRepository.findAll();
    }

    async getByIdOrFail(id: string): Promise<IProduct> {
        return await this.productRepository.findByIdOrFail(id);
    }
}
