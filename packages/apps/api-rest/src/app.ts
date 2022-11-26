import express from 'express';
import container from '@pinkyring/di-container/container';

// ======================================
// Get configurations
const CONFIGKEYNAME_APPS_EXPRESS_PORT = 'APPS_EXPRESS_PORT';
const configHelper = container.resolveConfigHelper();
configHelper.registerNeededConfigurations([
  {
    name: CONFIGKEYNAME_APPS_EXPRESS_PORT,
  },
]);
const configPort = Number(
  configHelper.getConfigValue(CONFIGKEYNAME_APPS_EXPRESS_PORT)
);
const port = configPort != 0 ? configPort : 3000;
// ======================================

// create an express server
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
  const searchText = req.query.searchText;
  const service = container.resolveTodoService();
  res.send(await service.getTodos(searchText as string));
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

app.listen(port, () => {
  console.log(`express app listening on port ${port}`);
});
