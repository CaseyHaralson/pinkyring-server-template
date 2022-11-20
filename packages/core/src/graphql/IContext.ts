import {Author} from '../dtos/blogPost';
import Principal from '../dtos/principal';
import BlogService from '../services/blogService';
import {IDataLoader} from './IDataLoader';

export interface IContext {
  principal: Principal;
  blogService: BlogService;
  authorLoader: IDataLoader<Author>;
}
