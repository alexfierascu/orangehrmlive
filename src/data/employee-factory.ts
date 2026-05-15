import { faker } from '@faker-js/faker';

/**
 * Generates an employee with realistic Faker-driven names + a guaranteed-unique
 * Employee Id. We don't let Faker pick the ID because OrangeHRM rejects
 * duplicates and caps the field at 10 characters.
 */
export type Employee = {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
};

export function generateEmployee(overrides: Partial<Employee> = {}): Employee {
  // OrangeHRM caps Employee Id at 10 chars; 8 timestamp+random chars stay safely under.
  const stamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).slice(2, 4);
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName().slice(0, 1), // single letter, like "T."
    lastName: faker.person.lastName(),
    employeeId: `${stamp}${random}`,
    ...overrides,
  };
}

export function generatePhoneNumber(): string {
  return faker.string.numeric(11);
}

export function generateWorkEmail(): string {
  return faker.internet.email({ provider: 'example.com' }).toLowerCase();
}
