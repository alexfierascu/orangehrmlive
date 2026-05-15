import { faker } from '@faker-js/faker';
import { test, expect } from '../../src/fixtures/test-fixtures';
import { createEmployee } from '../../src/data/setup-helpers';
import { generatePhoneNumber, generateWorkEmail } from '../../src/data/employee-factory';

test.describe('PIM — Edit Employee', () => {
  test('updates personal details (other id + license number) and changes persist', async ({
    page,
    addEmployeePage,
    personalDetailsPage,
  }) => {
    await createEmployee(addEmployeePage, personalDetailsPage);

    const otherId = faker.string.alphanumeric(8).toUpperCase();
    const license = `LIC-${faker.string.alphanumeric(6).toUpperCase()}`;

    await personalDetailsPage.otherIdInput.click();
    await personalDetailsPage.otherIdInput.pressSequentially(otherId);
    await personalDetailsPage.licenseNumberInput.click();
    await personalDetailsPage.licenseNumberInput.pressSequentially(license);
    await personalDetailsPage.savePersonalDetails();

    await page.reload();
    await personalDetailsPage.expectLoaded();
    await expect(personalDetailsPage.otherIdInput).toHaveValue(otherId);
    await expect(personalDetailsPage.licenseNumberInput).toHaveValue(license);
  });

  test('adds contact details (mobile + work email) and changes persist', async ({
    page,
    addEmployeePage,
    personalDetailsPage,
    contactDetailsPage,
  }) => {
    const { empNumber } = await createEmployee(addEmployeePage, personalDetailsPage);

    const mobile = generatePhoneNumber();
    const workEmail = generateWorkEmail();

    await contactDetailsPage.gotoFor(empNumber);
    await contactDetailsPage.expectLoaded();
    // Use real keystrokes (pressSequentially) instead of fill: the Vue
    // v-model on these inputs doesn't update via Playwright's fill events.
    await contactDetailsPage.mobileInput.click();
    await contactDetailsPage.mobileInput.pressSequentially(mobile);
    await contactDetailsPage.workEmailInput.click();
    await contactDetailsPage.workEmailInput.pressSequentially(workEmail);
    await contactDetailsPage.save();

    await page.reload();
    await contactDetailsPage.expectLoaded();
    await expect(contactDetailsPage.mobileInput).toHaveValue(mobile);
    await expect(contactDetailsPage.workEmailInput).toHaveValue(workEmail);
  });

  test('edits an employee from the employee list (pencil icon → personal details)', async ({
    page,
    addEmployeePage,
    personalDetailsPage,
    employeeListPage,
  }) => {
    const { employee } = await createEmployee(addEmployeePage, personalDetailsPage);
    const otherId = faker.string.alphanumeric(8).toUpperCase();

    await employeeListPage.goto();
    await employeeListPage.expectLoaded();
    await employeeListPage.searchByEmployeeId(employee.employeeId);
    await expect(employeeListPage.resultRows).toHaveCount(1);

    await employeeListPage.editFirstResult();
    await personalDetailsPage.expectLoaded();
    await expect(personalDetailsPage.firstNameInput).toHaveValue(employee.firstName);

    await personalDetailsPage.otherIdInput.click();
    await personalDetailsPage.otherIdInput.pressSequentially(otherId);
    await personalDetailsPage.savePersonalDetails();

    await page.reload();
    await personalDetailsPage.expectLoaded();
    await expect(personalDetailsPage.otherIdInput).toHaveValue(otherId);
  });
});
