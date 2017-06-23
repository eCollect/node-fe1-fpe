'use strict';

const crypto = require('crypto');

const BigNumber = require('./bignumber');

const encode = (long) => {
	const buffer = new Buffer(4);
	buffer.writeInt32BE(long);
	const length = buffer.length;

	let firstNonZeroIndex = 0;
	while (buffer[firstNonZeroIndex] === 0 && firstNonZeroIndex < length)
		firstNonZeroIndex += 1;

	if (firstNonZeroIndex > 0)
		return buffer.slice(firstNonZeroIndex);

	return buffer;
};

const toBeBytes = (num) => {
	const buffer = new Buffer(4);
	buffer.writeInt32BE(num);
	return buffer;
};


module.exports = class FPEEncryptor {
	constructor(
		key,
		modulus,
		tweak) {
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
		return new BigNumber(mac.digest(), true);
	}
};
