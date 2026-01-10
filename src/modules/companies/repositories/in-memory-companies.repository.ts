import { InMemoryRepository } from '../../../shared/testing/in-memory-repository';
import { Company } from '../entities/company.entity';
import { CompaniesRepository, CreateCompanyProps, UpdateCompanyProps } from '../repositories/companies-repository.interface';

export class InMemoryCompaniesRepository
  extends InMemoryRepository<Company, CreateCompanyProps, UpdateCompanyProps>
  implements CompaniesRepository {
  async findByName(name: string): Promise<Company | null> {
    for (const company of this.entities.values()) {
      if (company.name === name) {
        return company;
      }
    }
    return null;
  }

  protected createEntity(props: CreateCompanyProps): Company {
    return Company.create({
      name: props.name,
      segment: props.segment,
      paymentGatewayCustomerId: props.paymentGatewayCustomerId,
    });
  }

  protected updateEntity(entity: Company, props: UpdateCompanyProps): Company {
    const updated = Company.create({
      id: entity.id,
      name: props.name || entity.name,
      segment: props.segment || entity.segment,
      paymentGatewayCustomerId: props.paymentGatewayCustomerId || entity.paymentGatewayCustomerId,
      createdAt: entity.createdAt,
    });
    return updated;
  }

  protected getId(entity: Company): string {
    return entity.id;
  }
}
