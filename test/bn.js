'use strict';

const { expect } = require('chai');

const BN = require('../lib/bignumber');

describe('BigNumber', () => {
	it('should create a correct BigNumber from number', () => {
		const expectedBuffer = Buffer.from([23, 0, 0, 0]);

		const bn = BN.fromNumber(23);
		const equal = Buffer.compare(expectedBuffer, bn._buffer);

		expect(equal).to.be.equal(0);
	});

	it('should create a correct BigNumber from Buffer', () => {
		const expectedBuffer = Buffer.from([45, 0, 0, 0]);

		const buffer = Buffer.alloc(4);
		buffer.writeInt16LE(45);

		const bn = new BN(buffer);
		const equal = Buffer.compare(expectedBuffer, bn._buffer);

		expect(equal).to.be.equal(0);
	});

	it('should add correctly number 0', () => {
		const bn1 = BN.fromNumber(31);

		bn1.add('0');

		expect(bn1._buffer.readUIntLE(0, 3)).to.be.equal(31);
	});

	it('should add correctly non 0 number', () => {
		const bn1 = BN.fromNumber(31);

		bn1.add(18);

		expect(bn1._buffer.readUIntLE(0, 3)).to.be.equal(49);
	});

	it('should substract correctly number 0', () => {
		const bn1 = BN.fromNumber(31);

		bn1.subtract(0);

		expect(bn1._buffer.readUIntLE(0, 3)).to.be.equal(31);
	});

	it('should substract correctly number 0 as a string', () => {
		const bn1 = BN.fromNumber(31);

		bn1.subtract('0');

		expect(bn1._buffer.readUIntLE(0, 3)).to.be.equal(31);
	});

	it('should substract correctly non 0', () => {
		const bn1 = BN.fromNumber(31);

		bn1.subtract(18);

		expect(bn1._buffer.readUIntLE(0, 3)).to.be.equal(13);
	});

	it('should throw an error BigNumber must big greater than addition', () => {
		const buffer = Buffer.alloc(2);
		buffer.writeInt16LE(23);

		const bn = new BN(buffer);

		expect(() => bn.add(5)).to.throw('Unsppoted operation - BigNumber must big greater than addition');
	});

	it('should throw an error BigNumber must big greater than subtraction', () => {
		const buffer = Buffer.alloc(2);
		buffer.writeInt16LE(23);

		const bn = new BN(buffer);

		expect(() => bn.subtract(5)).to.throw('Unsppoted operation - BigNumber must big greater than subtraction');
	});
});
