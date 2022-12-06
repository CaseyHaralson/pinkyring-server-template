import {Author} from '@pinkyring/core/dtos/blogPost';
import {object, string} from 'yup';

export default class AuthorDataValidator implements IDataValidator<Author> {
  // test the validation and see what that looks like
  // and test that you can override the schema depending on circumstance
  validate(author: Author, circumstance: CIRCUMSTANCE) {
    const schema = this.getSchema(circumstance);
    schema.validate(author);
  }

  private getSchema(circumstance: CIRCUMSTANCE) {
    const test = {
      id: string(),
      name: string(),
    };

    if (circumstance === BASE_CIRCUMSTANCE.CREATE) {
      test.id = test.id.optional();
      test.name = test.name.required();
    } else if (circumstance === BASE_CIRCUMSTANCE.UPDATE) {
      test.id = test.id.required();
      test.name = test.name.optional();
    }

    return object(test);
  }

  private test() {
    const author = {
      name: 'some author',
    } as Author;

    this.validate(author, BASE_CIRCUMSTANCE.CREATE);
  }
}

// put this in the interfaces
export interface IDataValidator<T> {
  validate(t: T, circumstance: CIRCUMSTANCE): void;
}

// put these in DTOs
export enum BASE_CIRCUMSTANCE {
  CREATE = 'BASE_CIRCUMSTANCE.CREATE',
  UPDATE = 'BASE_CIRCUMSTANCE.UPDATE',
  DELETE = 'BASE_CIRCUMSTANCE.DELETE',
}

export enum EXTENDED_CIRCUMSTANCE {
  SPECIFIC_UPDATE = 'EXTENDED_CIRCUMSTANCE.SPECIFIC_UPDATE',
}

export type CIRCUMSTANCE = BASE_CIRCUMSTANCE | EXTENDED_CIRCUMSTANCE;
