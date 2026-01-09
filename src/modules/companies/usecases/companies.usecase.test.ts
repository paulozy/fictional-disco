import { InMemoryCompaniesRepository } from '../repositories/in-memory-companies.repository';
import { CreateCompanyUseCase } from '../usecases/create-company.usecase';
import { GetMyCompanyUseCase } from '../usecases/get-my-company.usecase';

describe('Companies Usecases', () => {
  let companiesRepository: InMemoryCompaniesRepository;
  let createCompanyUseCase: CreateCompanyUseCase;
  let getMyCompanyUseCase: GetMyCompanyUseCase;

  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository();
    createCompanyUseCase = new CreateCompanyUseCase(companiesRepository);
    getMyCompanyUseCase = new GetMyCompanyUseCase(companiesRepository);
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
});
