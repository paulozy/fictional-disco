export interface TokenPayload {
  userId: string;
  email: string;
  companyId: string;
  role: string;
}

export interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
