import commandLineUsage from 'command-line-usage';

export const optionDefinitions = [
  { name: 'encrypt', alias: 'e', type: Boolean },
  { name: 'decrypt', alias: 'd', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'password', alias: 'p', type: String },
];

export const usage = commandLineUsage([
  {
    header: 'git-tresor',
    content: 'Encrypt and decrypt files to store them with git.',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'encrypt',
        alias: 'e',
        description: 'Flag to use encryption mode.',
        type: Boolean,
        multiple: false,
        defaultOption: true,
      },
      {
        name: 'decrypt',
        alias: 'd',
        description: 'Flag to use decryption mode.',
        type: Boolean,
        multiple: false,
        defaultOption: true,
      },
      {
        name: 'file',
        alias: 'f',
        description: 'Path to the file that should be en- or decrypted.',
        type: String,
        multiple: false,
        defaultOption: true,
      },
      {
        name: 'password',
        alias: 'p',
        description: 'Password that is used to en- or decrypt.',
        type: String,
        multiple: false,
        defaultOption: true,
      },
    ],
  },
  {
    content:
      'Project home: {underline https://github.com/bitrebels/git-tresor}',
  },
]);
