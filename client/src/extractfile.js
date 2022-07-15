const hasha = require('hasha');
const extractfile = async (path) => {
	const hash = await hasha.fromFile(path, {algorithm: 'sha256'});
	return hash;
};
exports.extractfile = extractfile;