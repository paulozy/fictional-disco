import { Encrypter } from '../../../shared/cryptography/encrypter.interface';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { UserRole } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users-repository.interface';

export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: Date;
}

export class CreateUserUseCase implements UseCase<CreateUserRequest, CreateUserResponse> {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) { }

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const existingUser = await this.usersRepository.findByEmail(request.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.encrypter.hash(request.password);

    const user = await this.usersRepository.create({
      email: request.email,
      password: hashedPassword,
      role: request.role,
      companyId: request.companyId,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
    };
  }
}
