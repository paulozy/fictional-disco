import { UseCase } from '../../shared/usecases/base-use-case';
import { ShiftsRepository } from '../repositories/shifts-repository.interface';

export interface DeleteShiftRequest {
  shiftId: string;
}

export interface DeleteShiftResponse {
  success: boolean;
}

export class DeleteShiftUseCase implements UseCase<DeleteShiftRequest, DeleteShiftResponse> {
  constructor(private shiftsRepository: ShiftsRepository) { }

  async execute(request: DeleteShiftRequest): Promise<DeleteShiftResponse> {
    await this.shiftsRepository.delete(request.shiftId);

    return {
      success: true,
    };
  }
}
