const hasha = require('hasha');

const extract = async (path) => {
	const hash = await hasha.fromFile(path, {algorithm: 'sha256'});
	return hash;
};

exports.extract = extract;