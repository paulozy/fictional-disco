import { beforeEach, describe, expect, it } from '@jest/globals';
import { InMemoryEmployeesRepository } from '../../employees/repositories/in-memory-employees.repository';
import { InMemoryShiftsRepository } from '../../shifts/repositories/in-memory-shifts.repository';
import { InMemorySchedulesRepository } from '../repositories/in-memory-schedules.repository';
import { AutoGenerateScheduleUseCase } from './auto-generate-schedule.usecase';

describe('AutoGenerateScheduleUseCase', () => {
  let schedulesRepository: InMemorySchedulesRepository;
  let shiftsRepository: InMemoryShiftsRepository;
  let employeesRepository: InMemoryEmployeesRepository;
  let sut: AutoGenerateScheduleUseCase;

  beforeEach(() => {
    schedulesRepository = new InMemorySchedulesRepository();
    shiftsRepository = new InMemoryShiftsRepository();
    employeesRepository = new InMemoryEmployeesRepository();
    sut = new AutoGenerateScheduleUseCase(
      schedulesRepository,
      shiftsRepository,
      employeesRepository,
    );
  });

  it('should generate shifts for all active employees', async () => {
    // Create a schedule
    const schedule = await schedulesRepository.create({
      weekStart: new Date('2024-01-08'),
      companyId: 'company-123',
    });

    // Create employees with different work days
    const employee1 = await employeesRepository.create({
      name: 'John Doe',
      role: 'Developer',
      phone: '123456789',
      active: true,
      workStartTime: '09:00',
      workEndTime: '18:00',
      workDays: [1, 2, 3, 4, 5], // Monday to Friday
      companyId: 'company-123',
    });
    const employee2 = await employeesRepository.create({
      name: 'Jane Smith',
      role: 'Designer',
      phone: '987654321',
      active: true,
      workStartTime: '08:00',
      workEndTime: '17:00',
      workDays: [1, 3, 5], // Monday, Wednesday, Friday
      companyId: 'company-123',
    });

    // Execute use case
    const result = await sut.execute({
      scheduleId: schedule.id,
    });

    // Verify result
    expect(result.success).toBe(true);
    expect(result.shiftsGenerated).toBe(8); // 5 + 3

    // Verify shifts were created
    const createdShifts = await shiftsRepository.findByScheduleId(schedule.id);
    expect(createdShifts.length).toBe(8);
  });

  it('should generate shifts for specific employees only', async () => {
    // Create a schedule
    const schedule = await schedulesRepository.create({
      weekStart: new Date('2024-01-08'),
      companyId: 'company-123',
    });

    // Create employees
    const employee1 = await employeesRepository.create({
      name: 'John Doe',
      role: 'Developer',
      phone: '123456789',
      active: true,
      workStartTime: '09:00',
      workEndTime: '18:00',
      workDays: [1, 2, 3, 4, 5],
      companyId: 'company-123',
    });
    const employee2 = await employeesRepository.create({
      name: 'Jane Smith',
      role: 'Designer',
      phone: '987654321',
      active: true,
      workStartTime: '08:00',
      workEndTime: '17:00',
      workDays: [1, 3, 5],
      companyId: 'company-123',
    });

    // Execute use case with specific employee
    const result = await sut.execute({
      scheduleId: schedule.id,
      employeeIds: [employee1.id],
    });

    // Verify result
    expect(result.success).toBe(true);
    expect(result.shiftsGenerated).toBe(5); // Only employee1

    // Verify only employee1's shifts were created
    const createdShifts = await shiftsRepository.findByScheduleId(schedule.id);
    expect(createdShifts.length).toBe(5);
    expect(createdShifts.every((s) => s.employeeId === employee1.id)).toBe(true);
  });

  it('should delete existing shifts before generating new ones', async () => {
    // Create a schedule
    const schedule = await schedulesRepository.create({
      weekStart: new Date('2024-01-08'),
      companyId: 'company-123',
    });

    // Create an employee
    const employee = await employeesRepository.create({
      name: 'John Doe',
      role: 'Developer',
      phone: '123456789',
      active: true,
      workStartTime: '09:00',
      workEndTime: '18:00',
      workDays: [1, 2],
      companyId: 'company-123',
    });

    // Create initial shifts
    await shiftsRepository.create({
      scheduleId: schedule.id,
      employeeId: employee.id,
      dayOfWeek: 0,
      startTime: '09:00',
      endTime: '17:00',
    });

    let shiftsBeforeRegen = await shiftsRepository.findByScheduleId(schedule.id);
    expect(shiftsBeforeRegen.length).toBe(1);

    // Execute use case
    await sut.execute({
      scheduleId: schedule.id,
      employeeIds: [employee.id],
    });

    // Verify old shifts were deleted and new ones created
    const shiftsAfterRegen = await shiftsRepository.findByScheduleId(schedule.id);
    expect(shiftsAfterRegen.length).toBe(2); // Only the 2 new shifts
    expect(shiftsAfterRegen.every((s) => s.dayOfWeek === 1 || s.dayOfWeek === 2)).toBe(true);
  });

  it('should throw error if schedule does not exist', async () => {
    const nonExistentScheduleId = 'non-existent-id';

    await expect(
      sut.execute({
        scheduleId: nonExistentScheduleId,
      }),
    ).rejects.toThrow('Schedule not found');
  });

  it('should throw error if requested employees do not exist', async () => {
    // Create a schedule
    const schedule = await schedulesRepository.create({
      weekStart: new Date('2024-01-08'),
      companyId: 'company-123',
    });

    // Try to execute with non-existent employee IDs
    await expect(
      sut.execute({
        scheduleId: schedule.id,
        employeeIds: ['non-existent-id'],
      }),
    ).rejects.toThrow('Some employees not found');
  });
});
