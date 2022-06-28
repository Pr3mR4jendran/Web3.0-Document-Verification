const hasha = require('hasha');
const extractS3 = async (path) => {
	const hash = await hasha(path, {algorithm: 'sha256'});
	return hash;
};
exports.extractS3 = extractS3;