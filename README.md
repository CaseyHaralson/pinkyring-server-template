# <%= projectName %>

This project was created with the Pinkyring project creator.
Please check that documentation to create another project or to remove some pre-installed code from this project.
https://github.com/CaseyHaralson/pinkyring

This project comes with the following as a starting point:

- Github Workflows
  - CodeQL Analysis
  - Serverless Framework Deploy and Teardown into AWS
  - CI with unit and integration tests, and style/linting checks
- Serverless Framework
  - Configuration to deploy the following to AWS:
    - REST Lambdas
    - GraphQL Lambda
    - DB Migration Dockerfile/Lambda with Prisma
    - Mysql Serverless Aurora RDS
    - SNS Topic to automatic and manual pull SQS Queue
- Code Style Rules
  - ESLint
  - Prettier
- REST Endpoints
- Graphql Endpoint
- Prisma Database Stuff
- Winston Logging
- Cron maintenance jobs
- Event bus/queue interactions

## Project Structure

The project is structured around the principals of the onion/hexagonal architecture.
It uses npm workspaces to separate functionality into different packages.

- https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/
- https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)

Basically, the **core package** has no external dependencies and defines the interfaces that it will need implemented. These are services and core business logic that wouldn't change if there were infrastructure changes.

The **infrastructure packages** implement the interfaces defined in the core.
These packages give access to repositories, logging frameworks, etc.
External dependencies will probably be utilized in these packages.

The **dependency container** ties the core and infrastructure packages together.
This package knows everything about how things are tied together and can give different interface implementations based on environments or other rules.

The **apps packages** expose the functionality of the project. These are things that need to run, like endpoint servers, event listeners, or chron jobs. They ask the dependency container for objects.

## Getting Started

Note: you will need docker installed and running.

### Run Everything Locally

1. Install dependencies:

`npm install`

2. Build everything, create the database, and run the apps:

`npm run everything`

3. When you are finished exploring:

`npm run everything:stop`

### Exploring Everything

After docker has everything running, you should have access to the following services:

- Graphql Server: http://localhost:4000/graphql
  - queries and mutations
  - note: create a new blog post here to trigger events
- Rest Server:
  - Hello world: http://localhost:3000/
  - Get authors: http://localhost:3000/authors
  - Get blog posts: http://localhost:3000/blogposts
  - Several event endpoints (maybe not as useful as the true event listener below)
    - Create a queue to listen to new blog post events
      - Post to: http://localhost:3000/event/queue/new
      - with "name" as a query param or in the body (name=new.queue)
    - Pick up an event from the queue you just created
      - Post to: http://localhost:3000/event/:queuename/grab
      - this is a post request because it changes the system
- An event listener that is triggered from new blog post events
  - Open the running docker container and look at the logs to see the event action
- A cron jobs service running maintenance jobs
  - Open the running docker container and look at the logs to see the action

## Development Mode

Note: you will need docker installed and running.

### Setup

1. Install dependencies:

`npm install`

2. Build project:

`npm run build`

3. Create the local .env file:

`npm run generate:env`

4. Run the infrastructure:

`npm run infra`

5. Generate database stuff:
    1. Generate prisma client locally (to make sure it matches your environment): `npm run prisma generate`
    2. Deploy the database schema: `npm run prisma migrate deploy`
    3. Seed the database: `npm run prisma db seed`

6. Navigate to one of the apps packages (packages/apps/api-graphql for example) and then run start:

`npm run start`

### Making Changes

#### Core Services
The BlogService in the core/services folder is an example of selecting and modifying data. The addBlogPost function also has an example of publishing an event.

Everything in the project revolves around the core services so this is a good place to start for looking at how things connect.

#### Security Principal
The security principal object is defined in the core/interfaces folder. This is just a sketched in object for you to change to your situation.

There is a security principal resolver in the infrastructure/util package. This package can be used to install external dependencies so you can resolve security objects that work with your system.

#### Session
The session is currently used as a way of passing data around for logging. The ISession interface in the core/interfaces folder defines what data is in the session. The SessionHandler in the infrastructure/util package is creating and serving out session data.

#### Idempotent Requests
The idempotent request helper will take a requestId from the client and save the result of the request. It will then return that same result if it receives that requestId again. The request is unique by a combination of principal, service, function, and requestId.

#### Graphql
The main Graphql files are in the core/graphql folder. The schema file defines the types and resolvers. The IContext file is used to load necessary services and objects into the resolvers. And, lastly, the IDataLoader can be used for data and batch loading objects.

The graphql apps will need to reference the type/resolvers and load the IContext object. An example app is provided.

#### Events
Events are a way that the services can handle some things asynchronously. They are defined in the core/dtos folder. They are also a way that some external service can get access to what is happening in the project.

## Published Package
The project can publish several things to help other projects interface with it. The core/dtos folder and the infrastructure/data-validations packages can be published which will give access to:
- the different object types the project is expecting
- data validations for the different objects
- the events that are published




Notes for later:

- core, no dependencies, using orm...
- principal
- things internal to the project need to implement baseclass and services need to implement baseservice.
- things internal to the project get their dependencies resolved by the di container, things external to the project can use one of the specialized functions defined by the di container
-



Installing new npm packages to a workspace package:

- run "npm install _npm_package_ --save -w packages/_workspace_package_name_"


VS Code typescript intellisense isn't working after some change:

- when you have a typescript file open, open the command palette (ctrl + shift + p)
- TypeScript: Restart TS server


Apps can ask for services and utils exposed by the di-container.
Anything internal can ask for things via their class constructor and the di-container will inject the correct thing at runtime.

Idempotent requests are requests that need to only have an effect once, but will return the same result every time they are called.
Idempotent requests should be as small as possible too.
