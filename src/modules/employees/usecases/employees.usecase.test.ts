import { InMemoryEmployeesRepository } from '../repositories/in-memory-employees.repository';
import { CreateEmployeeUseCase } from '../usecases/create-employee.usecase';
import { DeactivateEmployeeUseCase } from '../usecases/deactivate-employee.usecase';
import { ListEmployeesUseCase } from '../usecases/list-employees.usecase';
import { UpdateEmployeeUseCase } from '../usecases/update-employee.usecase';

describe('Employees Usecases', () => {
  let employeesRepository: InMemoryEmployeesRepository;
  let createEmployeeUseCase: CreateEmployeeUseCase;
  let listEmployeesUseCase: ListEmployeesUseCase;
  let updateEmployeeUseCase: UpdateEmployeeUseCase;
  let deactivateEmployeeUseCase: DeactivateEmployeeUseCase;

  beforeEach(() => {
    employeesRepository = new InMemoryEmployeesRepository();
    createEmployeeUseCase = new CreateEmployeeUseCase(employeesRepository);
    listEmployeesUseCase = new ListEmployeesUseCase(employeesRepository);
    updateEmployeeUseCase = new UpdateEmployeeUseCase(employeesRepository);
    deactivateEmployeeUseCase = new DeactivateEmployeeUseCase(employeesRepository);
  });

  describe('CreateEmployeeUseCase', () => {
    it('should create a new employee', async () => {
      const response = await createEmployeeUseCase.execute({
        name: 'John Doe',
        role: 'Developer',
        phone: '555-1234',
        workStartTime: '08:00',
        workEndTime: '17:00',
        workDays: [1, 2, 3, 4, 5],
        companyId: 'company-1',
      });

      expect(response).toHaveProperty('id');
      expect(response.name).toBe('John Doe');
      expect(response.active).toBe(true);
    });
  });

  describe('ListEmployeesUseCase', () => {
    it('should list all employees of a company', async () => {
      await createEmployeeUseCase.execute({
        name: 'Employee 1',
        role: 'Developer',
        phone: '555-1111',
        workStartTime: '08:00',
        workEndTime: '17:00',
        workDays: [1, 2, 3, 4, 5],
        companyId: 'company-1',
      });

      await createEmployeeUseCase.execute({
        name: 'Employee 2',
        role: 'Designer',
        phone: '555-2222',
        workStartTime: '09:00',
        workEndTime: '18:00',
        workDays: [1, 2, 3, 4, 5],
        companyId: 'company-1',
      });

      const response = await listEmployeesUseCase.execute({
        companyId: 'company-1',
      });

      expect(response.employees).toHaveLength(2);
      expect(response.employees[0].name).toBe('Employee 1');
    });
  });

  describe('UpdateEmployeeUseCase', () => {
    it('should update employee data', async () => {
      const employee = await createEmployeeUseCase.execute({
        name: 'John',
        role: 'Developer',
        phone: '555-1234',
        workStartTime: '08:00',
        workEndTime: '17:00',
        workDays: [1, 2, 3, 4, 5],
        companyId: 'company-1',
      });

      const response = await updateEmployeeUseCase.execute({
        employeeId: employee.id,
        name: 'John Updated',
        phone: '555-9999',
      });

      expect(response.name).toBe('John Updated');
      expect(response.phone).toBe('555-9999');
    });
  });

  describe('DeactivateEmployeeUseCase', () => {
    it('should deactivate an employee', async () => {
      const employee = await createEmployeeUseCase.execute({
        name: 'John',
        role: 'Developer',
        phone: '555-1234',
        workStartTime: '08:00',
        workEndTime: '17:00',
        workDays: [1, 2, 3, 4, 5],
        companyId: 'company-1',
      });

      const response = await deactivateEmployeeUseCase.execute({
        employeeId: employee.id,
      });

      expect(response.active).toBe(false);
    });
  });
});
