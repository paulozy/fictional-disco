export interface Repository<Entity, CreateProps, UpdateProps> {
  create(props: CreateProps): Promise<Entity>;
  findById(id: string): Promise<Entity | null>;
  update(id: string, props: UpdateProps): Promise<Entity>;
  delete(id: string): Promise<void>;
}
