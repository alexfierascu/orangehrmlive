import { test, expect } from '../../src/fixtures/test-fixtures';
import { createEmployee } from '../../src/data/setup-helpers';
import { Employee } from '../../src/data/employee-factory';

test.describe('PIM — Employee List', () => {
  let seeded: Employee;

  // Each test gets its own employee so it doesn't depend on demo-seeded data
  // (which other concurrent users may also be touching).
  test.beforeEach(async ({ addEmployeePage, personalDetailsPage }) => {
    const { employee } = await createEmployee(addEmployeePage, personalDetailsPage);
    seeded = employee;
  });

  test('searches by employee name (autocomplete) and finds the employee', async ({
    employeeListPage,
  }) => {
    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    // Full name (not just first) so the autocomplete narrows to our seeded
    // employee rather than colliding with other "Sarah"s/"John"s on the demo.
    await employeeListPage.searchByEmployeeName(`${seeded.firstName} ${seeded.lastName}`);

    await expect(employeeListPage.resultRows.first()).toContainText(seeded.firstName);
    await expect(employeeListPage.resultRows.first()).toContainText(seeded.lastName);
  });

  test('searches by employee id and returns exactly one row', async ({ employeeListPage }) => {
    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(seeded.employeeId);

    await expect(employeeListPage.resultRows).toHaveCount(1);
    await expect(employeeListPage.resultRows.first()).toContainText(seeded.employeeId);
  });

  test('reset clears the filter and restores the full list', async ({ employeeListPage }) => {
    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(seeded.employeeId);
    // expect.poll retries the function until it matches; getResultCount() is a
    // one-shot DOM read, and the count text re-renders a tick after the spinner
    // hides — without polling we sometimes capture the stale unfiltered count.
    await expect.poll(() => employeeListPage.getResultCount()).toBe(1);

    await employeeListPage.reset();
    await expect(employeeListPage.employeeIdInput).toHaveValue('');
    await expect.poll(() => employeeListPage.getResultCount()).toBeGreaterThan(1);
  });
});
