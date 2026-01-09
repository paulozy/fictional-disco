import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateScheduleUseCase } from './create-schedule.usecase';

export class CreateScheduleController extends Controller {
  constructor(private createScheduleUseCase: CreateScheduleUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { weekStart, companyId } = request.body;

      if (!weekStart || !companyId) {
        return this.badRequest('Week start date and company ID are required');
      }

      const result = await this.createScheduleUseCase.execute({
        weekStart: new Date(weekStart),
        companyId,
      });

      return this.created(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
