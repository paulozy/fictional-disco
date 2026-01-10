import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../../../shared/repositories/prisma-repository';
import { Company } from '../entities/company.entity';
import { CompaniesRepository, CreateCompanyProps, UpdateCompanyProps } from './companies-repository.interface';

export class CompaniesPrismaRepository
  extends PrismaRepository<Company, CreateCompanyProps, UpdateCompanyProps>
  implements CompaniesRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(props: CreateCompanyProps): Promise<Company> {
    const company = await this.prisma.company.create({
      data: {
        name: props.name,
        segment: props.segment,
      },
    });

    return this.toDomain(company);
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    return company ? this.toDomain(company) : null;
  }

  async findByName(name: string): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: { name },
    });

    return company ? this.toDomain(company) : null;
  }

  async update(id: string, props: UpdateCompanyProps): Promise<Company> {
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        name: props.name,
        segment: props.segment,
        paymentGatewayCustomerId: props.paymentGatewayCustomerId,
      },
    });

    return this.toDomain(company);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }

  async findCompanyEmployeesCount(companyId: string): Promise<{ count: number; }> {
    const count = await this.prisma.employee.count({
      where: { companyId }
    });

    return { count };
  }

  protected toDomain(raw: any): Company {
    return Company.create({
      id: raw.id,
      name: raw.name,
      segment: raw.segment,
      paymentGatewayCustomerId: raw.paymentGatewayCustomerId,
      createdAt: raw.createdAt,
    });
  }

  protected toPersistence(entity: Company): any {
    return {
      id: entity.id,
      name: entity.name,
      segment: entity.segment,
      paymentGatewayCustomerId: entity.paymentGatewayCustomerId,
      createdAt: entity.createdAt,
    };
  }
}
