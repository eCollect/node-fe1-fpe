'use strict';

const factorCahce = {};
class PrimeGenerator {
	constructor() {
		this._markedNotPrimeMap = {};
		this._seq = 1;
	}

	next() {
		while (true) {
			this._seq += 1;
			if (!this._markedNotPrimeMap[this._seq]) {
				this._markedNotPrimeMap[this._seq **2] = [this._seq ];
				return this._seq;
			}
			const primes = this._markedNotPrimeMap[this._seq];
			primes.forEach((prime) => {
				const nextMultipleOfPrime = prime + this._seq;

				if (this._markedNotPrimeMap[nextMultipleOfPrime])
					this._markedNotPrimeMap[nextMultipleOfPrime].push(prime);
				else
					this._markedNotPrimeMap[nextMultipleOfPrime] = [prime];
			});
			delete this._markedNotPrimeMap[this._seq];
		}
	}
}

function factor(n) {
	const primes = new PrimeGenerator();
	let a = BigInt(1);
	let b = BigInt(1);
	let p;

	for (let k = 0n; n > 1n; k++) {
		p = BigInt(primes.next());
		if (n % p === 0n)
			while (n % p === 0n) {
				b *= p;
				if (a < b)
					// eslint-disable-next-line prefer-destructuring
					b = [a, a = b][0];
				n /= p;
			}
	}

	// if (n !== 1)
	// 	throw new Error('Could not factor n for use in FPE, try higher max prime number.');

	if (a <= 1 || b <= 1)
		throw new Error('Could not factor n for use in FPE, prime numbers cannot be used as modulus');

	return [a, b];
}

module.exports = (num) => {
	if (factorCahce[num] === undefined)
		factorCahce[num] = factor(num);
	return factorCahce[num];
};
