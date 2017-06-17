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

	_reverseBuffer(buffer);


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

function padWithNulls(number, length) {
	if (number.length < length) {
		const padding = length - number.length;
		for (let j = 0; j < padding; j++)
			number = `0${number}`;
	}
	return number;
}

function sumTwoNumbers(firstIntegerPart, secondIntegerPart) {
	let result = '';
	let temp = 0;

	for (let j = firstIntegerPart.length - 1; j >= 0; j--) {
		const firstDigit = parseInt(firstIntegerPart[j], 10);
		const secondDigit = parseInt(secondIntegerPart[j], 10);
		const sum = firstDigit + secondDigit + temp;
		result = parseInt(sum % 10, 10) + result;
		temp = parseInt(sum / 10, 10);
	}

	if (temp > 0)
		result = temp + result;


	return result;
}

function subtractTwoNumbers(firstIntegerPart, secondIntegerPart) {
	let result = '';
	let temp = 0;

	for (let j = firstIntegerPart.length - 1; j >= 0; j--) {
		const firstDigit = parseInt(firstIntegerPart[j], 10);
		const secondDigit = parseInt(secondIntegerPart[j], 10);
		let sum = (firstDigit - temp) - secondDigit;
		temp = 0;
		if (sum < 0) {
			sum += 10;
			temp = 1;
		}

		result = sum + result;
	}

	return result.replace(/^0+/, '');
}


function simpleOperator(first, second, isAdd = true) {
	const integerLength = Math.max(first.length, second.length);
	const firstIntegerPart = padWithNulls(first, integerLength);
	const secondIntegerPart = padWithNulls(second, integerLength);

	return (isAdd) ?
		sumTwoNumbers(firstIntegerPart, secondIntegerPart) :
		subtractTwoNumbers(firstIntegerPart, secondIntegerPart);
}


module.exports = class BigNumber {
	constructor(buffer) {
		if (buffer)
			this._numberString = toDecimalString(buffer);
	}

	mod(op) {
		let nBig = this._numberString;
		while (nBig.length >= 9) {
			const temp = nBig.substr(0, 9);
			const mod = temp % op;
			nBig = mod.toString() + nBig.substr(9);
		}

		const x = nBig % op;
		if (x >= 0)
			return x;
		return op + x;
	}

	add(additon) {
		this._numberString = simpleOperator(this._numberString, additon.toString());
		return this;
	}

	subtract(subtraction) {
		this._numberString = simpleOperator(this._numberString, subtraction.toString(), false);
		return this;
	}

	toString() {
		return this._numberString;
	}
};
