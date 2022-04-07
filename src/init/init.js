import * as logger from '../logger.js';
import inquirer from 'inquirer';
import * as gitignore from './components/generate-gitignore.js';
import * as tresorConfig from './components/tresor-config.js';
import nanospinner from 'nanospinner';

const answerAutomatically = 'Automatically\t (Applies recommended settings)';
const answerStepByStep = 'Step by Step';
const answerManually = 'Manually\t (does nothing)';

export async function init() {
  logger.success('==================  git-tresor  ==================');
  logger.log("Welcome to git-tresor's initialization process.");

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
  logger.success('================  Initialization  ================');
  const useDefaults = mode === answerAutomatically;
  await initComponent(gitignore, useDefaults);
  await initComponent(tresorConfig, useDefaults);
}

async function initComponent(component, useDefaults) {
  logger.log(component.description());
  try {
    await component.init(useDefaults);
  } catch (error) {
    logger.error(component.failureText());
    logger.error(error);
    process.exit(-1);
  }
  logger.success(component.successText());
}
