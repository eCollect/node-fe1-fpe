'use strict';

const fs = require('fs');
const { join, dirname } = require('path');

const exists = (p) => {
	try {
		fs.accessSync(p);
		return true;
	} catch (e) {
		return false;
	}
};

const getFileName = function getFileName() {
	const origPST = Error.prepareStackTrace;
	const origSTL = Error.stackTraceLimit;
	const dummy = {};
	let fileName;
	Error.stackTraceLimit = 10;
	Error.prepareStackTrace = function prepareStackTrace(e, st) {
		for (let i = 0, l = st.length; i < l; i++) {
			fileName = st[i].getFileName();
			if (fileName !== __filename)
				return;
		}
	};

	// run the 'prepareStackTrace' function above
	Error.captureStackTrace(dummy);
	dummy.stack; // eslint-disable-line

	// cleanup
	Error.prepareStackTrace = origPST;
	Error.stackTraceLimit = origSTL;
	return fileName;
};

const getRoot = function getRoot(file) {
	let dir = dirname(file);
	let prev;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (dir === '.')
			dir = process.cwd();

		if (exists(join(dir, 'package.json')) || exists(join(dir, 'node_modules')))
			return dir;

		if (prev === dir)
			throw new Error(
				`Could not find module root given file: "${
					file
				}". Do you have a \`package.json\` file? `,
			);

		prev = dir;
		dir = join(dir, '..');
	}
};

function bindings(opts) {
	opts = {
		bindings: `${opts}.node`,
		arrow: process.env.NODE_BINDINGS_ARROW || ' → ',
		compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled',
		platform: process.platform,
		arch: process.arch,
		version: process.versions.node,
		module_root: getRoot(getFileName()),
		try: [
			// node-gyp's linked version in the "build" dir
			['module_root', 'build', 'bindings'],
			// node-waf and gyp_addon (a.k.a node-gyp)
			['module_root', 'build', 'Debug', 'bindings'],
			['module_root', 'build', 'Release', 'bindings'],
			// Debug files, for development (legacy behavior, remove for node v0.9)
			['module_root', 'out', 'Debug', 'bindings'],
			['module_root', 'Debug', 'bindings'],
			// Release files, but manually compiled (legacy behavior, remove for node v0.9)
			['module_root', 'out', 'Release', 'bindings'],
			['module_root', 'Release', 'bindings'],
			// Legacy from node-waf, node <= 0.4.x
			['module_root', 'build', 'default', 'bindings'],
			// Production "Release" buildtype binary (meh...)
			[
				'module_root',
				'compiled',
				'version',
				'platform',
				'arch',
				'bindings',
			],
		],
	};

	const tries = [];
	let i = 0;
	const l = opts.try.length;
	let n;
	let b;

	for (; i < l; i++) {
		n = join(...opts.try[i].map(p => opts[p] || p));
		tries.push(n);
		try {
			b = opts.path ? require.resolve(n) : require(n); // eslint-disable-line
			if (!opts.path)
				b.path = n;

			return b;
		} catch (e) {
			if (!/not find/i.test(e.message))
				throw e;
		}
	}

	const err = new Error(`Could not locate the bindings file. Tried:\n${tries.map(a => opts.arrow + a).join('\n')}`);
	err.tries = tries;
	throw err;
}

module.exports = bindings;
