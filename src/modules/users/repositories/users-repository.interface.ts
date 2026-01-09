import { Repository } from '../../../shared/repositories/repository.interface';
import { User, UserRole } from '../entities/user.entity';

export interface CreateUserProps {
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
}

export interface UpdateUserProps {
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface UsersRepository extends Repository<User, CreateUserProps, UpdateUserProps> {
  findByEmail(email: string): Promise<User | null>;
  findByCompanyId(companyId: string): Promise<User[]>;
}
