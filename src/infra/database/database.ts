import { PrismaClient } from '@prisma/client';

export class Database {
  private static instance: PrismaClient;

  private constructor() { }

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient();
    }
    return Database.instance;
  }

  static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
      Database.instance = undefined as any;
    }
  }
}
