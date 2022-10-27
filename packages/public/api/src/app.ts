import express from 'express';
import TestService from '@pinkyring/core/services/testService';
import container from '@pinkyring/di-container/container'

const app = express();

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/test', (req, res) => {
  //const service = container.cradle.testService as TestService;
  //const service2 = container
  const service = container.resolveTestService();
  res.send('trying to test the service: ' + service.test('a message from the api'));
});

app.listen(3000, () => {
  console.log('express app listening on port 3000');
});