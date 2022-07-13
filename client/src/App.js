import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import ContractHash from "./ContractHash.json";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, account: null};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Get the contract instance.
      const networkId = 5777;
      const deployedNetwork = ContractHash.networks[networkId];
      const instance = new web3.eth.Contract(
        ContractHash.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, account: account });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Failed to load web3, accounts, or contract. Check console for details.',
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>SmartBlocks Document Storage System</h1>

        <button /*onClick={this.Mint}*/>Store a doc in the blockchain</button>
        <button /*onClick={this.Query}*/>View details of currently stored docs</button>

        <div id='text-area'>
          <p id="text1"></p>
          <p id="text2"></p>
          <p id="text3"></p>
          <p id="text4"></p>
          <p id="color0"></p>
          <p id="color1"></p>
          <p id="color2"></p>
          <p id="color3"></p>
          <p id="color4"></p>
          <p id="color5"></p>
          <p id="color6"></p>
          <p id="color7"></p>
          <p id="color8"></p>
          <p id="color9"></p>
        </div>
      </div>
    );
  }
}

export default App;