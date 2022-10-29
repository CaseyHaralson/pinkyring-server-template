import express from 'express';
import container from '@pinkyring/di-container/container';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/test', (req, res) => {
  //const service = container.cradle.testService as TestService;
  //const service2 = container
  const service = container.resolveTestService();
  res.send(
    'trying to test the service: ' + service.test('a message from the api')
  );
});

app.get('/test2', (req, res) => {
  const service = container.resolveTestService();
  res.send(service.getData());
});

app.listen(3000, () => {
  console.log('express app listening on port 3000');
});
