import * as fs from 'fs';
import inquirer from 'inquirer';

const gitignore = `# git-tresor .gitignore
# Ignore all files...
*.*
**/*.*
# ...except the ones we want
!*.enc
!.tresor.config.json

# Feel free to add your own stuff. 
# This file is only regenerated if you run git-tresor init again.
`;

export async function init(useDefaults) {
  // Create and/or overwrite .gitignore?
  const { createGitIgnore } = useDefaults
    ? { createGitIgnore: true }
    : await askQuestion();
  if (!createGitIgnore) {
    return 0;
  }
  return generateGitIgnore();
}
export function successText() {
  return 'Generated .gitignore!';
}
export function failureText() {
  return 'Generating .gitignore failed!';
}
export function description() {
  return 'Generating .gitignore';
}
async function askQuestion() {
  return inquirer.prompt({
    name: 'createGitIgnore',
    type: 'confirm',
    message:
      'Generate .gitignore to reduce the risk of unencrypted files getting commited?',
  });
}

async function generateGitIgnore() {
  fs.writeFileSync('.gitignore', gitignore, (err) => {
    if (err !== null) {
      throw new Error(err);
    }
  });
  return 0;
}
