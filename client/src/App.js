import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import ContractHash from "./ContractHash.json";
import AWS from 'aws-sdk'
import swal from 'sweetalert';
const { extractS3 } = require("./extractS3");
require('dotenv').config()

const s3 = new AWS.S3({
  accessKeyId: process.env.REACT_APP_IAM_USER_KEY,
  secretAccessKey: process.env.REACT_APP_IAM_USER_SECRET,
  Bucket: "smartblocks-docs"
});

const s3download = function (params) {
  return new Promise((resolve, reject) => {
      s3.createBucket({
          Bucket: "smartblocks-docs"
      }, function () {
          s3.getObject(params, function (err, data) {
              if (err) {
                  reject(err);
              } else {
                  console.log("Successfully dowloaded data from bucket");
                  resolve(data);
              }
          });
      });
  });
}

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
    swal(balance + " ETH")
  }

  Hash = async () => {
    const { account, contract } = this.state;
    const filename = document.getElementById("inputElement").files[0].name;
    var bufferHash = await document.getElementById("inputElement").files[0].arrayBuffer();
    const view = new Uint8Array(bufferHash);
    console.log(view)
    var hashed = await extractS3(view);
    console.log(hashed);
    await contract.methods.uploadFile(hashed,filename).send({from: account});
    swal("Successfully uploaded file to blockchain!")
  }

  HashS3 = async () => {
    const { account, contract } = this.state;
    const params = {
      Bucket: "smartblocks-docs",
      Key: document.getElementById("S3input").value
    };
    try{
      var result = await s3download(params);
      var hashed = await extractS3(result.Body);
      console.log(hashed);
      await contract.methods.uploadFile(hashed,params.Key).send({from: account});
      swal("Successfully uploaded file to blockchain!")
    }
    catch(e){
      console.error(e);
    }
  }

  QueryS3 = async () => {
    const { contract } = this.state;
    const params = {
      Bucket: "smartblocks-docs",
      Key: document.getElementById("S3input").value
    };
    try{
      var result = await s3download(params);
      console.log(result.Body)
      var hashed = await extractS3(result.Body);
      console.log(hashed)
      var total = await contract.methods.count().call();
      var res = await contract.methods.checkFile(hashed).call();
      if(res === false){
        swal("Number of files stored in the blockchain = " + total + "\nThe file either does not exist in the blockchain or has been tampered with!")
      }
      else{
        var index = Number(await contract.methods.getFileNo(hashed).call());
        var name =  await contract.methods.getFileName(index).call();
        var owner =  await contract.methods.getOwner(index).call();
        swal("The file is authentic.\nFile No. : " + index + "\nFile Name : " + name + "\nFile Owner : " +owner)
      }
    }
    catch(err){
      swal(err);
    }
  }

  Query = async () => {
    const { contract } = this.state;
    var bufferHash = await document.getElementById("inputElement").files[0].arrayBuffer();
    const view = new Uint8Array(bufferHash);
    console.log(view)
    var hashed = await extractS3(view);
    console.log(hashed);
    var total = await contract.methods.count().call();
    var res = await contract.methods.checkFile(hashed).call();
    if(res === false){
      swal("Number of files stored in the blockchain = " + total + "\nThe file either does not exist in the blockchain or has been tampered with!");
    }
    else{
      var index = Number(await contract.methods.getFileNo(hashed).call());
      var name =  await contract.methods.getFileName(index).call();
      var owner =  await contract.methods.getOwner(index).call();
      //document.getElementById("text-box").innerHTML = "The file is authentic.<br></br>File No. : " + index + "<br></br>File Name : " + name + "<br></br>File Owner : " +owner;
      swal("The file is authentic.\nFile No. : " + index + "\nFile Name : " + name + "\nFile Owner : " +owner)
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
      finalstring += (temp[i] +"\n")
    }
    swal(finalstring);
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
        <header className="u-clearfix u-header u-header" id="sec-a184" style={{minHeight: "75px"}}>
          <a
            href="https://www.integrauae.com"
            className="u-image u-logo u-image-1"
            data-image-width={100}
            data-image-height={75}
            style={{maxHeight:"10px"}}
          >
            <img src="images/image.png" className="u-logo-image u-logo-image-1" alt="Integra Logo" style={{paddingLeft:"60px"}} />
          </a>
        </header>
        <section
          className="u-align-center u-clearfix u-image u-shading u-section-1"
          id="carousel_5ad0"
          src=""
          data-image-width={1782}
          data-image-height={1080}
        >
          <br/>
          <br/>
          <h1 className="u-align-center u-custom-font u-font-montserrat u-text u-text-body-alt-color u-title u-text-1">
            SmartBlocks Document Verification
          </h1>
          <br/>
          <br/>
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
                <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-4">
                  <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-4" onClick={this.List}>
                    List stored files
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
                <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-2">
                  <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-2" onClick={this.QueryS3}>
                    Check File Integrity(S3)
                  </button>
                </div>
              </div>
              <div className="u-align-center u-container-style u-list-item u-repeater-item">
                <div className="u-container-layout u-similar-container u-valign-middle u-container-layout-3">
                  <button className="u-active-white u-border-2 u-border-white u-btn u-button-style u-custom-item u-hover-white u-none u-text-active-black u-text-body-alt-color u-text-hover-black u-btn-3" onClick={this.HashS3}>
                    Store a document(S3)
                  </button>
                </div>
              </div>
            </div>
          </div>
          <br></br><br></br><br></br>
          <div>
            <input className="u-align-center" type='file' id='inputElement'></input>
          </div>
          <br></br><br></br><br></br>
          <div>
            <input className="u-align-center" style={{color:"black"}} id='S3input'></input>
          </div>
          <br></br><br></br><br></br>
          <div>
            <p
              className="u-custom-item u-text u-text-default u-text-2"
              id="text-box"
            />
          </div>
          <br></br><br></br><br></br>
          <p className="u-small-text u-text u-text-variant u-text-1" style={{fontSize:"20px"}}>
            © 2022 Integra Technologies FZE
          </p>
          <br/>
        </section>
      </>
    );
  }
}

export default App;