import {BlogPost} from '@pinkyring/core/dtos/blogPost';
import {DATA_ACTION} from '@pinkyring/core/dtos/dataActions';
import {IDataValidator} from '@pinkyring/core/interfaces/IDataValidator';
import {object, string} from 'yup';
import BaseDataValidator from './baseDataValidator';

export default class BlogPostDataValidator
  extends BaseDataValidator
  implements IDataValidator<BlogPost>
{
  async validate(blogPost: BlogPost, action?: DATA_ACTION) {
    const schema = this.getSchema(action);

    await this.throwDataValidationErrorIfInvalid(async () => {
      await schema.validate(blogPost, {
        abortEarly: false,
      });
    });
  }

  getSchema(action?: DATA_ACTION) {
    const def = {
      id: string().optional(),
      title: string()
        .max(191, 'the title must be shorter than 192 characters')
        .optional(),
      text: string().optional(),
      authorId: string().optional(),
    };

    if (action === DATA_ACTION.CREATE) {
      def.title = def.title.required();
      def.text = def.text.required();
      def.authorId = def.authorId.required();
    } else if (action === DATA_ACTION.UPDATE) {
      def.id = def.id.required();
    }

    return object(def);
  }
}
