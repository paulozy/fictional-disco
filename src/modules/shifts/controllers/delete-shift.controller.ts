import { Controller, HttpRequest, HttpResponse } from '../../../shared/http/controller';
import { DeleteShiftUseCase } from './delete-shift.usecase';

export class DeleteShiftController extends Controller {
  constructor(private deleteShiftUseCase: DeleteShiftUseCase) {
    super();
  }

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const shiftId = request.params?.shiftId;

      if (!shiftId) {
        return this.badRequest('Shift ID is required');
      }

      await this.deleteShiftUseCase.execute({ shiftId });

      return this.noContent();
    } catch (error) {
      if ((error as Error).message === 'Shift not found') {
        return this.notFound('Shift not found');
      }
      return this.internalServerError((error as Error).message);
    }
  }
}
