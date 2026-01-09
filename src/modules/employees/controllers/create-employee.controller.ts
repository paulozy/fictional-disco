import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateEmployeeUseCase } from '../usecases/create-employee.usecase';

export class CreateEmployeeController extends Controller {
  constructor(private createEmployeeUseCase: CreateEmployeeUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, role, phone, workStartTime, workEndTime, workDays } = request.body;
      const { companyId } = request.user!;

      if (!name || !role || !phone || !workStartTime || !workEndTime || !workDays) {
        return this.badRequest(
          'Name, role, phone, workStartTime, workEndTime, workDays, and companyId are required'
        );
      }

      const result = await this.createEmployeeUseCase.execute({
        name,
        role,
        phone,
        workStartTime,
        workEndTime,
        workDays,
        companyId,
      });

      return this.created(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
