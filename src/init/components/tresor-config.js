import * as fs from 'fs';
import inquirer from 'inquirer';
import { success } from '../../logger.js';

const template = (name, hashGeneration) => {
  return `{
  "name": "${name}",
  "generateHash": ${hashGeneration}
}`;
};

export async function init(useDefaults) {
  // Create and/or overwrite .tresor.config.json?
  const { createConfig } = useDefaults
    ? { createConfig: true }
    : await askQuestion();
  if (!createConfig) {
    return 0;
  }

  success('=================  tresorconfig  =================');
  // Generate .hash-Files to check for integrity?
  const { hashGeneration } = useDefaults
    ? { hashGeneration: true }
    : await askHashGeneration();

  const { name } = await askName(); // Needs to be answered even if the user chooses automatic setup
  return generateConfig(template(name, hashGeneration));
}
export function successText() {
  return 'Generated .tresor.config.json!';
}
export function failureText() {
  return 'Generating .tresor.config.json failed!';
}
export function description() {
  return 'Generating .tresor.config.json';
}
async function askQuestion() {
  return inquirer.prompt({
    name: 'createConfig',
    type: 'confirm',
    message: 'Generate .tresor.config.json to store basic configurations?',
  });
}

async function askName() {
  return inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Tresor Name:',
  });
}

async function askHashGeneration() {
  return inquirer.prompt({
    name: 'hashGeneration',
    type: 'confirm',
    message: 'Generate .hash-Files to check for integrity?',
    default: true,
  });
}

async function generateConfig(config) {
  fs.writeFileSync('.tresor.config.json', config, (err) => {
    if (err !== null) {
      throw new Error(err);
    }
  });
  return 0;
}
