import { DatabaseService } from '@core/database/database.service';
import TYPES from '@core/types';
import { ContainerModule, interfaces } from 'inversify';
import { Repository } from 'typeorm';
import { StockRepository } from './repositories/stock.repository';
import { StockService } from './service/stock.service';
import { StockController } from './stock.controller';
import { IStockRepository, IStockService } from './stock.interfaces';
import StockEntity from './entities/stock.entity';

const stockModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<IStockRepository>(TYPES.StockRepository).to(StockRepository).inSingletonScope();
    bind<IStockService>(TYPES.StockService).to(StockService).inSingletonScope();
    bind<StockController>(TYPES.StockController).to(StockController).inSingletonScope();
    bind<Repository<StockEntity>>(TYPES.StockModel).toDynamicValue((context: interfaces.Context) => {
        const database = context.container.get<DatabaseService>(TYPES.Database);
        return database.getDataSource().getRepository(StockEntity);
    });
});

export default stockModule;
