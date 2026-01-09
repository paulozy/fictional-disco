import { Encrypter } from '../../../shared/cryptography/encrypter.interface';

export class FakeEncrypter implements Encrypter {
  async hash(plaintext: string): Promise<string> {
    // For testing, just return a simple hash
    return `hashed_${plaintext}`;
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return hash === `hashed_${plaintext}`;
  }
}
