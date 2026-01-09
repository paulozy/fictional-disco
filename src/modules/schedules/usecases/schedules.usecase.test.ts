import { InMemorySchedulesRepository } from '../repositories/in-memory-schedules.repository';
import { CreateScheduleUseCase } from '../usecases/create-schedule.usecase';
import { GetScheduleByWeekUseCase } from '../usecases/get-schedule-by-week.usecase';

describe('Schedules Usecases', () => {
  let schedulesRepository: InMemorySchedulesRepository;
  let createScheduleUseCase: CreateScheduleUseCase;
  let getScheduleByWeekUseCase: GetScheduleByWeekUseCase;

  beforeEach(() => {
    schedulesRepository = new InMemorySchedulesRepository();
    createScheduleUseCase = new CreateScheduleUseCase(schedulesRepository);
    getScheduleByWeekUseCase = new GetScheduleByWeekUseCase(schedulesRepository);
  });

  describe('CreateScheduleUseCase', () => {
    it('should create a new schedule', async () => {
      const weekStart = new Date('2026-01-12');

      const response = await createScheduleUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      expect(response).toHaveProperty('id');
      expect(response.weekStart).toEqual(weekStart);
      expect(response.companyId).toBe('company-1');
    });
  });

  describe('GetScheduleByWeekUseCase', () => {
    it('should return schedule by week start date', async () => {
      const weekStart = new Date('2026-01-12');

      const created = await createScheduleUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      const response = await getScheduleByWeekUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      expect(response.id).toBe(created.id);
      expect(response.weekStart).toEqual(weekStart);
    });

    it('should throw error when schedule not found', async () => {
      const weekStart = new Date('2026-01-12');

      await expect(
        getScheduleByWeekUseCase.execute({
          weekStart,
          companyId: 'company-1',
        }),
      ).rejects.toThrow('Schedule not found');
    });
  });
});
