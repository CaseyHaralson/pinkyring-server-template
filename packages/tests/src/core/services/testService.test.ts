import {expect, test} from '@jest/globals';
import ITestRepository from '@pinkyring/core/interfaces/ITestRepository';
import TestService from '@pinkyring/core/services/testService';

test('returns a test messsage', () => {
  const s = new TestService(new Object() as ITestRepository);
  expect(s.test('test')).toBe('got the message: test');
});
