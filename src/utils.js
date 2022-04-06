import * as logger from './logger.js';
import inquirer from 'inquirer';

export async function welcome() {
  logger.success('git-tresor');
}

export async function askPassword() {
  const pw = await inquirer.prompt({
    name: 'password',
    type: 'password',
    message: 'Enter encryption password:',
  });
  return pw.password;
}
