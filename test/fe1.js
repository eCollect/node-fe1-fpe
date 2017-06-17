'use strict';

const expect = require('expect.js');

const api = require('../index');

describe('fe1', () => {
	it('it should be an object', () => {
		expect(api).to.be.an('object');
	});

	it('it should have the correct api', () => {
		expect(api.encrypt).to.be.a('function');
	});
});

