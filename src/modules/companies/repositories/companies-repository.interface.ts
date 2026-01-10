import { Repository } from '../../../shared/repositories/repository.interface';
import { Company } from '../entities/company.entity';

export interface CreateCompanyProps {
  name: string;
  segment: string;
  paymentGatewayCustomerId?: string;
}

export interface UpdateCompanyProps {
  name?: string;
  segment?: string;
  paymentGatewayCustomerId?: string;
}

export interface CompaniesRepository extends Repository<Company, CreateCompanyProps, UpdateCompanyProps> {
  findByName(name: string): Promise<Company | null>;
  findCompanyEmployeesCount(companyId: string): Promise<{ count: number }>;
}
