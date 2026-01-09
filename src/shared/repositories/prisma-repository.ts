import { PrismaClient } from '@prisma/client';
import { Repository } from './repository.interface';

export abstract class PrismaRepository<Entity, CreateProps, UpdateProps>
  implements Repository<Entity, CreateProps, UpdateProps> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  abstract create(props: CreateProps): Promise<Entity>;
  abstract findById(id: string): Promise<Entity | null>;
  abstract update(id: string, props: UpdateProps): Promise<Entity>;
  abstract delete(id: string): Promise<void>;

  protected abstract toDomain(raw: any): Entity;
  protected abstract toPersistence(entity: Entity): any;
}
