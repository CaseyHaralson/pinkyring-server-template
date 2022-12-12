import chalk from "chalk";
import inquirer, { Answers } from "inquirer";

// function test() {
//   console.log(`process cwd: ${process.cwd()}`);
//   console.log(`current dir: ${__dirname}`);
//   console.log(chalk.green(`test from inside the template`));
// }

// test();

// const QUESTIONS = [
//   {
//     name: "action",
//     type: "list",
//     message: "What would you like to remove?",
//     choices: ["ACTION_NEW_PROJECT", "ACTION_EDIT_PROJECT"],
//   },
// ];

export function editTemplate(rootDir: string) {
  const questions = buildQuestions();
  inquirer.prompt(questions).then((answers: Answers) => {
    const action = answers["action"];
    console.log(chalk.green(`chosen action: ${action}`));
  });
}

function getPinkyringFilePath(rootDir: string) {

}

function buildQuestions() {
  const questions = [
    {
      name: "action",
      type: "list",
      message: "What would you like to remove?",
      choices: buildRemovalChoices(),
    },
  ];
  return questions;
}

function buildRemovalChoices() {
  const allChoices = [
    "SERVERLESS",
    "GITHUB WORKFLOWS",
    "GRAPHQL",
    "REST ENDPOINTS",
    "CRON JOBS",
    "EVENTS"
  ]
  // list of all choices
  // then get removed items from pinkyring file
  // edit list of choices

  return allChoices;
}

// need a list of complete files/directories to remove
// and a pattern of comments to remove

/*

SERVERLESS
folders: ["serverless", "packages/infrastructure/aws"]
files: ["serverless.yml", ".github/serverless.*"]
pattern: ".PR=SERVERLESS"

// .PR_SERVERLESS
some serverless content
// .PR_SERVERLESS END

replacement content?

// .PR=SERVERLESS
stuff to remove
/* .PR=SERVERLESS END
replacement stuff
*/ // .PR=SERVERLESS .PR=SERVERLESS END

//*/