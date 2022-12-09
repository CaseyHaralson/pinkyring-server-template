var shell = require('shelljs');

const args = process.argv;
// console.log(args);

if (args.length < 3) {
  throw new Error(
    'Missing prisma command. This script is used like: "npm run prisma <command>"'
  );
}

const argString = args.slice(2).join(' ');
// console.log(argString);

const commandsThatDontNeedLocalEnv = ['db seed'];
let makeLocalEnvFile = true;
if (commandsThatDontNeedLocalEnv.includes(argString.toLowerCase())) {
  makeLocalEnvFile = false;
}

if (makeLocalEnvFile) {
  // copy the .env file from the parent to the prisma folder
  // sometimes prisma needs the local .env file, and sometimes it doesn't
  //console.log(`copying the .env file from the parent to the prisma folder`);
  shell.exec(`cd ../ && npm run prisma:env`);
}

// run the prisma command
//console.log(`running the prisma command "npx prisma ${argString}"`);
shell.exec(`cd ../ && npx prisma ${argString}`);

if (makeLocalEnvFile) {
  // delete the prisma .env file
  //console.log(`removing the prisma .env file`);
  shell.exec(`cd ../ && npm run prisma:env:remove`);
}
