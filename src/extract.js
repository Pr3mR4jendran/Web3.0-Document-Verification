const fs = require('fs');
var buffer = null;

const extract = path => {
    return new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stat) {
            buffer = new Buffer.alloc(Number(stat.size));
        });
        fs.open(path, 'r', function (err, f) {
            fs.read(f, buffer, 0, buffer.length, 0, function (err, data) {
                resolve(buffer.toString());
            });
        });
    });
};
exports.extract = extract;
