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
    it('should return existing schedule by week start date', async () => {
      const weekStart = new Date('2026-01-12');

      const created = await createScheduleUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      const response = await getScheduleByWeekUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      expect(response.schedule.id).toBe(created.id);
      expect(response.schedule.weekStart).toEqual(weekStart);
      expect(response.shifts).toBeInstanceOf(Array);
    });

    it('should create and return schedule if it does not exist', async () => {
      const weekStart = new Date('2026-01-12');

      const response = await getScheduleByWeekUseCase.execute({
        weekStart,
        companyId: 'company-1',
      });

      expect(response).toHaveProperty('schedule');
      expect(response).toHaveProperty('shifts');
      expect(response.schedule).toHaveProperty('id');
      expect(response.schedule.weekStart).toEqual(weekStart);
      expect(response.shifts).toBeInstanceOf(Array);

      // Verify it was actually created in repository
      const retrieved = await schedulesRepository.findByWeekStart(weekStart, 'company-1');
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(response.schedule.id);
    });
  });
});
