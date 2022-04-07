<img style="width:100%" src="./logo.png" />

---

Encrypt and decrypt files to store them inside a git repository. `git-tresor` uses [AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption. Every file or directory has it's own password. This enables you to commit encrypted files either in a separate git repository or inside the same repository where your secret files are needed (f.e. Android-Keystores or Signing-Certificates for Apple).

---

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

Below you can see the currently available options.

```
Options

  -e, --encrypt              Flag to use encryption mode.
  -d, --decrypt              Flag to use decryption mode.
  -f, --file string          Path to the file that should be en- or decrypted.
  -dir, --directory string   Path to a directory that should be en- or decrypted.
  -p, --password string      Password that is used to en- or decrypt.
```

To de- or encrypt files you need to set the `-d` or `-e` flag. In both cases you need to specify a file and a password.

```
# Encryption
git-tresor -e -f secretFile.txt -p secretPassword

# Decryption
git-tresor -d -f secretFile.txt.enc -p secretPassword
```

If you want to de- or encrypt folders you need to set the `-dir` option instead of `-f`.

```
# Encryption
git-tresor -e -dir ./secretFolder -p secretPassword

# Decryption
git-tresor -d -dir ./secretFolder -p secretPassword
```

In all cases, you will be prompted to enter a password if you do not set `--password` (or `-p`).

## Sources & Further Readings

- Source and inspiration for core encryption code: [Medium - Brandonstilson - Let's encrypt with node](https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e)
