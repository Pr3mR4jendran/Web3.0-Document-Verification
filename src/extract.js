const hasha = require('hasha');
var buffer = null;

const extract = async (path) => {
	const hash = await hasha.fromFile(path, {algorithm: 'sha256'});
	return hash;
};

exports.extract = extract;