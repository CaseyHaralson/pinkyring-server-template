export interface Todo {
  id?: string;
  text: string;
  completed: boolean;

  createdDt?: string;
  completedDt?: string;
}

//import {Todo as test} from '@prisma/client';

//export interface Todo extends test {}
