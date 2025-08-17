import { z } from 'zod';

export const createProductDto = z.object({
    name: z.string().min(1, 'Product name is required').max(255),
    description: z.string().max(500).optional(),
    price: z.number().positive('Price must be greater than 0'),
    stock: z.number().int().nonnegative('Stock must be 0 or greater'),
});

export type ICreateProduct = z.infer<typeof createProductDto>;
