import { UseCase } from '../../shared/usecases/base-use-case';
import { UserRole } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users-repository.interface';

export interface GetMeRequest {
  userId: string;
}

export interface GetMeResponse {
  id: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: Date;
}

export class GetMeUseCase implements UseCase<GetMeRequest, GetMeResponse> {
  constructor(private usersRepository: UsersRepository) { }

  async execute(request: GetMeRequest): Promise<GetMeResponse> {
    const user = await this.usersRepository.findById(request.userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
    };
  }
}
