#!/usr/bin/env node

import commandLineArgs from 'command-line-args';
import { optionDefinitions, usage } from './src/args.js';
import { decryptFile, encryptFile } from './src/crypt/core.js';
import { init } from './src/init/init.js';
import { log, error, success } from './src/logger.js';
import { askPassword } from './src/utils.js';

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

// If file and password are missing the usage is printed
if (
  options.file === undefined &&
  options.password === undefined &&
  options.encrypt === undefined &&
  options.decrypt === undefined
) {
  if (options.init) log(usage);
  process.exit(-1);
}

// If only the file is missing there is explicit error handling
if (options.file === undefined) {
  error('No path specified. Use --help to read more.');
  process.exit(-1);
}

if (options.encrypt === undefined && options.decrypt === undefined) {
  error('Neither -d or -e were set. Use --help to read more.');
  process.exit(-1);
}

// Ask for password if not present
if (options.password === undefined) {
  options.password = await askPassword();
}

if (options.encrypt) {
  encryptFile(options.file, options.password);
}

if (options.decrypt) {
  decryptFile(options.file, options.password);
}
