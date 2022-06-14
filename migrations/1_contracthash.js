const ContractHash = artifacts.require("ContractHash");

module.exports = function(deployer) {
  deployer.deploy(ContractHash);
};