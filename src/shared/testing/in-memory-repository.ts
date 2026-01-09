import { Repository } from '../repositories/repository.interface';

export abstract class InMemoryRepository<Entity, CreateProps, UpdateProps>
  implements Repository<Entity, CreateProps, UpdateProps> {
  protected entities: Map<string, Entity> = new Map();

  async create(props: CreateProps): Promise<Entity> {
    const entity = this.createEntity(props);
    this.entities.set(this.getId(entity), entity);
    return entity;
  }

  async findById(id: string): Promise<Entity | null> {
    return this.entities.get(id) || null;
  }

  async update(id: string, props: UpdateProps): Promise<Entity> {
    const entity = this.entities.get(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    const updatedEntity = this.updateEntity(entity, props);
    this.entities.set(id, updatedEntity);
    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }

  protected abstract createEntity(props: CreateProps): Entity;
  protected abstract updateEntity(entity: Entity, props: UpdateProps): Entity;
  protected abstract getId(entity: Entity): string;
}
