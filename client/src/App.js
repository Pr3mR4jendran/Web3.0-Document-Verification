import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import ContractHash from "./ContractHash.json";
const { extractS3 } = require("./extractS3");

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
    document.getElementById("text-box").innerHTML = balance + " ETH"
  }

  getFileText = function () {
    return new Promise((resolve, reject) => {
      const file = document.getElementById("inputElement").files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
          resolve(evt.target.result);
        };
        reader.onerror = (evt) => {
          console.log("error reading file");
        };
      }
    })
  }

  Hash = async () => {
    const filename = document.getElementById("inputElement").files[0].name;
    const { account, contract } = this.state;
    var textForHash = await this.getFileText();
    var hashed = await extractS3(textForHash)
    console.log(hashed);
    await contract.methods.uploadFile(hashed,filename).send({from: account});
    document.getElementById('text-box').innerHTML = "Successfully uploaded file to blockchain!";
  }

  Query = async () => {
    const { contract } = this.state;
    var textForHash = await this.getFileText();
    var hashed = await extractS3(textForHash)
    console.log(hashed);
    var total = await contract.methods.count().call();
    var res = await contract.methods.checkFile(hashed).call();
    if(res === false){
      document.getElementById("text-box").innerHTML = "Number of files stored in the blockchain = " + total + "<br></br>The file either does not exist in the blockchain or has been tampered with!";
    }
    else{
      var index = Number(await contract.methods.getFileNo(hashed).call());
      var name =  await contract.methods.getFileName(index).call();
      var owner =  await contract.methods.getOwner(index).call();
      document.getElementById("text-box").innerHTML = "The file is authentic." + "<br></br>" + "File No. : " + index + "<br></br>" + "File Name : " + name + "<br></br>" + "File Owner : " +owner;
    }
  }

  List = async () => {
    const { contract } = this.state;
    var total = await contract.methods.count().call();
    let temp = [];
    for(let i=1;i<=total;i++){
      temp[i] = await contract.methods.getFileName(i).call();
    }
    let finalstring = ""
    for(let i=1;i<=total;i++){
      finalstring += (temp[i] +"<br></br>")
    }
    document.getElementById("text-box").innerHTML = finalstring;
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta charSet="utf-8" />
  <meta
    name="keywords"
    content="SmartBlocks: A trustworthy document verification tool"
  />
  <meta name="description" content="" />
  <title>SmartBlocks</title>
  <link rel="stylesheet" href="nicepage.css" media="screen" />
  <link rel="stylesheet" href="Home.css" media="screen" />
  <meta name="generator" content="SmartBlocks" />
  <link
    id="u-theme-google-font"
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i"
  />
  <link
    id="u-page-google-font"
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Montserrat:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i"
  />
  <meta name="theme-color" content="#232b79" />
  <meta property="og:title" content="SmartBlocks" />
  <meta property="og:type" content="website" />
  <header className="u-clearfix u-header u-header" id="sec-a184">
    <a
      href="https://www.integrauae.com"
      className="u-image u-logo u-image-1"
      data-image-width={466}
      data-image-height={194}
    >
      <img src="images/image.png" className="u-logo-image u-logo-image-1" />
    </a>
  </header>
  <section
    className="u-align-center u-clearfix u-image u-shading u-section-1"
    id="carousel_5ad0"
    src=""
    data-image-width={1782}
    data-image-height={1080}
  >
    <h1 className="u-align-center u-custom-font u-font-montserrat u-text u-text-body-alt-color u-title u-text-1">
      Smart Blocks Document Verification
    </h1>
    <div className="u-align-center u-expanded-width u-list u-list-1">
      <div className="u-repeater u-repeater-1">
        <div className="u-align-center u-container-style u-list-item u-repeater-item">
          <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-1">
            <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-1" onClick={this.Bal}>
              View Eths Balance
            </button>
          </div>
        </div>
        <div className="u-align-center u-container-style u-list-item u-repeater-item">
          <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-2">
            <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-2" onClick={this.Query}>
              Check File Integrity
            </button>
          </div>
        </div>
        <div className="u-align-center u-container-style u-list-item u-repeater-item">
          <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-3">
            <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-3" onClick={this.Hash}>
              Store a document
            </button>
          </div>
        </div>
        <div className="u-align-center u-container-style u-list-item u-repeater-item">
          <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-4">
            <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-4" onClick={this.List}>
              List all stored files
            </button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <input className="u-align-center" type='file' id='inputElement'></input>
    </div>
    <br></br><br></br><br></br>
    <div>
      <p
        className="u-custom-item u-text u-text-default u-text-2"
        id="text-box"
      />
    </div>
  </section>
  <footer
    className="u-align-center u-clearfix u-footer u-grey-80 u-footer"
    id="sec-b796"
  >
    <div className="u-clearfix u-sheet u-sheet-1">
      <p className="u-small-text u-text u-text-variant u-text-1">
        © 2022 Integra Technologies FZE
      </p>
    </div>
  </footer>
</>
    );
  }
}

export default App;