import {Author} from '@pinkyring/core/dtos/blogPost';
import {object, string} from 'yup';
import {DATA_ACTION} from '@pinkyring/core/dtos/dataActions';
import {IDataValidator} from '@pinkyring/core/interfaces/IDataValidator';
import BaseDataValidator from './baseDataValidator';
import {AUTHOR_NAME_LENGTH_MAX} from './messages';

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
      name: string().max(191, AUTHOR_NAME_LENGTH_MAX).optional(),
    };

    if (action === DATA_ACTION.CREATE) {
      def.name = def.name.required();
    } else if (action === DATA_ACTION.UPDATE) {
      def.id = def.id.required();
    }

    return object(def);
  }
}
