const ContractHash = artifacts.require("ContractHash");
const { extract } = require("./extract");
const { hashfunc } = require("./hashfunc");
const filename = "../docs/6103 Tampered.png";

module.exports = async function CheckHash(callback){
    const Hash = await ContractHash.deployed();
    let file = await extract(filename);
    let hashed = hashfunc(file);
    console.log(hashed);
    var total = await Hash.count();
    console.log("Total number of files stored in the blockchain: " + total);
    var res = await Hash.checkFile(hashed);
    if(res == false){
        console.log("The file either does not exist in the blockchain or has been tampered with!");
    }
    else{
        console.log("The file is authentic.");
        var index = Number(await Hash.getFileNo(hashed));
        console.log("File number : "+index);
    }
    callback();
}