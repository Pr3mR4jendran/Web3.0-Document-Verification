import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import ContractHash from "./ContractHash.json";
import AWS from 'aws-sdk'
import swal from 'sweetalert';
import Spinner from 'react-spinner-material';
const { fromInstanceMetadata } = require("@aws-sdk/credential-providers");
const { extractS3 } = require("./extractS3");
require('dotenv').config()

const s3 = new AWS.S3({
  credentials: fromInstanceMetadata({
    // Optional. The connection timeout (in milliseconds) to apply to any remote requests.
    // If not specified, a default value of `1000` (one second) is used.
    timeout: 1000,
    // Optional. The maximum number of times any HTTP connections should be retried. If not
    // specified, a default value of `0` will be used.
    maxRetries: 0,
  }),
  //accessKeyId: process.env.REACT_APP_IAM_USER_KEY,
  //secretAccessKey: process.env.REACT_APP_IAM_USER_SECRET,
  //Bucket: "smartblocks-docs"
});

const s3download = function (params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
          reject(err);
      } else {
        console.log("Successfully dowloaded data from bucket");
        resolve(data);
      }
    });
  });
}

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, account: null, balance: null, spinnervisible: false};

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
    this.setState({spinnervisible:true})
    var bufferHash = await document.getElementById("inputElement").files[0].arrayBuffer();
    const view = new Uint8Array(bufferHash);
    console.log(view)
    var hashed = await extractS3(view);
    console.log(hashed);
    await contract.methods.uploadFile(hashed,filename).send({from: account});
    swal("Successfully uploaded file to blockchain!")
    this.setState({spinnervisible:false})
  }

  HashS3 = async () => {
    const { account, contract } = this.state;
    const params = {
      Bucket: "smartblocks-docs",
      Key: document.getElementById("S3input").value
    };
    try{
      this.setState({spinnervisible:true})
      var result = await s3download(params);
      var hashed = await extractS3(result.Body);
      console.log(hashed);
      await contract.methods.uploadFile(hashed,params.Key).send({from: account});
      swal("Successfully uploaded file to blockchain!")
      this.setState({spinnervisible:false})
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
      this.setState({spinnervisible:true})
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
      this.setState({spinnervisible:false})
    }
    catch(err){
      swal(err);
    }
  }

  Query = async () => {
    const { contract } = this.state;
    this.setState({spinnervisible:true})
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
    this.setState({spinnervisible:false})
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta charSet="utf-8" />
        <meta name="keywords" content="SmartBlocks Document Verification System"/>
        <meta name="description" content=""/>
        <title>Home</title>
        <link rel="stylesheet" href="nicepage.css" media="screen"/>
        <link rel="stylesheet" href="Home.css" media="screen"/>
        <meta name="generator" content="Nicepage 4.13.4, nicepage.com"/>
        <link
          id="u-theme-google-font"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i|Open+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i"
        />
        <link
          id="u-page-google-font"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Titillium+Web:200,200i,300,300i,400,400i,600,600i,700,700i,900"
        />
        <meta name="theme-color" content="#478ac9"/>
        <meta property="og:title" content="Home"/>
        <meta property="og:type" content="website"/>
        <header className="u-clearfix u-header u-header" id="sec-8763">
          <div className="u-clearfix u-sheet u-sheet-1">
            <a
              href="https://www.integrauae.com"
              className="u-align-left u-image u-logo u-image-1"
              title="Integra"
              data-image-width={349}
              data-image-height={76}
            >
              <img src="images/image.png" className="u-logo-image u-logo-image-1" alt="Integra Logo" style={{paddingLeft:"50px"}}/>
            </a>
          </div>
        </header>
        <section
          className="u-align-center u-black u-clearfix u-section-1"
          id="carousel_e398"
        >
          <div className="u-clearfix u-sheet u-sheet-1">
            <h2 className="u-custom-font u-font-titillium-web u-text u-text-1">
              SmartBlocks Document Verification System
            </h2>
            <div className="u-align-center u-list u-list-1">
              <div className="u-repeater u-repeater-1">
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-1">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-1"
                      onClick={this.Bal}
                    >
                      View ETH BALANCE
                    </button>
                  </div>
                </div>
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-2">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-2"
                      onClick={this.List}
                    >
                      LIST STORED FILES
                    </button>
                  </div>
                </div>
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-3">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-3"
                      onClick={this.Query}
                    >
                      Check local file Integrity
                    </button>
                  </div>
                </div>
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-4">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-4"
                      onClick={this.QueryS3}
                    >
                      CHECK S3 FILE INTEGRITY
                    </button>
                  </div>
                </div>
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-5">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-5"
                      onClick={this.Hash}
                    >
                      STORE A LOCAL FILE
                    </button>
                  </div>
                </div>
                <div className="u-container-style u-list-item u-repeater-item">
                  <div className="u-container-layout u-similar-container u-container-layout-6">
                    <button
                      className="u-btn u-button-style u-custom-font u-custom-item u-font-titillium-web u-palette-2-base u-btn-6"
                      onClick={this.HashS3}
                    >
                      STORE AN S3 FILE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <center><Spinner id="spinner" radius={50} color={"#FF0000"} stroke={2} visible={this.state.spinnervisible} /></center>
            <br/><br/><br/>
            <div>
              <input className="u-align-center" type='file' id='inputElement'></input>
            </div>
            <br/><br/><br/>
            <div>
              <input className="u-align-center" style={{color:"black"}} id='S3input'></input>
            </div>
            <br/><br/><br/>
            <div>
              <p
                className="u-custom-item u-text u-text-default u-text-2"
                id="text-box"
              />
            </div>
            <br/><br/><br/>
          </div>
          <p className="u-custom-font u-font-titillium-web u-small-text u-text u-text-variant u-text-1" style={{fontSize:"20px"}}>
            © 2022 Integra Technologies FZE
          </p>
          <br/><br/><br/>
        </section>
      </>
    );
  }
}

export default App;