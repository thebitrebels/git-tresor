#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import { optionDefinitions, usage } from './src/args.js';
import { decryptFile, encryptFile } from './src/crypt/core.js';
import { init } from './src/init/init.js';
import { log, error, success } from './src/logger.js';
import { askPassword, readFolder } from './src/utils.js';

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true,
});
if (mainOptions.command === 'init') {
  await init();
  process.exit(0);
}

// Read args
const options = commandLineArgs(optionDefinitions);

// If path and password are missing the usage is printed
if (
  options.file === undefined &&
  options.password === undefined &&
  options.encrypt === undefined &&
  options.decrypt === undefined &&
  options.directory === undefined
) {
  if (!options.init) log(usage);
  process.exit(-1);
}

// If only the path is missing there is explicit error handling
if (options.file === undefined && options.directory === undefined) {
  error('No path specified. Use -f for files or -dir for folders.');
  process.exit(-1);
}

if (options.encrypt === undefined && options.decrypt === undefined) {
  error('Neither -d for decryption nor -e for encryption were set.');
  process.exit(-1);
}

// Ask for password if not present
if (options.password === undefined) {
  options.password = await askPassword();
}

if (options.directory !== undefined && options.file !== undefined) {
  error('Cannot set -f and -dir at the same time.');
  process.exit(-1);
}

if (options.directory !== undefined) {
  var files = readFolder(options.directory, options.decrypt);
  files.forEach((file) => {
    handleFile(file);
  });
}

if (options.file !== undefined) {
  handleFile(options.file);
}

function handleFile(file) {
  if (options.encrypt) {
    encryptFile(file, options.password);
  }

  if (options.decrypt) {
    decryptFile(file, options.password);
  }
}
