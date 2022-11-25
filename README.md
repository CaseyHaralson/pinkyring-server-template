# pinkyring

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


