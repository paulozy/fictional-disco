import bcrypt from 'bcrypt';
import { Encrypter } from '../cryptography/encrypter.interface';

export class BcryptEncrypter implements Encrypter {
  private readonly SALT_ROUNDS = 10;

  async hash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.SALT_ROUNDS);
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }
}
