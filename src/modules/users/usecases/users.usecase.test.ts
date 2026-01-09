import { FakeEncrypter } from '../../../shared/testing/fake-encrypter';
import { InMemoryUsersRepository } from '../repositories/in-memory-users.repository';
import { CreateUserUseCase } from '../usecases/create-user.usecase';
import { GetMeUseCase } from '../usecases/get-me.usecase';

describe('Users Usecases', () => {
  let usersRepository: InMemoryUsersRepository;
  let encrypter: FakeEncrypter;
  let createUserUseCase: CreateUserUseCase;
  let getMeUseCase: GetMeUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    encrypter = new FakeEncrypter();
    createUserUseCase = new CreateUserUseCase(usersRepository, encrypter);
    getMeUseCase = new GetMeUseCase(usersRepository);
  });

  describe('CreateUserUseCase', () => {
    it('should create a new user with hashed password', async () => {
      const response = await createUserUseCase.execute({
        email: 'user@example.com',
        password: 'secret123',
        role: 'manager',
        companyId: 'company-1',
      });

      expect(response).toHaveProperty('id');
      expect(response.email).toBe('user@example.com');
      expect(response.role).toBe('manager');
      expect(response.companyId).toBe('company-1');
    });

    it('should hash the password before saving', async () => {
      const response = await createUserUseCase.execute({
        email: 'user@example.com',
        password: 'secret123',
        role: 'admin',
        companyId: 'company-1',
      });

      const user = await usersRepository.findById(response.id);
      expect(user?.password).toBe('hashed_secret123');
    });

    it('should throw error when user with same email already exists', async () => {
      await createUserUseCase.execute({
        email: 'duplicate@example.com',
        password: 'secret123',
        role: 'manager',
        companyId: 'company-1',
      });

      await expect(
        createUserUseCase.execute({
          email: 'duplicate@example.com',
          password: 'other123',
          role: 'admin',
          companyId: 'company-2',
        }),
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('GetMeUseCase', () => {
    it('should return user by id', async () => {
      const createdUser = await createUserUseCase.execute({
        email: 'user@example.com',
        password: 'secret123',
        role: 'manager',
        companyId: 'company-1',
      });

      const response = await getMeUseCase.execute({
        userId: createdUser.id,
      });

      expect(response.id).toBe(createdUser.id);
      expect(response.email).toBe('user@example.com');
      expect(response.role).toBe('manager');
    });

    it('should throw error when user not found', async () => {
      await expect(
        getMeUseCase.execute({
          userId: 'non-existent-id',
        }),
      ).rejects.toThrow('User not found');
    });
  });
});
