import { BillingClientFactory } from '../../../shared/factories/billing-client.factory';
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
  paymentGatewayCustomerId?: string;
  createdAt: Date;
}

export class CreateCompanyUseCase implements UseCase<CreateCompanyRequest, CreateCompanyResponse> {
  constructor(private companiesRepository: CompaniesRepository) { }

  async execute(request: CreateCompanyRequest): Promise<CreateCompanyResponse> {
    const billingClient = BillingClientFactory.getInstance();

    const company = await this.companiesRepository.create({
      name: request.name,
      segment: request.segment,
    });

    try {
      const { customerId } = await billingClient.createCustomer(company);

      const updatedCompany = await this.companiesRepository.update(company.id, {
        paymentGatewayCustomerId: customerId,
      });

      return {
        id: updatedCompany.id,
        name: updatedCompany.name,
        segment: updatedCompany.segment,
        paymentGatewayCustomerId: updatedCompany.paymentGatewayCustomerId,
        createdAt: updatedCompany.createdAt,
      };
    } catch (error) {
      await this.companiesRepository.delete(company.id);
      throw error;
    }
  }
}
