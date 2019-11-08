'use strict';

const FPEEncryptor = require('./lib/fpe_encryptor');
const factor = require('./lib/factor');
const assureBigInt = require('./lib/assureBigInt');
const round = require('./lib/round');


module.exports = {
	/**
	 * Returns the number of rounds encrypt/decrypt will perform.
	 *
	 * @return {number} The current number of rounds.
	 */
	getRound: round.getRound,
	/**
	 * Sets the of number rounds for encrypt/decypt methods.
	 *
	 * @param {number} round - The current number of rounds.
	 * @throws If parameter round is not an integer or it is less than 1.
	 */
	setRound: round.setRound,
	/**
	 * Generic Z_n FPE encryption, FE1 scheme.
	 *
	 * @param {number} modulus - Use to determine the range of the numbers. Example, if the numbers range from 0 to 999, use "1000" here.
	 * @param {number} subject - The number to encrypt. Must be < modulus.
	 * @param {string} key - Secret key to encrypt with. Must be compatible with HMAC(SHA256). See https://tools.ietf.org/html/rfc2104#section-3 for recommendations,
	 * on key length and generation. Anything over 64 bytes is hashed to a 64 byte value, 32 bytes is generally considered "good enough" for most applications.
	 * @param {string} tweak - Non-secret parameter, think of it as an initialisation vector. Must be non-null and at least 1 byte long, no upper limit.
	 * @return {number} The encrypted version of <code>subject</code>.
	 */
	encrypt(modulus, subject, key, tweak) {
		modulus = assureBigInt(modulus);
		const cipher = new FPEEncryptor(key, modulus, tweak);
		const rounds = this.getRound();
		const [firstFactor, secondFactor] = factor(modulus);

		let right;
		let x = BigInt(+subject);

		for (let i = 0; i < rounds; ++i) {
			right = x % secondFactor;
			x = (firstFactor * right) + (cipher.format(i, right) + x / secondFactor) % firstFactor;
		}

		return Number(x);
	},
	/**
	 * Generic Z_n FPE decryption, FE1 scheme.
	 *
	 * @param {number} modulus - Use to determine the range of the numbers. Example, if the numbers range from 0 to 999, use "1000" here.
	 * @param {number} cryptedSubject - The number to decrypt. Must be < modulus.
	 * @param {string|buffer} key - String or Buffer representing the secret key, must be compatible with HMAC(SHA256).
	 * @param {string|buffer} tweak - String or Buffer representing non-secret parameter, think of it as an IV - use the same one used to encrypt. Must be non-null and non-zero length.
	 * @return {number} The decrypted number.
	 */
	decrypt(modulus, cryptedSubject, key, tweak) {
		modulus = assureBigInt(modulus);
		const cipher = new FPEEncryptor(key, modulus, tweak);
		const rounds = this.getRound();
		const [firstFactor, secondFactor] = factor(modulus);

		let modulu;
		let right;
		let left;
		let x = BigInt(+cryptedSubject);

		for (let i = rounds - 1; i >= 0; i--) {
			right = x / firstFactor;
			modulu = (cipher.format(i, right) - ( x % firstFactor )) % firstFactor;
			left = (modulu > 0) ? firstFactor - modulu : modulu;
			x = (secondFactor * left) + right;
		}

		return Number(x);
	},
};
