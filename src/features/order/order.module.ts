import { ContainerModule, interfaces } from 'inversify';
import TYPES from '@core/types';
import { Repository } from 'typeorm';
import { DatabaseService } from '@core/database/database.service';
import OrderEntity from './entities/order.entity';
import { IOrderRepository, IOrderService } from './order.interface';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './service/order.service';
import { OrderController } from './order.controller';

const orderModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IOrderRepository>(TYPES.OrderRepository).to(OrderRepository).inSingletonScope();
  bind<IOrderService>(TYPES.OrderService).to(OrderService).inSingletonScope();
  bind<OrderController>(TYPES.OrderController).to(OrderController).inSingletonScope();
  bind<Repository<OrderEntity>>(TYPES.OrderModel).toDynamicValue((context: interfaces.Context) => {
    const db = context.container.get<DatabaseService>(TYPES.Database);
    return db.getDataSource().getRepository(OrderEntity);
  });
});

export default orderModule;
