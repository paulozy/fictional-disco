import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { DeleteAllShiftsFromScheduleUseCase } from '../usecases/delete-all-shifts-from-schedule.usecase';

export class DeleteAllShiftsFromScheduleController extends Controller {
  constructor(private deleteAllShiftsFromScheduleUseCase: DeleteAllShiftsFromScheduleUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const scheduleId = request.params?.scheduleId;

      if (!scheduleId) {
        return this.badRequest('Schedule ID is required');
      }

      const result = await this.deleteAllShiftsFromScheduleUseCase.execute({ scheduleId });

      return this.ok(result);
    } catch (error) {
      if ((error as Error).message === 'Schedule not found') {
        return this.notFound('Schedule not found');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
