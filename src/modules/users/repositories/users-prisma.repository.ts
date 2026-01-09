import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../../../shared/repositories/prisma-repository';
import { User } from '../entities/user.entity';
import { UsersRepository, CreateUserProps, UpdateUserProps } from './users-repository.interface';

export class UsersPrismaRepository
  extends PrismaRepository<User, CreateUserProps, UpdateUserProps>
  implements UsersRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create(props: CreateUserProps): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: props.email,
        password: props.password,
        role: props.role,
        companyId: props.companyId,
      },
    });

    return this.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByCompanyId(companyId: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { companyId },
    });

    return users.map((user) => this.toDomain(user));
  }

  async update(id: string, props: UpdateUserProps): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: props.email,
        password: props.password,
        role: props.role,
      },
    });

    return this.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  protected toDomain(raw: any): User {
    return User.create({
      id: raw.id,
      email: raw.email,
      password: raw.password,
      role: raw.role,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
    });
  }

  protected toPersistence(entity: User): any {
    return {
      id: entity.id,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      companyId: entity.companyId,
      createdAt: entity.createdAt,
    };
  }
}
