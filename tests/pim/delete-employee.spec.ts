import { test, expect } from '../../src/fixtures/test-fixtures';
import { createEmployee } from '../../src/data/setup-helpers';

test.describe('PIM — Delete Employee', () => {
  test('deletes an employee via confirmation dialog and they no longer appear in search', async ({
    addEmployeePage,
    personalDetailsPage,
    employeeListPage,
  }) => {
    const { employee } = await createEmployee(addEmployeePage, personalDetailsPage);

    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(employee.employeeId);
    await expect(employeeListPage.resultRows).toHaveCount(1);

    await employeeListPage.deleteFirstResult(true);

    await employeeListPage.searchByEmployeeId(employee.employeeId);
    // OrangeHRM renders "No Records Found" when a search returns zero rows.
    await expect(employeeListPage.resultRows).toHaveCount(0);
  });

  test('cancelling the delete confirmation keeps the employee', async ({
    addEmployeePage,
    personalDetailsPage,
    employeeListPage,
  }) => {
    const { employee } = await createEmployee(addEmployeePage, personalDetailsPage);

    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(employee.employeeId);

    await employeeListPage.deleteFirstResult(false);

    await expect(employeeListPage.resultRows).toHaveCount(1);
    await expect(employeeListPage.resultRows.first()).toContainText(employee.employeeId);
  });
});
