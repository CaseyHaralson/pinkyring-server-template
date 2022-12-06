import {Author} from '@pinkyring/core/dtos/blogPost';
import {object, ObjectSchema, string} from 'yup';
import {BASE_DATA_ACTIONS, DATA_ACTION} from '@pinkyring/core/dtos/dataActions';
import {IDataValidator} from '@pinkyring/core/interfaces/IDataValidator';

export default class AuthorDataValidator implements IDataValidator<Author> {
  // test the validation and see what that looks like
  validate(author: Author, action?: DATA_ACTION) {
    const schema: ObjectSchema<Author> = this.getSchema(action);
    schema.validate(author, {
      abortEarly: false,
    });
  }

  private getSchema(action?: DATA_ACTION) {
    const def = {
      id: string().optional(),
      name: string().optional(),
    };

    if (action === BASE_DATA_ACTIONS.CREATE) {
      def.name = def.name.required();
    } else if (action === BASE_DATA_ACTIONS.UPDATE) {
      def.id = def.id.required();
    }

    return object(def);
  }
}
