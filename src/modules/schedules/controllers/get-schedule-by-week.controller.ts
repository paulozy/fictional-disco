import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { GetScheduleByWeekUseCase } from '../usecases/get-schedule-by-week.usecase';

export class GetScheduleByWeekController extends Controller {
  constructor(private getScheduleByWeekUseCase: GetScheduleByWeekUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { weekStart } = request.params;
      const { companyId } = request.user!;

      if (!weekStart) {
        return this.badRequest('Week start date is required');
      }

      const result = await this.getScheduleByWeekUseCase.execute({
        weekStart: new Date(weekStart as string),
        companyId,
      });

      if (!result) {
        return this.notFound('Schedule not found');
      }

      return this.ok(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
