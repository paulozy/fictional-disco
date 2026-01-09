import { UseCase } from '../../../shared/usecases/base-use-case';
import { CompaniesRepository } from '../repositories/companies-repository.interface';

export interface GetMyCompanyRequest {
  companyId: string;
}

export interface GetMyCompanyResponse {
  id: string;
  name: string;
  segment: string;
  createdAt: Date;
}

export class GetMyCompanyUseCase implements UseCase<GetMyCompanyRequest, GetMyCompanyResponse> {
  constructor(private companiesRepository: CompaniesRepository) { }

  async execute(request: GetMyCompanyRequest): Promise<GetMyCompanyResponse> {
    const company = await this.companiesRepository.findById(request.companyId);

    if (!company) {
      throw new Error('Company not found');
    }

    return {
      id: company.id,
      name: company.name,
      segment: company.segment,
      createdAt: company.createdAt,
    };
  }
}
