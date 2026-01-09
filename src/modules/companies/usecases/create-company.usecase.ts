import { UseCase } from '../../../shared/usecases/base-use-case';
import { CompaniesRepository } from '../repositories/companies-repository.interface';

export interface CreateCompanyRequest {
  name: string;
  segment: string;
}

export interface CreateCompanyResponse {
  id: string;
  name: string;
  segment: string;
  createdAt: Date;
}

export class CreateCompanyUseCase implements UseCase<CreateCompanyRequest, CreateCompanyResponse> {
  constructor(private companiesRepository: CompaniesRepository) { }

  async execute(request: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    const company = await this.companiesRepository.create({
      name: request.name,
      segment: request.segment,
    });

    return {
      id: company.id,
      name: company.name,
      segment: company.segment,
      createdAt: company.createdAt,
    };
  }
}
