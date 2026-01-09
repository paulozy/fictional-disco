import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateUserUseCase } from './create-user.usecase';

export class CreateUserController extends Controller {
  constructor(private createUserUseCase: CreateUserUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password, role, companyId } = request.body;

      if (!email || !password || !role || !companyId) {
        return this.badRequest('Email, password, role, and companyId are required');
      }

      const result = await this.createUserUseCase.execute({
        email,
        password,
        role,
        companyId,
      });

      return this.created(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
