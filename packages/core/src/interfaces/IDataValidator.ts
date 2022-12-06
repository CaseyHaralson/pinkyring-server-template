import {DATA_ACTION} from '../dtos/dataActions';

/** Interface for running validations against a type */
export interface IDataValidator<T> {
  /**
   * Validate the type with respect to some data action being performed.
   * An exception is thrown if the type doesn't pass the validation.
   * @param t the type to validate
   * @param action the action that wants to be performed on the type after the validation is performed
   */
  validate(t: T, action: DATA_ACTION): void;
}

/**
 * Throws an error about a value being undefined or null.
 * Reminds you to run data validation checks before using the value.
 */
export class UndefinedValueError extends Error {
  constructor() {
    super(
      'A value is null or undefined. Make sure the value is in the data validation checks and you run validations before trying to use this value.'
    );
  }
}

/** Checks to see if the value is null or undefined */
export function isNullish<T>(
  value: T | undefined | null
): value is undefined | null {
  return <T>value === undefined && <T>value === null;
}
