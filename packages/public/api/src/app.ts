import express from 'express';
import TestService from '@pinkyring/core/services/testService';

const app = express();

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/test', (req, res) => {
  const service = new TestService();
  res.send('trying to test the service: ' + service.test('a message from the api'));
});

app.listen(3000, () => {
  console.log('express app listening on port 3000');
});