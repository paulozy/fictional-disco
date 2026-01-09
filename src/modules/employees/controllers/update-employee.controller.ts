import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { UpdateEmployeeUseCase } from '../usecases/update-employee.usecase';

export class UpdateEmployeeController extends Controller {
  constructor(private updateEmployeeUseCase: UpdateEmployeeUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const employeeId = request.params?.employeeId;
      const { name, role, phone, workStartTime, workEndTime, workDays } = request.body;

      if (!employeeId) {
        return this.badRequest('Employee ID is required');
      }

      const result = await this.updateEmployeeUseCase.execute({
        employeeId,
        name,
        role,
        phone,
        workStartTime,
        workEndTime,
        workDays,
      });

      return this.ok(result);
    } catch (error) {
      if ((error as Error).message === 'Employee not found') {
        return this.notFound('Employee not found');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
