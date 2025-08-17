import { OrderStatus } from "./data/enum/order.enum";
import { IUpdateOrder } from "./data/request/updateOrder.dto";

export interface IOrder {
  id: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  company: any;
  product: any;
  createdDate: Date;
  updatedDate: Date;
}

export interface IOrderRepository {
  create(order: Partial<IOrder>): Promise<IOrder>;
  findAll(): Promise<IOrder[]>;
  findByIdOrFail(id: string): Promise<IOrder>;
  update(id: string, data: Partial<IOrder>): Promise<IOrder>;
}

export interface IOrderService {
  create(data: Partial<IOrder>): Promise<IOrder>;
  getAll(): Promise<IOrder[]>;
  getByIdOrFail(id: string): Promise<IOrder>;
  update(id: string, data: IUpdateOrder): Promise<IOrder>;
}
