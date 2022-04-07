# git-tresor

Encrypt and decrypt files to store them with git.

## Setup

```
npm i -g git-tresor # Not working until it is released

## Current alternative
git clone https://github.com/thebitrebels/git-tresor
cd git-tresor
npm i
npm link # After this you can test it by simply running 'git-tresor'
```

To initialize a new repository you should start by setting up git:

```
git init
```

Of course you do not need this step if the git repository is already initialized. After that you can go ahead and initialize `git-tresor` by running:

```
git-tresor init
```

It will guide you trough the process of initialization.

## Usage

`git-tresor` uses [AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption to encrypt files. Below you can see the currently available options.

```
Options
  -e, --encrypt           Flag to use encryption mode.
  -d, --decrypt           Flag to use decryption mode.
  -f, --file string       Path to the file that should be en- or decrypted.
  -p, --password string   Password that is used to en- or decrypt.
```

To de- or encrypt files you need to set the `-d` or `-e` flag. In both cases you need to specify a file and a password.

```
# Encryption
git-tresor -e -f secretFile.txt -p secretPassword

# Decryption
git-tresor -d -f secretFile.txt.enc -p secretPassword
```

If you do not set `--password` you will be prompted to enter one.

## Sources & Further Readings

- Source and inspiration for core encryption code: [Medium - Brandonstilson - Let's encrypt with node](https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e)
