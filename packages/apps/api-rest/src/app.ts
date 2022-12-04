import express from 'express';
import container from '@pinkyring/di-container/container';
import {EventType, EVENT_BUS_NAME} from '@pinkyring/core/dtos/events';

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

app.get('/authors', async (req, res) => {
  const service = container.resolveBlogService();
  const principal = container.resolvePrincipalResolver().resolve();
  res.send(await service.getAuthors(principal, {}));
});

app.get('/blogposts', async (req, res) => {
  const service = container.resolveBlogService();
  const principal = container.resolvePrincipalResolver().resolve();
  res.send(await service.getBlogPosts(principal, {}));
});

app.post('/event/queue/new', async (req, res) => {
  const newQueueName = req.body.name || req.query.name;
  if (newQueueName === undefined) {
    res.status(400).send({
      message: `the queue name wasn't set`,
    });
  }

  const eventHelper = container.resolveEventHelper();
  res.send(
    await eventHelper.createQueue(
      newQueueName,
      EVENT_BUS_NAME,
      EventType.BLOG_POST_ADDED
    )
  );
});

app.post('/event/:queuename/grab', async (req, res) => {
  const queueName = req.params.queuename;
  if (queueName === undefined) {
    res.status(400).send({
      message: `the queue name wasn't set`,
    });
  }

  const eventHelper = container.resolveEventHelper();
  const numEventsInQueue = await eventHelper.getNumEventsInQueue(queueName);
  const event = await eventHelper.getEventFromQueue(queueName);

  res.send({
    approximateNumEventsInQueue: numEventsInQueue,
    event: event,
  });
});

app.listen(port, () => {
  console.log(`express app listening on port ${port}`);
});
