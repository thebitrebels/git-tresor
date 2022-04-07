import chalk from 'chalk';

export function log(text) {
  console.log(text);
}

export function success(text) {
  console.log(chalk.green(text));
}

export function error(text) {
  console.error(chalk.red(text));
}

export function warning(text) {
  console.warn(chalk.yellow(text));
}
