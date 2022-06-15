const ContractHash = artifacts.require("ContractHash");
const { extract } = require("./extract");
const { hashfunc } = require("./hashfunc");
const filename = "../docs/6103.png";

module.exports = async function StoreHash(callback){
    const Hash = await ContractHash.deployed();
    let file = await extract(filename);
    let hashed = hashfunc(file);
    console.log(hashed);
    await Hash.uploadFile(hashed,filename.slice(8));
    callback();
}