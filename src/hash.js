const ContractHash = artifacts.require("ContractHash");
const { extractfile } = require("./extractfile");
const filename = "../docs/bigfile.txt";

module.exports = async function StoreHash(callback){
    const Hash = await ContractHash.deployed();
    let hashed = await extractfile(filename);
    console.log(hashed);
    console.time('Time Taken');
    await Hash.uploadFile(hashed,filename.slice(8));
    console.timeEnd('Time Taken');
    callback();
}