var AWS = require("aws-sdk");
const { extractS3 } = require("./extractS3");
const { extractfile } = require("./extractfile");
const file = "hugefile.txt";
const filename = "../docs/"+file;
const path = require("path");

const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    Bucket: "smartblocks-docs"
});

const params = {
    Bucket: "smartblocks-docs",
    Key: file
};

const s3download = function (params) {
    return new Promise((resolve, reject) => {
        s3.createBucket({
            Bucket: "smartblocks-docs"
        }, function () {
            s3.getObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    console.log("Successfully dowloaded data from bucket");
                    resolve(data);
                }
            });
        });
    });
}

const display = async function(){
    console.log("Checking file : "+file);
    var filepath = path.resolve(filename);
    var hashedfile = await extractfile(filepath);
    console.log(hashedfile);
    console.time('Time Taken');
    var result = await s3download(params);
    console.log(result);
    var hashed = await extractS3(result.Body);
    console.log(hashed);
    console.timeEnd('Time Taken');
}
display();