import {DataValidationError} from '@pinkyring/core/interfaces/IDataValidator';
import {ValidationError} from 'yup';

export default class BaseDataValidator {
  protected async throwDataValidationErrorIfInvalid<T>(func: () => Promise<T>) {
    try {
      await func();
    } catch (e) {
      if (e instanceof ValidationError) {
        throw new DataValidationError(e.errors);
      }
      throw e;
    }
  }
}
