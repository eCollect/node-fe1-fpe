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

function _leftShift(buffer) {
	let carry;
	for (let i = buffer.length; i >= 0; i--) {
		carry = (buffer[i] & 0x80) !== 0; // eslint-disable-line no-bitwise
		buffer[i] = (buffer[i] << 1) & 0xFF; // eslint-disable-line no-bitwise
		if (carry && i >= 0)
			buffer[i + 1] |= 0x01; // eslint-disable-line no-bitwise
	}
}

function _lastHeadIndex(buffer, value) {
	for (let i = 0; i < buffer.length; i++)
		if (buffer[i] !== value)
			return i;

	return -1;
}

function _toAsciiDigits(buffer, offset) {
	for (let i = offset; i < buffer.length; i++)
		buffer[i] += 48;
}


function toDecimalString(buffer) {
	const bits = buffer.length * 8;                           	// number of bits in the buffer
	const lastBit = buffer.length - 1;                        	// last bit index
	const digits = new Buffer(Math.floor((bits / 3) + 1 + 1));  // digits buffer
	const lastDigit = digits.length - 1;
	let carry;         											// last digit index, digit index, carry flag

	// reset digits buffer
	digits.fill(0);

	for (let i = 0; i < bits; i++) {
		carry = buffer[lastBit] >= 0x80;

		_leftShift(buffer);  // shift buffer bits

		for (let d = lastDigit; d >= 0; d--) {
			digits[d] += digits[d] + (carry ? 1 : 0);
			carry = (digits[d] > 9);
			if (carry)
				digits[d] -= 10;
		}
	}

	// get rid of leading 0's; reuse d for the first non-zero value index
	let idx = _lastHeadIndex(digits, 0);
	// if there are only 0's use the last digit
	idx = idx >= 0 ? idx : lastDigit;
	// convert numbers to ascii digits
	_toAsciiDigits(digits, idx);

	return digits.toString('ascii', idx);
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

		let a;
		let b;

		if (addative.length > this._buffer.length) {
			a = addative;
			b = this._buffer;
		} else {
			a = this._buffer;
			b = addative;
		}

		const length = a.length;
		let carry = 0;
		let result;

		for (let i = 0; carry !== 0 || i < length; i++) {
			result = (a[i] | 0) + (b[i] | 0) + carry; // eslint-disable-line no-bitwise
			this._buffer[i] = result & 0xFF;  // eslint-disable-line no-bitwise
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

		let a;
		let b;

		if (subtraction.length > this._buffer.length) {
			a = subtraction;
			b = this._buffer;
		} else {
			a = this._buffer;
			b = subtraction;
		}

		const length = a.length;
		let carry = 0;
		let result;

		for (let i = 0; carry !== 0 || i < length; i++) {
			result = ((a[i] | 0) - (b[i] | 0)) + carry; // eslint-disable-line no-bitwise
			this._buffer[i] = result & 0xFF;  // eslint-disable-line no-bitwise
			carry = result / 255;
		}

		return this;
	}

	toString() {
		return toDecimalString(this._buffer);
	}
};
