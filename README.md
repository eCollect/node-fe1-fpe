# node-fe1-fpe
A dependency-free Node.js implementation of Format Preserving Encryption using the FE1 scheme from the paper ["Format-Preserving Encryption" by Bellare, Rogaway, et al](http://eprint.iacr.org/2009/251).

Ported from [java-fpe](https://github.com/Worldpay/java-fpe) which was ported from
[DotFPE](https://dotfpe.codeplex.com/) which was ported from [Botan Library](http://botan.randombit.net). Version 0.0.1.

See [LICENSE.md](https://github.com/Worldpay/java-fpe/blob/master/LICENSE.md) for the full license.

## Installation

```node
npm install --save node-fe1-fpe
```

## Basic usage

```javascript
const fe1 = require('node-fe1-fpe');

// in possible values of 0-10000 encrypt the value of 1.
const encryptedValue = fe1.encrypt(10000, 1, 'my-secret-key', 'my-non-secret-tweak');
```

## Todo

- [ ] Proper tests
- [ ] Documentation
- [ ] Benchmarks
- [ ] Speed optimizations

## Copyright

Copyright (c) 2017 Dimitar Nanov.