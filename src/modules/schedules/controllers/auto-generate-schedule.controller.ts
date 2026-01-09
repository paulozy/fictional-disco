import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { AutoGenerateScheduleUseCase } from './auto-generate-schedule.usecase';

export class AutoGenerateScheduleController extends Controller {
  constructor(private autoGenerateScheduleUseCase: AutoGenerateScheduleUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const scheduleId = request.params?.scheduleId;
      const employeeIds = request.body?.employeeIds;

      if (!scheduleId) {
        return this.badRequest('Schedule ID is required');
      }

      const result = await this.autoGenerateScheduleUseCase.execute({
        scheduleId,
        employeeIds,
      });

      return this.ok(result);
    } catch (error) {
      if ((error as Error).message === 'Schedule not found') {
        return this.notFound('Schedule not found');
      }
      if ((error as Error).message === 'Some employees not found') {
        return this.badRequest('Some employees not found');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
