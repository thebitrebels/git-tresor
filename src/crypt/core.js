import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import AppendInitVect from './appendInitVect.js';
import nanospinner from 'nanospinner';
import inquirer from 'inquirer';
import { warning } from '../logger.js';
import { config } from '../utils.js';

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

    // Encrypt and save file
    const outputName = path.join(file + '.enc');
    const writeStream = fs.createWriteStream(outputName);
    readStream
      .pipe(gzip)
      .pipe(cipher)
      .pipe(appendInitVect)
      .pipe(writeStream)
      .on('finish', () => {
        if (config('generateHash')) {
          // Create a hash of the unencrypted file for later checks (after decryption)
          const hashFile = path.join(file + '.hash');
          fs.writeFileSync(hashFile, getHash(file), (err) => {
            if (err !== null) {
              throw new Error(err);
            }
          });
        }

        // Optional file deletion needs to be the last step
        if (config('deleteAfterEncryption')) {
          fs.unlinkSync(file);
        }
      });
  } catch (error) {
    spinner.error({ text: `Encryption failed! - ${error}` });
    return -1;
  }
  spinner.success({ text: `Encrypted ${file}` });
}

export async function decryptFile(file, password) {
  const spinner = nanospinner.createSpinner(`Decrypting ${file}`).start();
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

  try {
    const readInitVect = fs.createReadStream(file, { end: 15 });
    let initVect;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });
    readInitVect.on('close', () => {
      try {
        const cipherKey = getCipherKey(password);
        const readStream = fs.createReadStream(file, { start: 16 });
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
        const unzip = zlib.createUnzip();
        const outputName =
          path.extname(file) === '.enc'
            ? file.substring(0, file.length - 4)
            : file + '.unenc';
        const writeStream = fs.createWriteStream(outputName);
        readStream
          .pipe(decipher)
          .on('error', (err) => {
            spinner.error({ text: `Decryption failed! - ${err}` });
            spinner.error({
              text: `Decryption failed! - Looks like a wrong password has been entered.`,
            });
          })
          .pipe(unzip)
          .on('error', (err) => {
            spinner.error({ text: `Decryption failed! - ${err}` });
          })
          .pipe(writeStream)
          .on('error', (err) => {
            spinner.error({ text: `Decryption failed! - ${err}` });
          })
          .on('finish', () => {
            if (!config('generateHash')) {
              spinner.success({ text: `Decrypted ${file}` });
              return;
            }
            // A .hash-File should be present to check if the decryption worked
            const fileName =
              path.extname(file) === '.enc'
                ? file.substring(0, file.length - 4)
                : file;
            const hashFile = `${fileName}.hash`;
            if (!fs.existsSync(hashFile)) {
              warning(
                'No hash file found, skipping check. File could be corrupted.',
              );
              return 0;
            }
            const hash = String(fs.readFileSync(hashFile));
            if (hash !== getHash(outputName)) {
              spinner.error({
                text: `Decryption failed! - Hash does not match!`,
              });
              return -1;
            }
            spinner.success({ text: `Decrypted ${file}` });
          });
      } catch (error) {
        spinner.error({ text: `Decryption failed! - ${error}` });
      }
    });
  } catch (error) {
    spinner.error({ text: `Decryption failed! - ${error}` });
    return -1;
  }
}

function getHash(file) {
  const data = fs.readFileSync(file);
  const sha = crypto.createHash('sha512').update(data);
  const hash = String(sha.digest('hex'));
  return hash;
}
