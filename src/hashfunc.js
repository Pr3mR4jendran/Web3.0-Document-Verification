const { createHash } = require('crypto');

function hashfunc(string) {
    return createHash('sha256').update(string).digest('hex');
}

exports.hashfunc = hashfunc;