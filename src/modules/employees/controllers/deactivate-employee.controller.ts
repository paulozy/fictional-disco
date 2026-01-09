import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { DeactivateEmployeeUseCase } from '../usecases/deactivate-employee.usecase';

export class DeactivateEmployeeController extends Controller {
  constructor(private deactivateEmployeeUseCase: DeactivateEmployeeUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const employeeId = request.params?.employeeId;

      if (!employeeId) {
        return this.badRequest('Employee ID is required');
      }

      await this.deactivateEmployeeUseCase.execute({ employeeId });

      return this.noContent();
    } catch (error) {
      if ((error as Error).message === 'Employee not found') {
        return this.notFound('Employee not found');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
