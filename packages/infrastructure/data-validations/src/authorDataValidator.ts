import {Author} from '@pinkyring/core/dtos/blogPost';
import {object, string} from 'yup';
import {DATA_ACTION} from '@pinkyring/core/dtos/dataActions';
import {IDataValidator} from '@pinkyring/core/interfaces/IDataValidator';
import BaseDataValidator from './baseDataValidator';

export default class AuthorDataValidator
  extends BaseDataValidator
  implements IDataValidator<Author>
{
  async validate(author: Author, action?: DATA_ACTION) {
    const schema = this.getSchema(action);

    await this.throwDataValidationErrorIfInvalid(async () => {
      await schema.validate(author, {
        abortEarly: false,
      });
    });
  }

  getSchema(action?: DATA_ACTION) {
    const def = {
      id: string().optional(),
      name: string()
        .max(191, 'the author name must be shorter than 192 characters')
        .optional(),
    };

    if (action === DATA_ACTION.CREATE) {
      def.name = def.name.required();
    } else if (action === DATA_ACTION.UPDATE) {
      def.id = def.id.required();
    }

    return object(def);
  }
}
