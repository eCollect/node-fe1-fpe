'use strict';

function _reverseBuffer(buffer) {
	let tmp;
	const len = buffer.length - 1;
	const half = Math.floor(buffer.length / 2);

	for (let i = len; i >= half; i--) {
		tmp = buffer[i];
		buffer[i] = buffer[len - i];
		buffer[len - i] = tmp;
	}
}

module.exports = class BigNumber {
	constructor(buffer, isBigEndian = false) {
		this._buffer = buffer;
		if (isBigEndian)
			_reverseBuffer(buffer);
	}

	mod(div) {
		let result = 0;
		for (let i = this._buffer.length - 1; i >= 0; i--) {
			result *= (256 % div);
			result %= div;
			result += (this._buffer[i] % div);
			result %= div;
		}
		return result;
	}

	add(addative) {
		if (typeof addative === 'number') {
			if (addative === 0)
				return this;

			const addativeBuffer = new Buffer(4);
			addativeBuffer.writeInt32LE(addative);
			addative = addativeBuffer;
		}

		if (addative.length > this._buffer.length)
			throw new Error('Unsppoted operation - BigNumber must big greater than addition');

		const a = this._buffer;
		const b = addative;

		const length = a.length;
		let carry = 0;
		let result;

		for (let i = 0; carry !== 0 || i < length; i++) {
			result = (a[i] | 0) + (b[i] | 0) + carry; // eslint-disable-line no-bitwise
			a[i] = result & 0xFF;  // eslint-disable-line no-bitwise
			carry = result / 255;
		}
		return this;
	}

	subtract(subtraction) {
		if (typeof subtraction === 'number') {
			if (subtraction === 0)
				return this;

			const subtractionBuffer = new Buffer(4);
			subtractionBuffer.writeInt32LE(subtraction);
			subtraction = subtractionBuffer;
		}

		if (subtraction.length > this._buffer.length)
			throw new Error('Unsppoted operation - BigNumber must big greater than subtraction');

		const a = this._buffer;
		const b = subtraction;
		const length = a.length;
		let carry = 0;
		let result;

		for (let i = 0; carry !== 0 || i < length; i++) {
			result = ((a[i] | 0) - (b[i] | 0)) + carry; // eslint-disable-line no-bitwise
			a[i] = result & 0xFF;  // eslint-disable-line no-bitwise
			carry = result / 255;
		}

		return this;
	}

};
