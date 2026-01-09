import { InMemoryShiftsRepository } from '../repositories/in-memory-shifts.repository';
import { CreateShiftUseCase } from '../usecases/create-shift.usecase';
import { DeleteShiftUseCase } from '../usecases/delete-shift.usecase';

describe('Shifts Usecases', () => {
  let shiftsRepository: InMemoryShiftsRepository;
  let createShiftUseCase: CreateShiftUseCase;
  let deleteShiftUseCase: DeleteShiftUseCase;

  beforeEach(() => {
    shiftsRepository = new InMemoryShiftsRepository();
    createShiftUseCase = new CreateShiftUseCase(shiftsRepository);
    deleteShiftUseCase = new DeleteShiftUseCase(shiftsRepository);
  });

  describe('CreateShiftUseCase', () => {
    it('should create a new shift', async () => {
      const response = await createShiftUseCase.execute({
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '17:00',
        scheduleId: 'schedule-1',
        employeeId: 'employee-1',
      });

      expect(response).toHaveProperty('id');
      expect(response.dayOfWeek).toBe(1);
      expect(response.startTime).toBe('08:00');
      expect(response.endTime).toBe('17:00');
    });
  });

  describe('DeleteShiftUseCase', () => {
    it('should delete a shift', async () => {
      const shift = await createShiftUseCase.execute({
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '17:00',
        scheduleId: 'schedule-1',
        employeeId: 'employee-1',
      });

      const response = await deleteShiftUseCase.execute({
        shiftId: shift.id,
      });

      expect(response.success).toBe(true);

      const deletedShift = await shiftsRepository.findById(shift.id);
      expect(deletedShift).toBeNull();
    });
  });
});
