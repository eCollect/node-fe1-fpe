'use strict';

const crypto = require('crypto');

const BigNumber = require('./bignumber');

const longToByteArray = (long) => {
    // we want to represent the input as a 8-bytes array
	const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

	for (let index = 0; index < byteArray.length; index++) {
		const byte = long & 0xff; // eslint-disable-line no-bitwise
		byteArray[index] = byte;
		long = (long - byte) / 256;
	}

	return byteArray;
};

const encode = (long) => {
	const result = [];
	longToByteArray(long).reverse().forEach((byte) => {
		if (byte !== 0)
			result.push(byte);
	});
	return result;
};

const updateBe = (mac, num) => {
	const bytes = longToByteArray(num);
	for (let i = 3; i >= 0; i--)
		mac.push(bytes[i]);
};

module.exports = class FPEEncryptor {
	constructor(
		key,
		modulus,
		tweak) {
		this._macFactory = () => crypto.createHmac('sha256', Buffer.from(key, 'utf16le'));

		const nBin = encode(modulus);
		const ms = [];
		updateBe(ms, nBin.length);
		nBin.forEach(byte => ms.push(byte));

		const tweakByte = Buffer.from(tweak, 'utf16le');
		updateBe(ms, tweakByte.length);
		tweakByte.forEach(byte => ms.push(byte));

		const mac = this._macFactory();
		mac.update(Buffer.from(ms));
		this._macNT = Buffer.from(mac.digest('hex'), 'hex');
	}

	format(roundNumber, r) {
		const rBin = encode(r);
		const ms = [];

		this._macNT.forEach(byte => ms.push(byte));
		updateBe(ms, roundNumber);

		updateBe(ms, rBin.length);
		rBin.forEach(byte => ms.push(byte));

		const mac = this._macFactory();
		mac.update(Buffer.from(ms));

		return new BigNumber(mac.digest());
	}
};
