'use strict';

const crypto = require('crypto');

const { toBigIntBE, toBufferBE } = require('bigint-buffer');
const encode = long => toBufferBE(long, 8);

const toBeBytes = num => toBufferBE(BigInt(num), 8);

module.exports = class FPEEncryptor {
	constructor(key, modulus, tweak) {
		this._keyByte = Buffer.isBuffer(key) ? key : Buffer.from(key, 'utf16le');
		this._macFactory = () => crypto.createHmac('sha256', this._keyByte);

		const mac = this._macFactory();
		const nBin = encode(modulus);
		const tweakByte = Buffer.isBuffer(tweak) ? tweak : Buffer.from(tweak, 'utf16le');
		mac.update(toBeBytes(nBin.length))
			.update(nBin)
			.update(toBeBytes(tweakByte.length))
			.update(tweakByte);
		this._macNT = mac.digest();
	}

	format(roundNumber, r) {
		const rBin = encode(r);
		const mac = this._macFactory();
		mac.update(this._macNT)
			.update(toBeBytes(roundNumber))
			.update(toBeBytes(rBin.length))
			.update(rBin);
		return toBigIntBE(mac.digest());
	}
};
