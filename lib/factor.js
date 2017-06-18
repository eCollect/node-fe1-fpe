'use strict';

const maxPrimeNumber = 65535;
const factorCahce = {};

// Extreamly fast Seive of Eratosthenes - https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
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

function factor(n) {
	const primes = seive(maxPrimeNumber);
	let a = 1;
	let b = 1;
	let p;

	for (let k = 0; k < primes.length && n > 1; k++) {
		p = primes[k];
		if (n % p === 0)
			while (n % p === 0) {
				a *= p;
				if (a > b)
					b = [a, a = b][0];
				n /= p;
			}
	}

	if (a > b)
		b = [a, a = b][0];

	a *= 1;

	if (a < b)
		b = [a, a = b][0];

	if (a <= 1 || b <= 1)
		throw new Error('Could not factor n for use in FPE');

	return [a, b];
}

module.exports = (num) => {
	if (factorCahce[num] === undefined)
		factorCahce[num] = factor(num);
	return factorCahce[num];
};
