import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { GetMeUseCase } from '../usecases/get-me.usecase';

export class GetMeController extends Controller {
  constructor(private getMeUseCase: GetMeUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const userId = request.headers?.userId;

      if (!userId) {
        return this.unauthorized('User not authenticated');
      }

      const result = await this.getMeUseCase.execute({ userId });

      if (!result) {
        return this.notFound('User not found');
      }

      return this.ok(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
