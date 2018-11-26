
const t = typeof 42n;

const a = BigInt('12');
const b = BigInt('12');

const c = a + b;

const fe1 = require('../index')

const modulu = 10n ** 16n;
const encryptedValue = fe1.encrypt(modulu, 1, 'my-secret-key', 'my-non-secret-tweak'); // 4984
const decryptedValue = fe1.decrypt(modulu, encryptedValue, 'my-secret-key', 'my-non-secret-tweak'); // 1

console.log('a');
