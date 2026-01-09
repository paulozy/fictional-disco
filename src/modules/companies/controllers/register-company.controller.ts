import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { RegisterCompanyUseCase } from '../usecases/register-company.usecase';

export class RegisterCompanyController extends Controller {
  constructor(private registerCompanyUseCase: RegisterCompanyUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { companyName, segment, adminEmail, adminPassword } = request.body;

      if (!companyName || !segment || !adminEmail || !adminPassword) {
        return this.badRequest('Company name, segment, admin email and password are required');
      }

      const result = await this.registerCompanyUseCase.execute({
        companyName,
        segment,
        adminEmail,
        adminPassword,
      });

      return this.created(result);
    } catch (error) {
      const message = (error as Error).message;

      if (message.includes('already exists')) {
        return this.badRequest(message);
      }

      return this.internalServerError(message);
    }
  }
}
