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
- run "npm run test:watch" in the other

Installing new npm packages to a workspace package:
- run "npm install _package_ --save -w packages/_workspace_package_name_"

For prisma:
- need to make a .env file in the interface-implementations package
- can copy the .env.example file and fill in the values

Removing docker volumes created during docker compose:
- docker compose -f __composefile.yml__ up -d
- docker compose -f __composefile.yml__ down -v

