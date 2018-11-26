'use strict';

let converter;

try {
	converter = require('./bindings')('bigint_buffer');
} catch (e) {
	converter  = {
		toBigInt(buf, bigEndian = false) {
			const hex = bigEndian ? buf.toString('hex') : Buffer.from(buf).reverse().toString('hex');
			if (hex.length === 0)
			  return BigInt(0);

			return BigInt(`0x${hex}`);
		},
		fromBigInt(num, buf, bigEndian = false) {
			const hex = num.toString(16);
			const width = buf.length;
			buf.fill(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
			if (!bigEndian)
				buf.reverse();
			return buf;
		},
	}
}

module.exports = {
	toBigIntBE(buf) {
		return converter.toBigInt(buf, true);
	},
	toBufferBE(num, width) {
		return converter.fromBigInt(num, Buffer.allocUnsafe(width), true);
	}
};
