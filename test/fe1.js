'use strict';

const { expect } = require('chai');
const api = require('../index');

const modulus = 99999999;
const bigIntModulus = 99999999n;

const subject = 1;
const expectedEV = 88925566;
const key = 'my-secret-key';
const tweak = 'my-non-secret-tweak';

describe('fe1 should', () => {
	it('be an object', () => {
		expect(api).to.be.an('object');
	});

	it('have the correct api', () => {
		expect(api.encrypt).to.be.a('function');
		expect(api.decrypt).to.be.a('function');
	});

	describe('work with native bindings and', () => {
		it('encrypt and decrypt correctly with BigInt modulu', () => {
			const EV = api.encrypt(bigIntModulus, subject, key, tweak);
			const DV = api.decrypt(bigIntModulus, EV, key, tweak);

			expect(DV).to.be.equal(subject);
		});

		it('encrypt correctly with given key and tweak as strings', () => {
			const EV = api.encrypt(modulus, subject, key, tweak);

			expect(EV).to.be.equal(expectedEV);
		});

		it('decrypt correctly with given key and tweak as strings', () => {
			const EV = api.encrypt(modulus, subject, key, tweak);
			const DV = api.decrypt(modulus, EV, key, tweak);

			expect(DV).to.be.equal(subject);
		});

		it('encrypt correctly with given key and tweak as Buffers', () => {
			const EV = api.encrypt(modulus, subject, Buffer.from(key, 'utf16le'), Buffer.from(tweak, 'utf16le'));

			expect(EV).to.be.equal(expectedEV);
		});

		it('decrypt correctly with given key and tweak as Buffers', () => {
			const EV = api.encrypt(modulus, subject, Buffer.from(key, 'utf16le'), Buffer.from(tweak, 'utf16le'));
			const DV = api.decrypt(modulus, EV, Buffer.from(key, 'utf16le'), Buffer.from(tweak, 'utf16le'));

			expect(DV).to.be.equal(subject);
		});

		it('throw prime number can not be used as modulus', () => {
			expect(() => api.encrypt(13, 1, 'my-secret-key', 'my-non-secret-tweak')).to.throw('Could not factor n for use in FPE, prime numbers cannot be used as modulus');
		});

		it('encrypt all the numbers up to the modulus', () => {
			const mdls = 1000;
			const pool = Array.from(Array(mdls).keys());
			const encrypts = pool.map(n => api.encrypt(mdls, n, key, tweak));

			expect(encrypts).to.have.deep.members(pool);
		});
	});
});
