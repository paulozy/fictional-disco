import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { CreateScheduleUseCase } from '../usecases/create-schedule.usecase';

export class CreateScheduleController extends Controller {
  constructor(private createScheduleUseCase: CreateScheduleUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { weekStart } = request.body;
      const { companyId } = request.user!;

      if (!weekStart) {
        return this.badRequest('Week start date is required');
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
