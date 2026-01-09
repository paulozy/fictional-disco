import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { AuthenticateUserUseCase } from '../usecases/authenticate-user.usecase';

export class AuthenticateUserController extends Controller {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return this.badRequest('Email and password are required');
      }

      const result = await this.authenticateUserUseCase.execute({
        email,
        password,
      });

      return this.ok(result);
    } catch (error) {
      if ((error as Error).message === 'User not found') {
        return this.unauthorized('Invalid credentials');
      }
      if ((error as Error).message === 'Invalid password') {
        return this.unauthorized('Invalid credentials');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
