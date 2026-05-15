import { faker } from '@faker-js/faker';

export type Candidate = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  contactNumber: string;
};

export function generateCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName().slice(0, 1),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'example.com' }).toLowerCase(),
    contactNumber: faker.string.numeric(10),
    ...overrides,
  };
}
