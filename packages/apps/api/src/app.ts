import express from 'express';
import container from '@pinkyring/di-container/container';

const app = express();
app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.get('/test', (req, res) => {
  const service = container.resolveTestService();
  res.send(
    'trying to test the service: ' + service.test('a message from the api')
  );
});

app.get('/test2', (req, res) => {
  const service = container.resolveTestService();
  res.send(service.getData());
});

app.get('/todo', async (req, res) => {
  const service = container.resolveTodoService();
  res.send(await service.getTodos());
});

app.post('/todo/create', async (req, res) => {
  const service = container.resolveTodoService();
  res.send(await service.createTodo(req.body));
});

app.post('/todo/update', async (req, res) => {
  const service = container.resolveTodoService();
  res.send(await service.updateTodo(req.body));
});

app.post('/todo/markComplete', async (req, res) => {
  const service = container.resolveTodoService();
  res.send(await service.markTodoCompleted(req.body));
});

app.post('/todo/:id/delete', async (req, res) => {
  const service = container.resolveTodoService();
  res.send(await service.deleteTodo(req.params.id));
});

app.listen(3000, () => {
  console.log('express app listening on port 3000');
});
