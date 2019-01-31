
const t = typeof 42n;

const a = BigInt('12');
const b = BigInt('12');

const c = a + b;

const key = 'my-secret-key';
const tweak = 'my-non-secret-tweak';

const fe1 = require('../index')

const modulus = 99999999;

const EV = fe1.encrypt(modulus, 1, key, tweak);

const mdls = 1000;
const pool = Array.from(Array(mdls).keys());
const encrypts = pool.map(n => fe1.encrypt(mdls, n, 'key', 'tweak'));


console.log('a');
