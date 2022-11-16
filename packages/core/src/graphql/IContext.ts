import {Author} from '../dtos/blogPost';
import BlogService from '../services/blogService';
import {IDataLoader} from './IDataLoader';

export interface IContext {
  blogService: BlogService;
  authorLoader: IDataLoader<Author>;
}
