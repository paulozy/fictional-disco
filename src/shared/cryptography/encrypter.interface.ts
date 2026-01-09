export interface Encrypter {
  hash(plaintext: string): Promise<string>;
  compare(plaintext: string, hash: string): Promise<boolean>;
}
