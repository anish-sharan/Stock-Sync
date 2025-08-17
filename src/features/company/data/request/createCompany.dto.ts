import { z } from 'zod';
import { CompanyStatus } from '../enum/company.enum';


export const createCompanyDto = z.object({
    name: z.string().min(1, 'Company name is required').max(255),
    registrationNumber: z.string().min(1, 'Registration number is required').max(100),
    status: z.enum(CompanyStatus),
});

export type ICreateCompany = z.infer<typeof createCompanyDto>;
