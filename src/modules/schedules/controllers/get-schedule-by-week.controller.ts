import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { GetScheduleByWeekUseCase } from './get-schedule-by-week.usecase';

export class GetScheduleByWeekController extends Controller {
  constructor(private getScheduleByWeekUseCase: GetScheduleByWeekUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const weekStart = request.query?.weekStart;
      const companyId = request.query?.companyId;

      if (!weekStart || !companyId) {
        return this.badRequest('Week start date and company ID are required');
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
