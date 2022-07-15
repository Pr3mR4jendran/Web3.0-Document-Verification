import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import ContractHash from "./ContractHash.json";
const { extractfile } = require("./extractfile");

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, account: null, balance: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      var balance = await web3.eth.getBalance(account)
      const floatbal = web3.utils.fromWei(balance,'ether')

      // Get the contract instance.
      const networkId = 5777;
      const deployedNetwork = ContractHash.networks[networkId];
      const instance = new web3.eth.Contract(
        ContractHash.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, account: account, balance: floatbal });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
      );
      console.error(error);
    }
  };

  Bal = async () => {
    const { balance } = this.state;
    document.getElementById("text1").innerHTML = balance + " ETH"
  }

  Query = async () => {
    const { contract } = this.state;
    const filename = "../../docs/bigfile.txt"
    let hashed = await extractfile(filename)
    var total = await contract.count();
    document.getElementById("text2").innerHTML = "Number of files stored in the blockchain = "+total;
    var res = await contract.checkFile(hashed);
    if(res === false){
      document.getElementById("text3").innerHTML = "The file either does not exist in the blockchain or has been tampered with!";
    }
    else{
      document.getElementById("text4").innerHTML = "The file is authentic.";
      var index = Number(await contract.getFileNo(hashed));
      document.getElementById("text5").innerHTML = "File No. : "+index;
      var name =  await contract.getFileName(index);
      document.getElementById("text6").innerHTML = "File Name : "+name;
      var owner =  await contract.getOwner(index);
      document.getElementById("text7").innerHTML = "File Owner : "+owner;
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>SmartBlocks Document Storage System</h1>

        <button onClick={this.Bal}>View ETH balance</button>
        <button /*onClick={this.Mint}*/>Store a doc in the blockchain</button>
        <button onClick={this.Query}>Check integrity of local file</button>

        <div id='text-area'>
          <p id="text1"></p>
          <p id="text2"></p>
          <p id="text3"></p>
          <p id="text4"></p>
          <p id="text5"></p>
          <p id="text6"></p>
          <p id="text7"></p>
          <p id="text8"></p>
          <p id="text9"></p>
          <p id="text10"></p>
          <p id="text11"></p>
          <p id="text12"></p>
          <p id="text13"></p>
          <p id="text14"></p>
        </div>
      </div>
    );
  }
}

export default App;