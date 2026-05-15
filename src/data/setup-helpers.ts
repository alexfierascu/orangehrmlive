import { AddEmployeePage } from '../pages/pim/AddEmployeePage';
import { EmployeePersonalDetailsPage } from '../pages/pim/EmployeePersonalDetailsPage';
import { Employee, generateEmployee } from './employee-factory';

/**
 * Creates a fresh employee through the UI and returns the data used + the
 * empNumber assigned by the server. Centralised so each test isn't repeating
 * the same five lines of arrange-step setup.
 */
export async function createEmployee(
  addEmployeePage: AddEmployeePage,
  personalDetailsPage: EmployeePersonalDetailsPage,
  overrides: Partial<Employee> = {},
): Promise<{ employee: Employee; empNumber: string }> {
  const employee = generateEmployee(overrides);

  await addEmployeePage.goto();
  await addEmployeePage.expectLoaded();
  await addEmployeePage.fillName(employee.firstName, employee.lastName, employee.middleName);
  await addEmployeePage.setEmployeeId(employee.employeeId);
  await addEmployeePage.save();
  await personalDetailsPage.expectLoaded();

  return { employee, empNumber: await personalDetailsPage.empNumber() };
}
