'user strict';

const FPEEncryptor = require('./lib/fpe_encryptor');
const factor = require('./lib/factor');


module.exports = {
	/**
	 * Generic Z_n FPE encryption, FE1 scheme
	 *
	 * @param {number} modulus - Use to determine the range of the numbers. Example, if the numbers range from 0 to 999, use "1000" here
	 * @param {number} subject - The number to decrypt. Must be < modulus.
	 * @param {string} key - key Secret key to encrypt with. Must be compatible with HMAC(SHA256).  See https://tools.ietf.org/html/rfc2104#section-3 for recommendations,
	 * on key length and generation.  Anything over 64 bytes is hashed to a 64 byte value, 32 bytes is generally considered "good enough" for most applications.
	 * @param {string} tweak - Non-secret parameter, think of it as an initialisation vector. Must be non-null and at least 1 byte long, no upper limit.
	 * @return {number} the encrypted version of <code>subject</code>.
	 */
	encrypt(modulus, subject, key, tweak) {
		const cipher = new FPEEncryptor(key, modulus, tweak);
		const rounds = 3;
		const [firstFactor, secondFactor] = factor(modulus);

		let right;
		let x = +subject;

		for (let i = 0; i < rounds; ++i) {
			right = x % secondFactor;
			x = (firstFactor * right) + cipher.format(i, right).add(Math.floor(x / secondFactor)).mod(firstFactor);
		}

		return x;
	},
	/**
	 * Generic Z_n FPE decryption, FE1 scheme.
	 * @param {number} modulus - Use to determine the range of the numbers. Example, if the numbers range from 0 to 999, use "1000" here.
	 * @param {number} cryptedSubject - The number to decrypt. Must be < modulus.
	 * @param {string|buffer} key - String or Buffer representing the secret key, must be compatible with HMAC(SHA256).
	 * @param {string|buffer} tweak - String or Buffer representing non-secret parameter, think of it as an IV - use the same one used to encrypt. Must be non-null and non-zero length.
	 * @return {number} The decrypted number
	 */
	decrypt(modulus, cryptedSubject, key, tweak) {
		const cipher = new FPEEncryptor(key, modulus, tweak);
		const rounds = 3;
		const [firstFactor, secondFactor] = factor(modulus);

		let modulu;
		let right;
		let left;
		let x = +cryptedSubject;

		for (let i = rounds - 1; i >= 0; i--) {
			right = Math.floor(x / firstFactor);
			modulu = cipher.format(i, right).subtract(x % firstFactor).mod(firstFactor);
			left = (modulu > 0) ? firstFactor - modulu : modulu;
			x = (secondFactor * left) + right;
		}

		return x;
	},
};
