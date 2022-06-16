const ContractHash = artifacts.require("ContractHash");
const { extract } = require("./extract");
const filename = "../docs/6103.png";

module.exports = async function CheckHash(callback){
    const Hash = await ContractHash.deployed();
    let hashed = await extract(filename);
    var total = await Hash.count();
    console.log("Total number of files stored in the blockchain: " + total);
    var res = await Hash.checkFile(hashed);
    if(res == false){
        console.log("The file either does not exist in the blockchain or has been tampered with!");
    }
    else{
        console.log("The file is authentic.");
        var index = Number(await Hash.getFileNo(hashed));
        console.log("File No. : "+index);
        var name =  await Hash.getFileName(index);
        console.log("File Name : "+name);
    }
    callback();
}