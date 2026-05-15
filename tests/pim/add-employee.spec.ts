import { test, expect } from '../../src/fixtures/test-fixtures';
import { generateEmployee } from '../../src/data/employee-factory';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { env } from '../../src/config/env';

test.describe('PIM — Add Employee', () => {
  test.beforeEach(async ({ addEmployeePage }) => {
    await addEmployeePage.goto();
    await addEmployeePage.expectLoaded();
  });

  test('creates an employee with first + last name and lands on Personal Details', async ({
    addEmployeePage,
    personalDetailsPage,
  }) => {
    const employee = generateEmployee();

    await addEmployeePage.fillName(employee.firstName, employee.lastName);
    await addEmployeePage.save();

    await personalDetailsPage.expectLoaded();
    await expect(personalDetailsPage.firstNameInput).toHaveValue(employee.firstName);
    await expect(personalDetailsPage.lastNameInput).toHaveValue(employee.lastName);
  });

  test('creates an employee with first/middle/last name and a custom employee id', async ({
    addEmployeePage,
    personalDetailsPage,
  }) => {
    const employee = generateEmployee();

    await addEmployeePage.fillName(employee.firstName, employee.lastName, employee.middleName);
    await addEmployeePage.setEmployeeId(employee.employeeId);
    await addEmployeePage.save();

    await personalDetailsPage.expectLoaded();
    await expect(personalDetailsPage.middleNameInput).toHaveValue(employee.middleName);
    await expect(personalDetailsPage.employeeIdInput).toHaveValue(employee.employeeId);
  });

  test('auto-populates the employee id when the form opens', async ({ addEmployeePage }) => {
    // expectLoaded() already waits for a non-empty value; assert numeric shape too.
    await expect(addEmployeePage.employeeIdInput).toHaveValue(/^\d+$/);
  });

  test('shows required-field validation when first/last name are empty', async ({
    addEmployeePage,
  }) => {
    await addEmployeePage.save();

    // First and last name are both required → two "Required" errors.
    // Filter to "Required" specifically so an unrelated error like
    // "Employee Id already exists" (auto-id collision on the shared demo)
    // doesn't inflate the count.
    const requiredErrors = addEmployeePage.fieldErrors.filter({ hasText: /required/i });
    await expect(requiredErrors).toHaveCount(2);
  });

  test('newly created employee is searchable in the employee list', async ({
    addEmployeePage,
    personalDetailsPage,
    employeeListPage,
  }) => {
    const employee = generateEmployee();

    await addEmployeePage.fillName(employee.firstName, employee.lastName);
    await addEmployeePage.setEmployeeId(employee.employeeId);
    await addEmployeePage.save();
    await personalDetailsPage.expectLoaded(); // wait for post-save redirect before navigating away

    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(employee.employeeId);

    await expect(employeeListPage.resultRows).toHaveCount(1);
    await expect(employeeListPage.resultRows.first()).toContainText(employee.firstName);
    await expect(employeeListPage.resultRows.first()).toContainText(employee.lastName);
  });

  test('creates an employee with login details and the new user can sign in', async ({
    addEmployeePage,
    personalDetailsPage,
    browser,
  }) => {
    const employee = generateEmployee();
    const username = `auto.${Date.now()}`;
    const password = 'TestPass123!';

    await addEmployeePage.fillName(employee.firstName, employee.lastName);
    await addEmployeePage.enableLoginDetails(username, password);
    await addEmployeePage.save();
    await personalDetailsPage.expectLoaded();

    // Verify the new credentials work in a fresh, unauthenticated browser context.
    // browser.newContext() does NOT inherit baseURL from the project's `use`
    // block, so we pass it explicitly.
    const newContext = await browser.newContext({
      baseURL: env.baseUrl,
      storageState: { cookies: [], origins: [] },
    });
    const newPage = await newContext.newPage();
    try {
      const login = new LoginPage(newPage);
      const dashboard = new DashboardPage(newPage);
      await login.goto();
      await login.expectLoaded();
      await login.login(username, password);
      await dashboard.expectLoaded();
    } finally {
      await newContext.close();
    }
  });
});
