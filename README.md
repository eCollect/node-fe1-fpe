# node-fe1-fpe
A dependency-free Node.js implementation of Format Preserving Encryption using the FE1 scheme from the paper ["Format-Preserving Encryption" by Bellare, Rogaway, et al](http://eprint.iacr.org/2009/251).

Ported from [java-fpe](https://github.com/Worldpay/java-fpe) which was ported from
[DotFPE](https://dotfpe.codeplex.com/) which was ported from [Botan Library](http://botan.randombit.net). Version 0.0.3.

See [LICENSE](https://github.com/nanov/node-fe1-fpe/blob/master/LICENSE) for the full license.

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

## Todo

- [ ] Proper tests
- [ ] Documentation
- [ ] Benchmarks
- [X] Speed optimizations

## Copyright

Copyright (c) 2017 Dimitar Nanov.