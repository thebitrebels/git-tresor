import * as logger from './logger.js';
import inquirer from 'inquirer';
import { readFileSync } from 'fs';
import glob from 'glob';
import fs from 'fs';

export async function askPassword() {
  const pw = await inquirer.prompt({
    name: 'password',
    type: 'password',
    message: 'Enter encryption password:',
  });
  return pw.password;
}

export function config(key) {
  try {
    const config = JSON.parse(readFileSync('.tresor.config.json'));
    if (config === undefined) {
      return undefined;
    }
    return config[key];
  } catch (error) {
    logger.error('Can not read or parse .tresor.config.json.');
    return -1;
  }
}

export function readFolder(path, enc) {
  return glob.sync(path + '/**/*').filter((f) => {
    return fs.lstatSync(f).isFile() && f.endsWith('.enc') === enc;
  });
}
