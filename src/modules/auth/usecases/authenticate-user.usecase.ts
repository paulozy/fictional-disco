import { Encrypter } from '../../../shared/cryptography/encrypter.interface';
import { TokenGenerator } from '../../../shared/cryptography/token-generator.interface';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { AuthRepository } from '../repositories/auth-repository.interface';

export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export interface AuthenticateUserResponse {
  id: string;
  email: string;
  role: string;
  companyId: string;
  token: string;
}

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserRequest, AuthenticateUserResponse> {
  constructor(
    private authRepository: AuthRepository,
    private encrypter: Encrypter,
    private tokenGenerator: TokenGenerator,
  ) { }

  async execute(request: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.authRepository.findByEmail(request.email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await this.encrypter.compare(request.password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = await this.tokenGenerator.generate({
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      token,
    };
  }
}
