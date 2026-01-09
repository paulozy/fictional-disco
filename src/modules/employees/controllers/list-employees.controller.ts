import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { ListEmployeesUseCase } from '../usecases/list-employees.usecase';

export class ListEmployeesController extends Controller {
  constructor(private listEmployeesUseCase: ListEmployeesUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { companyId } = request.user!;

      const result = await this.listEmployeesUseCase.execute({ companyId });

      return this.ok(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
