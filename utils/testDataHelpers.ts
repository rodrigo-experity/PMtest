/**
 * Test Data Helper Functions
 *
 * Utilities for generating random test data for patient registration tests
 */

/**
 * Generate a random date of birth between 1980 and 2000
 * @returns Date string in MM/DD/YYYY format
 */
export function generateRandomDOB(): string {
  const year = Math.floor(Math.random() * (2000 - 1980 + 1)) + 1980;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid invalid dates
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
}

/**
 * Generate a random patient with matching first name and sex
 * @returns Object with firstName and sex properties
 */
export function generateRandomPatient(): { firstName: string; sex: 'Male' | 'Female' } {
  const maleNames = ['John', 'Michael', 'David', 'Robert', 'James'];
  const femaleNames = ['Jane', 'Sarah', 'Emily', 'Lisa', 'Mary'];

  const isMale = Math.random() < 0.5;

  if (isMale) {
    return {
      firstName: maleNames[Math.floor(Math.random() * maleNames.length)],
      sex: 'Male'
    };
  } else {
    return {
      firstName: femaleNames[Math.floor(Math.random() * femaleNames.length)],
      sex: 'Female'
    };
  }
}
