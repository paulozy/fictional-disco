import { TokenGenerator } from '../../../shared/cryptography/token-generator.interface';
import { FakeEncrypter } from '../../../shared/testing/fake-encrypter';
import { InMemoryUsersRepository } from '../../users/repositories/in-memory-users.repository';
import { InMemoryCompaniesRepository } from '../repositories/in-memory-companies.repository';
import { CreateCompanyUseCase } from '../usecases/create-company.usecase';
import { GetMyCompanyUseCase } from '../usecases/get-my-company.usecase';
import { RegisterCompanyUseCase } from '../usecases/register-company.usecase';

class FakeTokenGenerator implements TokenGenerator {
  async generate(): Promise<string> {
    return 'fake-token-123';
  }

  async verify(): Promise<any> {
    return {};
  }
}

describe('Companies Usecases', () => {
  let companiesRepository: InMemoryCompaniesRepository;
  let usersRepository: InMemoryUsersRepository;
  let encrypter: FakeEncrypter;
  let tokenGenerator: FakeTokenGenerator;
  let createCompanyUseCase: CreateCompanyUseCase;
  let getMyCompanyUseCase: GetMyCompanyUseCase;
  let registerCompanyUseCase: RegisterCompanyUseCase;

  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository();
    usersRepository = new InMemoryUsersRepository();
    encrypter = new FakeEncrypter();
    tokenGenerator = new FakeTokenGenerator();
    createCompanyUseCase = new CreateCompanyUseCase(companiesRepository);
    getMyCompanyUseCase = new GetMyCompanyUseCase(companiesRepository);
    registerCompanyUseCase = new RegisterCompanyUseCase(
      companiesRepository,
      usersRepository,
      encrypter,
      tokenGenerator,
    );
  });

  describe('CreateCompanyUseCase', () => {
    it('should create a new company', async () => {
      const response = await createCompanyUseCase.execute({
        name: 'Tech Company',
        segment: 'Technology',
      });

      expect(response).toHaveProperty('id');
      expect(response.name).toBe('Tech Company');
      expect(response.segment).toBe('Technology');
      expect(response).toHaveProperty('createdAt');
    });

    it('should persist the company in repository', async () => {
      const response = await createCompanyUseCase.execute({
        name: 'Another Company',
        segment: 'Finance',
      });

      const company = await companiesRepository.findById(response.id);
      expect(company).not.toBeNull();
      expect(company?.name).toBe('Another Company');
    });
  });

  describe('GetMyCompanyUseCase', () => {
    it('should return company by id', async () => {
      const createdCompany = await createCompanyUseCase.execute({
        name: 'My Company',
        segment: 'Retail',
      });

      const response = await getMyCompanyUseCase.execute({
        companyId: createdCompany.id,
      });

      expect(response.id).toBe(createdCompany.id);
      expect(response.name).toBe('My Company');
      expect(response.segment).toBe('Retail');
    });

    it('should throw error when company not found', async () => {
      await expect(
        getMyCompanyUseCase.execute({
          companyId: 'non-existent-id',
        }),
      ).rejects.toThrow('Company not found');
    });
  });

  describe('RegisterCompanyUseCase', () => {
    it('should register a new company with admin user and token', async () => {
      const response = await registerCompanyUseCase.execute({
        companyName: 'New Company',
        segment: 'Tech',
        adminEmail: 'admin@company.com',
        adminPassword: 'secure-password',
      });

      expect(response).toHaveProperty('company');
      expect(response).toHaveProperty('user');
      expect(response).toHaveProperty('token');

      expect(response.company.name).toBe('New Company');
      expect(response.company.segment).toBe('Tech');

      expect(response.user.email).toBe('admin@company.com');
      expect(response.user.role).toBe('admin');
      expect(response.user.companyId).toBe(response.company.id);

      expect(response.token).toBe('fake-token-123');
    });

    it('should throw error when email already exists', async () => {
      await usersRepository.create({
        email: 'existing@company.com',
        password: 'hashed-password',
        role: 'admin',
        companyId: 'company-1',
      });

      await expect(
        registerCompanyUseCase.execute({
          companyName: 'New Company',
          segment: 'Tech',
          adminEmail: 'existing@company.com',
          adminPassword: 'secure-password',
        }),
      ).rejects.toThrow('User with this email already exists');
    });
  });
});