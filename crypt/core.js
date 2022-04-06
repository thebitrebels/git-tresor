import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import AppendInitVect from './appendInitVect.js';
import nanospinner from 'nanospinner';
import inquirer from 'inquirer';
import { error } from '../logger.js';

function getCipherKey(password) {
  return crypto.createHash('sha256').update(password).digest();
}

export async function encryptFile(file, password) {
  const spinner = nanospinner.createSpinner(`Encrypting ${file}`).start();
  try {
    const initVect = crypto.randomBytes(16);
    const key = getCipherKey(password);
    const readStream = fs.createReadStream(file);
    const gzip = zlib.createGzip();
    const cipher = crypto.createCipheriv('aes256', key, initVect);
    const appendInitVect = new AppendInitVect(initVect);
    const writeStream = fs.createWriteStream(path.join(file + '.enc'));
    readStream.pipe(gzip).pipe(cipher).pipe(appendInitVect).pipe(writeStream);
  } catch (error) {
    spinner.error({ text: `Encryption failed! - ${error}` });
  }
  spinner.success({ text: `Encrypted ${file}` });
}

export async function decryptFile(file, password) {
  // Check if the user entered a .enc file path to make sure not to encrypt a file twice.
  if (path.extname(file) !== '.enc') {
    const confirmation = await inquirer.prompt({
      name: 'sure',
      type: 'confirm',
      message: "The file does not end with '.enc'.\nDo you want to continue?",
    });
    if (confirmation !== true) {
      return -1;
    }
  }
  const readInitVect = fs.createReadStream(file, { end: 15 });
  let initVect;
  readInitVect.on('data', (chunk) => {
    initVect = chunk;
  });
  readInitVect.on('close', () => {
    const cipherKey = getCipherKey(password);
    const readStream = fs.createReadStream(file, { start: 16 });
    const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
    const unzip = zlib.createUnzip();
    const outputName =
      path.extname(file) === '.enc'
        ? file.substring(0, file.length - 4)
        : file + '.unenc';
    const writeStream = fs.createWriteStream(outputName);
    readStream.pipe(decipher).pipe(unzip).pipe(writeStream);
  });
}
