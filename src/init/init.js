import { log, error, success } from '../logger.js';
import inquirer from 'inquirer';
import { generateGitIgnore } from './generate-gitignore.js';

const answerAutomatically = 'Automatically\t (Applies recommended settings)';
const answerStepByStep = 'Step by Step';
const answerManually = 'Manually\t (does nothing)';

async function automaticInit() {
  await generateGitIgnore();
}

export async function init() {
  success('==================  git-tresor  ==================');
  log("Welcome to git-tresor's initialization process.");

  // Mode selection
  const { mode } = await inquirer.prompt({
    name: 'mode',
    type: 'list',
    message: 'How do you want to initialize git-tresor?',
    choices: [answerAutomatically, answerStepByStep, answerManually],
  });
  if (mode === answerManually) {
    return 0;
  }
  if (mode === answerAutomatically) {
    return await automaticInit();
  }

  // Create and/or overwrite .gitignore?
  const { createGitIgnore } = await inquirer.prompt({
    name: 'createGitIgnore',
    type: 'confirm',
    message:
      'Generate .gitignore to reduce the risk of unencrypted files getting commited?',
  });
  if (createGitIgnore) {
    await generateGitIgnore();
  }
}

await init();
