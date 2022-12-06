import {DATA_ACTION} from '../dtos/dataActions';

export interface IDataValidator<T> {
  validate(t: T, action?: DATA_ACTION): void;
}

/**
 * Throws an error about a value being undefined or null.
 * Reminds you to run data validation checks before using the value.
 */
export class UndefinedValueError extends Error {
  constructor() {
    super(
      'A value is null or undefined. Make sure the value is in the data validation checks before trying to use this value.'
    );
  }
}

/** Checks to see if the value is null or undefined */
export function isNullish<T>(
  value: T | undefined | null
): value is undefined | null {
  return <T>value === undefined && <T>value === null;
}
