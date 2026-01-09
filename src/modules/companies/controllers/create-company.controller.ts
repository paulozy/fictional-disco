import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateCompanyUseCase } from '../usecases/create-company.usecase';

export class CreateCompanyController extends Controller {
  constructor(private createCompanyUseCase: CreateCompanyUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, segment } = request.body;

      if (!name || !segment) {
        return this.badRequest('Name and segment are required');
      }

      const result = await this.createCompanyUseCase.execute({
        name,
        segment,
      });

      return this.created(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
