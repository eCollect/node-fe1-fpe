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

// Extreamly fast Seive of Eratosthenes - https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
/*
function seive(max = 0) {
	let i;
	const maxPlusOne = max + 1;
	const numbers = new Int8Array(maxPlusOne);

	// mark the first three
	numbers[0] = 1;
	numbers[1] = 1;
	numbers[2] = 1;

	// all evens are non-primes
	for (i = 3; i < maxPlusOne; i += 2)
		numbers[i] = 2;

	for (i = 4; i < maxPlusOne; i += 2)
		numbers[i] = 1;

	let primeCount = 0;

	// use the seive of Eratosthenes to find all primes up to max
	for (let prime = 2; prime <= max;) {
		numbers[prime] = 0;
		if (prime >= 2)
			primeCount += 1;

		// mark all numbers divisible by that prime
		for (i = prime * 2; i <= max; i += prime)
			numbers[i] = 1;

		// advance to next prime
		while (prime <= max && numbers[prime] !== 2)
			prime += 1;
	}

	const result = new Uint32Array(primeCount);
	let pi = 0;
	for (i = 2; i < maxPlusOne; ++i)
		if (numbers[i] === 0) {
			result[pi] = i;
			pi += 1;
		}

	return result;
}
*/
function factor(n) {
	const primes = new PrimeGenerator();
	let a = 1;
	let b = 1;
	let p;

	for (let k = 0; n > 1; k++) {
		p = primes.next();
		if (n % p === 0)
			while (n % p === 0) {
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
