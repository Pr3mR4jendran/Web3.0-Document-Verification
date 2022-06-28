var AWS = require("aws-sdk");
const { extractS3 } = require("./extractS3");
const { extractfile } = require("./extractfile");
const filename = "./docs/bigfile.txt";
const path = require("path");

const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,  /* required */
    secretAccessKey: process.env.IAM_USER_SECRET, /* required */
    Bucket: "smartblocks-docs"     /* required */     
});

const params = {
    Bucket: "smartblocks-docs",  /* required */
    Key: "bigfile.txt"         /* required */
};

const s3download = function (params) {
    return new Promise((resolve, reject) => {
        s3.createBucket({
            Bucket: "smartblocks-docs"        /* Put your bucket name */
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
    var filepath = path.resolve(filename);
    var hashedfile = await extractfile(filepath);
    console.log(hashedfile);
    var result = await s3download(params);
    console.log(result);
    var hashed = await extractS3(result.Body);
    console.log(hashed);
}
display();