# node-fe1-fpe ( beta )
A ~~dependency-free~~ Node.js implementation of Format Preserving Encryption.

[![Build Status](https://travis-ci.org/eCollect/node-fe1-fpe.svg?branch=master)](https://travis-ci.org/eCollect/node-fe1-fpe) [![npm version](https://badge.fury.io/js/node-fe1-fpe.svg)](https://badge.fury.io/js/node-fe1-fpe) [![Coverage Status](https://coveralls.io/repos/github/eCollect/node-fe1-fpe/badge.svg?branch=master)](https://coveralls.io/github/eCollect/node-fe1-fpe?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/eCollect/node-fe1-fpe/badge.svg)](https://snyk.io/test/github/eCollect/node-fe1-fpe) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

### Theory

Format preserving encryption (FPE) refers to a set of techniques for encrypting data such that the ciphertext has the same format as the plaintext. For instance, you can use FPE to encrypt credit card numbers with valid checksums such that the ciphertext is also an credit card number with a valid checksum, or similarly for bank account numbers, US Social Security numbers, or even more general mappings like English words onto other English words.

To encrypt an arbitrary value using FE1, you need to use a ranking method. Basically, the idea is to assign an integer to every value you might encrypt. For instance, a 16 digit credit card number consists of a 15 digit code plus a 1 digit checksum. So to encrypt a credit card number, you first remove the checksum, encrypt the 15 digit value modulo 10^15, and then calculate what the checksum is for the new (ciphertext) number. Or, if you were encrypting words in a dictionary, you could rank the words by their lexicographical order, and choose the modulus to be the number of words in the dictionary.

### Implementation

Current implementation uses the FE1 scheme from the paper ["Format-Preserving Encryption" by Bellare, Rogaway, et al](http://eprint.iacr.org/2009/251).

Ported from [java-fpe](https://github.com/Worldpay/java-fpe) which was ported from
[DotFPE](https://dotfpe.codeplex.com/) which was ported from [Botan Library](http://botan.randombit.net).


## Installation

```node
npm install --save node-fe1-fpe
```

## Basic usage

```javascript
const fe1 = require('node-fe1-fpe');

// in possible values of 0-10000 encrypt the value of 1.
const encryptedValue = fe1.encrypt(10001, 1, 'my-secret-key', 'my-non-secret-tweak'); // 4984
const decryptedValue = fe1.decrypt(10001, encryptedValue, 'my-secret-key', 'my-non-secret-tweak'); // 1
```

Alternatively you could pass a buffer instance instead of string key (this allows reading the keys from files).

```javascript
const fe1 = require('node-fe1-fpe');

// just an example, buffer would ideally come file.
const secretKeyBuffer = Buffer.from('my-secret-key', 'utf16le');

// in possible values of 0-10000 encrypt the value of 1.
const encryptedValue = fe1.encrypt(10001, 1, secretKeyBuffer, 'my-non-secret-tweak'); // 4984
const decryptedValue = fe1.decrypt(10001, encryptedValue, secretKeyBuffer, 'my-non-secret-tweak'); // 1
```

## Considerations

The implementation is as stable as a rock for a modulus up to 10 000 000. It is designed this way because of speed concerns. For larger range, the matter needs to be discussed with the corresponding developers.

## Todo

- [X] Proper tests
- [X] Documentation
- [X] Speed optimizations

## License

Copyright &copy; 2017-8 eCollect AG.
Licensed under the [MIT](LICENSE) license.
