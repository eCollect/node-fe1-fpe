
'use strict';

function sieve(n) {
	const numbers = new Array(n);

	for (let i = 0; i < n; i++)
		numbers[i] = true;

	for (let i = 2; i < Math.sqrt(n); i++)
		for (let j = i * i; j < n; j += i)
			numbers[j] = false;

	const primes = [];

	for (let i = 2; i < n; i++)
		if (numbers[i])
			primes.push(i);

	return primes;
}

const primes = sieve(100000);

module.exports = function factor(n) {
	let a = 1;
	let b = 1;

	for (let k = 0; k < primes.length && n > 1; k++) {
		const p = primes[k];
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
};

