import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export class Database {
  private static instance: PrismaClient;

  private constructor() { }

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      const adapter = new PrismaPg({
        connectionString,
      });

      Database.instance = new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
      });
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
