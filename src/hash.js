const ContractHash = artifacts.require("ContractHash");
const { extract } = require("./extract");
const filename = "../docs/6103.png";

module.exports = async function StoreHash(callback){
    const Hash = await ContractHash.deployed();
    let hashed = await extract(filename);
    console.log(hashed);
    var d1 = new Date();
    await Hash.uploadFile(hashed,filename.slice(8));
    var d2 = new Date();
    console.log("Time taken : "+Math.abs((d2.getSeconds()-d1.getSeconds()))+" s");
    callback();
}