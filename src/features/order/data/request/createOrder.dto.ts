import { z } from 'zod';

export const createOrderDto = z.object({
    companyId: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().positive('Quantity must be greater than 0'),
    price: z.number().positive('Price must be greater than 0'),
});

export type ICreateOrder = z.infer<typeof createOrderDto>;

