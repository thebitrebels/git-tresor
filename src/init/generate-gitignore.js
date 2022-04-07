import * as fs from 'fs';
import { error } from '../logger.js';
import nanospinner from 'nanospinner';
const gitignore = `# git-tresor .gitignore
# Ignore all files...
*.*
**/*.*
# ...except the ones we want
!*.enc

# Feel free to add your own stuff. This file is not regenerated.
`;

export async function generateGitIgnore() {
  const spinner = nanospinner.createSpinner('Generating .gitignore').start();
  fs.writeFile('.gitignore', gitignore, (err) => {
    if (err) {
      spinner.error({ text: 'Writing .gitignore failed.' });
      error(err);
    }
  });
  spinner.success({ text: 'Generated .gitignore!' });
  return 0;
}
