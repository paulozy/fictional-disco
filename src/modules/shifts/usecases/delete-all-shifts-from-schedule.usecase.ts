import { Logger, LoggerFactory } from '../../../shared/logger';
import { UseCase } from '../../../shared/usecases/base-use-case';
import { ShiftsRepository } from '../repositories/shifts-repository.interface';

export interface DeleteAllShiftsFromScheduleRequest {
  scheduleId: string;
}

export interface DeleteAllShiftsFromScheduleResponse {
  success: boolean;
  deletedCount: number;
}

export class DeleteAllShiftsFromScheduleUseCase
  implements UseCase<DeleteAllShiftsFromScheduleRequest, DeleteAllShiftsFromScheduleResponse> {
  private logger: Logger;

  constructor(private shiftsRepository: ShiftsRepository) {
    this.logger = LoggerFactory.createLogger({
      module: 'Shifts',
      action: 'DeleteAllShiftsFromSchedule',
    });
  }

  async execute(request: DeleteAllShiftsFromScheduleRequest): Promise<DeleteAllShiftsFromScheduleResponse> {
    const { scheduleId } = request;

    this.logger.info('Starting deletion of all shifts from schedule', { scheduleId });

    try {
      const shifts = await this.shiftsRepository.findByScheduleId(scheduleId);
      const deletedCount = shifts.length;

      if (deletedCount === 0) {
        this.logger.info('No shifts found for schedule', { scheduleId });
        return {
          success: true,
          deletedCount: 0,
        };
      }

      await this.shiftsRepository.deleteByScheduleId(scheduleId);

      this.logger.success('All shifts deleted successfully from schedule', {
        scheduleId,
        deletedCount,
      });

      return {
        success: true,
        deletedCount,
      };
    } catch (error) {
      this.logger.error('Error deleting shifts from schedule', error, { scheduleId });
      throw error;
    }
  }
}
