import {expect, test} from '@jest/globals';
import TestRepository from '@pinkyring/core/interfaces/testRepository';
import TestService from '@pinkyring/core/services/testService';

test('returns a test messsage', () => {
  const s = new TestService(new Object() as TestRepository);
  expect(s.test('test')).toBe('got the message: test2');
});
