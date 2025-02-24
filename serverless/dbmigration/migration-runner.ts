import {Handler} from 'aws-lambda';
import {execFile} from 'child_process';
import path from 'path';

// https://github.com/aws-samples/prisma-lambda-cdk

export const handler: Handler = async (event) => {
  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate
  const command: string = event.command ?? 'deploy';

  let options: string[] = [];

  if (command == 'reset') {
    // skip confirmation and code generation
    options = ['--force', '--skip-generate'];
  }

  // Currently we don't have any direct method to invoke prisma migration programmatically.
  // As a workaround, we spawn migration script as a child process and wait for its completion.
  // Please also refer to the following GitHub issue: https://github.com/prisma/prisma/issues/4703
  try {
    const exitCode = await prismaMigrateWithRetry(command, options, 1);

    if (exitCode != 0)
      throw Error(`command ${command} failed with exit code ${exitCode}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const prismaMigrateWithRetry = async function (
  command: string,
  options: string[],
  retryCount: number
) {
  let exitCode = await prismaMigrate(command, options);

  if (exitCode == 1 && retryCount > 0) {
    exitCode = prismaMigrateWithRetry(command, options, retryCount - 1);
  }

  return exitCode;
};

const prismaMigrate = async function (command: string, options: string[]) {
  const exitCode = await new Promise((resolve) => {
    execFile(
      path.resolve('./node_modules/prisma/build/index.js'),
      ['migrate', command].concat(options),
      (error, stdout) => {
        console.log(stdout);
        if (error != null) {
          console.log(
            `prisma migrate ${command} exited with error ${error.message}`
          );
          resolve(error.code ?? 1);
        } else {
          resolve(0);
        }
      }
    );
  });

  return exitCode;
};
