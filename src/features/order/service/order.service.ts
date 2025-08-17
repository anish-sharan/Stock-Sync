import { inject, injectable } from 'inversify';
import TYPES from '@core/types';
import { IOrder, IOrderRepository, IOrderService } from '../order.interface';
import { OrderAction } from '../data/enum/order.enum';
import { OrderStatus } from '../data/enum/order.enum';
import { ValidationError } from '@core/data/error/app.error';
import { IStockRepository } from '@features/stock/stock.interfaces';
import { ICreateOrder } from '../data/request/createOrder.dto';
import { IUpdateOrder } from '../data/request/updateOrder.dto';
import OrderEntity from '../entities/order.entity';
import CompanyEntity from '@features/company/entities/company.entity';
import ProductEntity from '@features/product/entities/product.entity';

@injectable()
export class OrderService implements IOrderService {
  constructor(
    @inject(TYPES.OrderRepository) private orderRepository: IOrderRepository,
    @inject(TYPES.StockRepository) private stockRepository: IStockRepository
  ) { }

  async create(data: ICreateOrder): Promise<IOrder> {
    const stock = await this.stockRepository.findByCompanyAndProduct(
      data.companyId!,
      data.productId!
    );


    if (!stock) {
      throw new ValidationError('Stock not found for this company/product', {
        stock: ['Company does not hold this product'],
      });
    }
    console.log("stock", stock);
    console.log("data", data);
    console.log("stock.quantity", stock?.quantity);
    console.log("data.quantity", data.quantity);
    console.log("stock.quantity > data.quantity", data.quantity > stock?.quantity);

    if (data.quantity > stock.quantity) {
      throw new ValidationError('Insufficient stock', {
        quantity: [`Only ${stock.quantity} available in stock`],
      });
    }

    const newOrder = new OrderEntity();
    newOrder.company = { id: data.companyId } as CompanyEntity;
    newOrder.product = { id: data.productId } as ProductEntity;
    newOrder.quantity = data.quantity;
    newOrder.price = data.price;
    newOrder.status = OrderStatus.PENDING;

    const order = await this.orderRepository.create(newOrder);

    return order;
  }

  async update(id: string, data: IUpdateOrder): Promise<IOrder> {
    const order = await this.orderRepository.findByIdOrFail(id);

    console.log("order", order);

    switch (data.action) {
      case OrderAction.update:
        if (order.status !== OrderStatus.PENDING) {
          throw new ValidationError('Invalid update', {
            status: ['Only pending orders can be updated'],
          });
        }
        break;

      case OrderAction.cancel:
        if (order.status !== OrderStatus.PENDING) {
          throw new ValidationError('Invalid cancel', {
            status: ['Only pending orders can be canceled'],
          });
        }
        order.status = OrderStatus.CANCELED;
        break;

      case OrderAction.complete:
        if (order.status !== OrderStatus.PENDING) {
          throw new ValidationError('Invalid complete', {
            status: ['Only pending orders can be completed'],
          });
        }

        const stock = await this.stockRepository.findByCompanyAndProduct(
          order.company.id!,
          order.product.id!
        );

        const stockQty = Number(stock?.quantity);
        const orderQty = Number(order.quantity);

        if (!stock || stockQty < orderQty) {
          throw new ValidationError('Not enough stock available to complete order', {
            quantity: ['Insufficient stock'],
          });
        }

        stock.quantity -= order.quantity;
        await this.stockRepository.update(stock.id, stock);

        order.status = OrderStatus.COMPLETED;
        break;

      default:
        break;
    }

    return this.orderRepository.update(id, {
      status: order.status,
    });
  }


  async getAll(): Promise<IOrder[]> {
    return this.orderRepository.findAll();
  }

  async getByIdOrFail(id: string): Promise<IOrder> {
    return this.orderRepository.findByIdOrFail(id);
  }
}
