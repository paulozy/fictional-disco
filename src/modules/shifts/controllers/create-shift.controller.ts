import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateShiftUseCase } from './create-shift.usecase';

export class CreateShiftController extends Controller {
  constructor(private createShiftUseCase: CreateShiftUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { dayOfWeek, startTime, endTime, scheduleId, employeeId } = request.body;

      if (dayOfWeek === undefined || !startTime || !endTime || !scheduleId || !employeeId) {
        return this.badRequest('All fields are required');
      }

      const result = await this.createShiftUseCase.execute({
        dayOfWeek,
        startTime,
        endTime,
        scheduleId,
        employeeId,
      });

      return this.created(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
