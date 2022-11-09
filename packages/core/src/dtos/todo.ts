export interface Todo {
  id?: string;
  text: string;
  completed: boolean;

  createdDt?: string;
  completedDt?: string;
}

//import {Todo as test} from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
//export interface Todo extends test {}
