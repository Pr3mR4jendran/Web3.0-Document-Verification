const ContractHash = artifacts.require("ContractHash");
const { extractfile } = require("./extractfile");
const filename = "../docs/bigfile.txt";

module.exports = async function StoreHash(callback){
    const Hash = await ContractHash.deployed();
    let hashed = await extractfile(filename);
    console.log(hashed);
    var d1 = new Date();
    await Hash.uploadFile(hashed,filename.slice(8));
    var d2 = new Date();
    console.log("Time taken : "+Math.abs((d2.getMilliseconds()-d1.getMilliseconds()))+" ms");
    callback();
}