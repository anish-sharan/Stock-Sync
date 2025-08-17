import { z } from 'zod';
import { OrderAction } from '../enum/order.enum';

export const updateOrderDto = z.object({
  action: z.enum(OrderAction),
});

export type IUpdateOrder = z.infer<typeof updateOrderDto>;
