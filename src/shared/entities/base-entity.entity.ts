import { v4 as uuidV4 } from 'uuid';

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
}

export abstract class BaseEntity {
  id: string;
  createdAt: Date;

  protected constructor(id?: string, createdAt: Date = new Date()) {
    this.id = id || uuidV4();
    this.createdAt = createdAt;
  }
}
