import { DatabaseService } from '@core/database/database.service';
import TYPES from '@core/types';
import { ContainerModule, interfaces } from 'inversify';
import { Repository } from 'typeorm';
import ProductEntity from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './service/product.service';
import { ProductController } from './product.controller';
import { IProductRepository, IProductService } from './product.interface';

const productModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository).inSingletonScope();
    bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
    bind<ProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();
    bind<Repository<ProductEntity>>(TYPES.ProductModel).toDynamicValue((context: interfaces.Context) => {
        const database = context.container.get<DatabaseService>(TYPES.Database);
        return database.getDataSource().getRepository(ProductEntity);
    });
});

export default productModule;
