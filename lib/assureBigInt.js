'use strict';


module.exports = (n) => {
	// eslint-disable-next-line valid-typeof
	if (typeof n === 'bigint')
		return n;
	return BigInt(n);
};
