# <%= projectName %>

This project was created with the Pinkyring project creator.
Please check that documentation to create another project or to remove pre-installed code from this project.
https://github.com/CaseyHaralson/pinkyring

This project comes with the following:
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
- Prisma ORM
- Winston Logging
- Cron maintenance jobs
- An event bus/queue

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

The **apps packages** expose the functionality of the project. These are things that have to run, like endpoint servers, event listeners, or chron jobs. They ask the dependency container for objects.

## Getting Started
Note: you will need docker installed.

### Run Everything Locally
1. Install dependencies:

`npm install`

2. Build everything, create the database, and run the apps:

`npm run everything`

### Exploring Everything


## Development Mode




First time you run:
- run "docker compose -f pre-start.yml up"
- then run "docker compose up -d"

To make code changes:
- run "npm install"
  - this can't be used from inside docker because the workspace node_modules packages need to be symlinked and that can't happen from inside docker
  - will need node installed

To watch test code changes, you will need to open two terminals:
- run "npm run build:watch" in one
- run "npm run test:unit:watch" in the other (this will only rerun tests after a test file changes)

Installing new npm packages to a workspace package:
- run "npm install _npm_package_ --save -w packages/_workspace_package_name_"

For prisma:
- need to make a .env file in the interface-implementations package
- can copy the .env.example file and fill in the values

Removing docker volumes created during docker compose:
- docker compose -f __composefile.yml__ up -d
- docker compose -f __composefile.yml__ down -v

Rebuilding container with compose (build and recreate after the up):
- docker compose up --build --force-recreate -d

VS Code typescript intellisense isn't working after some change:
- when you have a typescript file open, open the command palette (ctrl + shift + p)
- TypeScript: Restart TS server

To run the api package:
- change directory to the api package project
- run "npm run start"

Apps can ask for services and utils exposed by the di-container.
Anything internal can ask for things via their class constructor and the di-container will inject the correct thing at runtime.

Idempotent requests are requests that need to only have an effect once, but will return the same result every time they are called.
Idempotent requests should be as small as possible too.


