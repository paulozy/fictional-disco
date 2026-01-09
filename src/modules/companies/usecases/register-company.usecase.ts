import { Encrypter } from '../../../shared/cryptography/encrypter.interface';
import { TokenGenerator } from '../../../shared/cryptography/token-generator.interface';
import { BillingClientFactory } from '../../../shared/factories/billing-client.factory';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { UsersRepository } from '../../users/repositories/users-repository.interface';
import { CompaniesRepository } from '../repositories/companies-repository.interface';

export interface RegisterCompanyRequest {
  companyName: string;
  segment: string;
  adminEmail: string;
  adminPassword: string;
}

export interface RegisterCompanyResponse {
  company: {
    id: string;
    name: string;
    segment: string;
    createdAt: Date;
  };
  user: {
    id: string;
    email: string;
    role: string;
    companyId: string;
  };
  token: string;
}

export class RegisterCompanyUseCase implements UseCase<RegisterCompanyRequest, RegisterCompanyResponse> {
  constructor(
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
    private tokenGenerator: TokenGenerator,
  ) { }

  async execute(request: RegisterCompanyRequest): Promise<RegisterCompanyResponse> {
    const existingUser = await this.usersRepository.findByEmail(request.adminEmail);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.encrypter.hash(request.adminPassword);
    const billingClient = BillingClientFactory.getInstance();

    try {
      const company = await this.companiesRepository.create({
        name: request.companyName,
        segment: request.segment,
      });

      try {
        const { customerId } = await billingClient.createCustomer(company);

        const updatedCompany = await this.companiesRepository.update(company.id, {
          paymentGatewayCustomerId: customerId,
        });

        try {
          const user = await this.usersRepository.create({
            email: request.adminEmail,
            password: hashedPassword,
            role: 'admin',
            companyId: updatedCompany.id,
          });

          const token = await this.tokenGenerator.generate({
            userId: user.id,
            email: user.email,
            companyId: user.companyId,
            role: user.role,
          });

          return {
            company: {
              id: updatedCompany.id,
              name: updatedCompany.name,
              segment: updatedCompany.segment,
              createdAt: updatedCompany.createdAt,
            },
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              companyId: user.companyId,
            },
            token,
          };
        } catch (error) {
          try {
            await this.companiesRepository.delete(company.id);
          } catch (deleteError) {
            console.error('Failed to rollback company creation:', deleteError);
          }
          throw error;
        }
      } catch (error) {
        try {
          await this.companiesRepository.delete(company.id);
        } catch (deleteError) {
          console.error('Failed to rollback company creation:', deleteError);
        }
        throw error;
      }
    } catch (error) {
      throw new Error(`Failed to register company: ${(error as Error).message}`);
    }
  }
}
