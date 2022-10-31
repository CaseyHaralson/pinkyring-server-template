import {expect, test} from '@jest/globals';
import TestRepository from '@pinkyring/core/interfaces/todoRepository';
import TestService from '@pinkyring/core/services/todoService';

test('returns a test messsage', () => {
  const s = new TestService(new Object() as TestRepository);
  expect(s.test('test')).toBe('got the message: test');
});
