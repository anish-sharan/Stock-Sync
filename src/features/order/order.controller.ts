import { inject } from 'inversify';
import TYPES from '@core/types';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam
} from 'inversify-express-utils';
import { BaseHttpController } from 'inversify-express-utils';
import { AppResponse } from '@core/data/response/app.response';
import { createOrderDto, ICreateOrder } from './data/request/createOrder.dto';
import { ValidateMiddleware } from '@core/middleware/validate.middleware';
import { IOrderService } from './order.interface';
import { IUpdateOrder, updateOrderDto } from './data/request/updateOrder.dto';

@controller('/api/orders')
export class OrderController extends BaseHttpController {
  constructor(
    @inject(TYPES.OrderService) private orderService: IOrderService
  ) {
    super();
  }

  @httpPost('/', ValidateMiddleware(createOrderDto))
  async createOrder(@requestBody() body: ICreateOrder) {
    const order = await this.orderService.create(body);
    return this.ok(AppResponse.success(order));
  }

  @httpGet('/')
  async getAllOrders() {
    const orders = await this.orderService.getAll();
    return this.ok(AppResponse.success(orders));
  }

  @httpGet('/:id')
  async getOrderById(@requestParam('id') id: string) {
    const order = await this.orderService.getByIdOrFail(id);
    return this.ok(AppResponse.success(order));
  }

  @httpPut('/:id', ValidateMiddleware(updateOrderDto))
  async updateOrder(@requestParam('id') id: string, @requestBody() body: IUpdateOrder) {
    const updated = await this.orderService.update(id, body);
    return this.ok(AppResponse.success(updated));
  }
}
