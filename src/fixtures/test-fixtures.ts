import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/pim/EmployeeListPage';
import { AddEmployeePage } from '../pages/pim/AddEmployeePage';
import { EmployeePersonalDetailsPage } from '../pages/pim/EmployeePersonalDetailsPage';
import { EmployeeContactDetailsPage } from '../pages/pim/EmployeeContactDetailsPage';
import { CandidatesPage } from '../pages/recruitment/CandidatesPage';
import { AddCandidatePage } from '../pages/recruitment/AddCandidatePage';

/**
 * Custom test fixture that injects ready-to-use page objects.
 * Tests pull e.g. `addEmployeePage` directly instead of newing them up.
 */
type Pages = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
  addEmployeePage: AddEmployeePage;
  personalDetailsPage: EmployeePersonalDetailsPage;
  contactDetailsPage: EmployeeContactDetailsPage;
  candidatesPage: CandidatesPage;
  addCandidatePage: AddCandidatePage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  personalDetailsPage: async ({ page }, use) => {
    await use(new EmployeePersonalDetailsPage(page));
  },
  contactDetailsPage: async ({ page }, use) => {
    await use(new EmployeeContactDetailsPage(page));
  },
  candidatesPage: async ({ page }, use) => {
    await use(new CandidatesPage(page));
  },
  addCandidatePage: async ({ page }, use) => {
    await use(new AddCandidatePage(page));
  },
});

export { expect } from '@playwright/test';
