import { z } from 'zod';
import { UserRole } from '@features/user/data/enums/user.enums';

export const createUserDto = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    address: z.string().max(255).optional(),
    role: z.enum(UserRole),
    createdBy: z.string().uuid('Invalid createdBy ID format').optional(),
});

export type ICreateUser = z.infer<typeof createUserDto>;
