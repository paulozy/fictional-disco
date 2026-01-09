import { TokenGenerator } from '../../../shared/cryptography/token-generator.interface';
import { FakeEncrypter } from '../../../shared/testing/fake-encrypter';
import { InMemoryUsersRepository } from '../../users/repositories/in-memory-users.repository';
import { AuthenticateUserUseCase } from '../usecases/authenticate-user.usecase';

class FakeTokenGenerator implements TokenGenerator {
  async generate(): Promise<string> {
    return 'fake-token-123';
  }

  async verify(): Promise<any> {
    return {};
  }
}

describe('Auth Usecases', () => {
  let usersRepository: InMemoryUsersRepository;
  let encrypter: FakeEncrypter;
  let tokenGenerator: FakeTokenGenerator;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    encrypter = new FakeEncrypter();
    tokenGenerator = new FakeTokenGenerator();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepository,
      encrypter,
      tokenGenerator,
    );

    // Create a test user
    await usersRepository.create({
      email: 'user@example.com',
      password: 'hashed_secret123',
      role: 'manager',
      companyId: 'company-1',
    });
  });

  describe('AuthenticateUserUseCase', () => {
    it('should authenticate a user with valid credentials', async () => {
      const response = await authenticateUserUseCase.execute({
        email: 'user@example.com',
        password: 'secret123',
      });

      expect(response).toHaveProperty('id');
      expect(response.email).toBe('user@example.com');
      expect(response.role).toBe('manager');
      expect(response.token).toBe('fake-token-123');
    });

    it('should throw error when user not found', async () => {
      await expect(
        authenticateUserUseCase.execute({
          email: 'nonexistent@example.com',
          password: 'secret123',
        }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error when password is invalid', async () => {
      await expect(
        authenticateUserUseCase.execute({
          email: 'user@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
