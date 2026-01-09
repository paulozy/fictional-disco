import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { GetMyCompanyUseCase } from '../usecases/get-my-company.usecase';

export class GetMyCompanyController extends Controller {
  constructor(private getMyCompanyUseCase: GetMyCompanyUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { companyId } = request.user!;

      if (!companyId) {
        return this.unauthorized('Company ID not provided');
      }

      const result = await this.getMyCompanyUseCase.execute({ companyId });

      if (!result) {
        return this.notFound('Company not found');
      }

      return this.ok(result);
    } catch (error) {
      return this.internalServerError((error as Error).message);
    }
  }
}
