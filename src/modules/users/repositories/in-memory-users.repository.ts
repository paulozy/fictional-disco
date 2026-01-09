import { InMemoryRepository } from '../../../shared/testing/in-memory-repository';
import { User } from '../entities/user.entity';
import { CreateUserProps, UpdateUserProps, UsersRepository } from '../repositories/users-repository.interface';

export class InMemoryUsersRepository
  extends InMemoryRepository<User, CreateUserProps, UpdateUserProps>
  implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.entities.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByCompanyId(companyId: string): Promise<User[]> {
    const users: User[] = [];
    for (const user of this.entities.values()) {
      if (user.companyId === companyId) {
        users.push(user);
      }
    }
    return users;
  }

  protected createEntity(props: CreateUserProps): User {
    return User.create({
      email: props.email,
      password: props.password,
      role: props.role,
      companyId: props.companyId,
    });
  }

  protected updateEntity(entity: User, props: UpdateUserProps): User {
    const updated = User.create({
      id: entity.id,
      email: props.email || entity.email,
      password: props.password || entity.password,
      role: props.role || entity.role,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    });
    return updated;
  }

  protected getId(entity: User): string {
    return entity.id;
  }
}
