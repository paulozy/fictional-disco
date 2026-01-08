export interface BaseEntityProps {
  id: string;
  createdAt?: Date;
}

export abstract class BaseEntity {
  id: string;
  createdAt: Date;

  protected constructor(id: string, createdAt: Date = new Date()) {
    this.id = id;
    this.createdAt = createdAt;
  }
}
