import { inject, injectable } from 'inversify';
import { Repository } from 'typeorm';
import { ILogger } from '@core/logger/logger.interface';
import TYPES from '@core/types';
import OrderEntity from '../entities/order.entity';
import { NotFoundError } from '@core/data/error/app.error';
import { IOrder, IOrderRepository } from '../order.interface';
import { IUpdateOrder } from '../data/request/updateOrder.dto';

@injectable()
export class OrderRepository implements IOrderRepository {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.OrderModel) private repository: Repository<OrderEntity>
    ) { }

    async create(order: Partial<IOrder>): Promise<IOrder> {
        this.logger.info('Creating order', { order });
        const entity = this.repository.create(order);
        return await this.repository.save(entity);
    }

    async findAll(): Promise<IOrder[]> {
        this.logger.info('Fetching all orders');
        return this.repository.find({ relations: ['company', 'product'] });
    }

    async findByIdOrFail(id: string): Promise<IOrder> {
        this.logger.info('Fetching order by id', { id });

        const order = await this.repository.findOne({
            where: { id },
            relations: ['company', 'product']
        });

        if (!order) throw new NotFoundError('Order not found');
        return order;
    }

    async update(id: string, data: Partial<IOrder>): Promise<IOrder> {
        this.logger.info('Updating order', { id, data });

        await this.repository.update(id, data);
        return this.findByIdOrFail(id);
    }
}
