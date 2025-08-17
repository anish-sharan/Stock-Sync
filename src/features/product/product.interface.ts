import ProductEntity from './entities/product.entity';

export interface IProduct {
	id: string;
	name: string;
	description?: string;
	price: number;
	stock: number;
	createdBy?: string;
	createdDate: Date;
	updatedDate: Date;
}

export interface IProductRepository {
	create(product: Partial<IProduct>): Promise<IProduct>;
	findAll(): Promise<IProduct[]>;
	findByIdOrFail(id: string): Promise<IProduct>;
}

export interface IProductService {
	create(data: Partial<IProduct>): Promise<IProduct>;
	getAll(): Promise<IProduct[]>;
	getByIdOrFail(id: string): Promise<IProduct>;
}
