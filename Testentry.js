var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/Test.json", "utf-8");




const Testentry = async (req, res, next) => {

    var myAddress = req.body.myAddress;
    var privateKey = req.body.privateKey;
    var amount = req.body.amount;
    var id = req.body.id;

  
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    var amounts = web3.utils.toWei(amount, "ether");

    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.TEST_CONTRACT_ADDRESS, {
      from: myAddress,
    });
  
    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
  
     
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);
  
    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.TEST_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.start(id,amounts,"0x769b3411beD3c606e778A35c4Cad1B7c56e4CcAd").encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );
  
    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );
  
    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
  
          res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("error", (err) => {
          console.log(err);
          res.status(404).send({ status: false, msg: "Failed" });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };




const idwithDraw = async (myAddress, privateKey,rankId) => {
  return new Promise(async (resolve, reject) => {


  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.TEST_CONTRACT_ADDRESS,
    { from: myAddress }
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.TEST_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.withDraw(rankId).encodeABI(),
    chainId: chainID,
  };
  console.log(
    `Raw of Transaction: \n${JSON.stringify(
      rawTransaction,
      null,
      "\t"
    )}\n------------------------`
  );

  const signPromise = web3.eth.accounts.signTransaction(
    rawTransaction,
    privateKey
  );

  signPromise.then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
        re1 ={ status: true, msg: receipt.transactionHash };
        return resolve(re1);
        // res.status(201).send({ status: true, msg: receipt.transactionHash });
      });
      sentTx.on("error", (err) => {
        console.log(err);
        let response ={ status: false, msg: "Failed" }
        return reject(response); 
        // res.status(404).send({ status: false, msg: "Failed" });

      });
    }).catch((err) => {
      console.log(err);
    });
  });
};







  async function getCurrentGasPrices() {
    let response = await axios.get(
      "https://ethgasstation.info/json/ethgasAPI.json"
    );
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10,
    };
    return prices;
  }
  
  module.exports = {
    Testentry,
    idwithDraw}




