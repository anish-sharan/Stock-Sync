import { z } from 'zod';

export const createStockDto = z.object({
    companyId: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().positive('Quantity must be greater than 0'),
    avgPrice: z.number().nonnegative('Average price must be >= 0'),
    currentPrice: z.number().nonnegative('Current price must be >= 0').optional()
});

export type ICreateStock = z.infer<typeof createStockDto>;
