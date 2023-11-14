var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require('dotenv').config()
const fs = require('fs');
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync('./abis/abi_entry.json','utf-8');

const swapFufiToFusd = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');
  
  var gasPriceGwei = 50;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: amounts,
    data: contract.methods.buyTokens().encodeABI(),
    chainId: chainID,
  };
  console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction,null,"\t")}\n------------------------`);

  const signPromise = web3.eth.accounts.signTransaction(rawTransaction,privateKey);

  signPromise
    .then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        res.status(201).send({status:true,msg:receipt.transactionHash})
      });
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const swapFusdToFufi = async (req, res, next) => {
    var myAddress = req.body.myAddress;
    var privateKey = req.body.privateKey;
    var amount = req.body.amount;
  
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
  
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {from: myAddress,});
  
    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts =  web3.utils.toWei(amount, 'ether');
    
     
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);
  
    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x",
      data: contract.methods.swapFusdToFufi(amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction,null,"\t")}\n------------------------`);
  
    const signPromise = web3.eth.accounts.signTransaction(rawTransaction,privateKey);
  
    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
  
          res.status(201).send({status:true,msg:receipt.transactionHash})
        });
        sentTx.on("error", (err) => {
          console.log(err);
          res.status(404).send({status:false,msg:"Failed"})
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };


const getFusdBalance = async (req, res, next) => {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
    var getBalanceInWeis = await contract.methods.rate().call();
    var balances =   web3.utils.fromWei(getBalanceInWeis,'ether')
    console.log((balances));
    res.status(201).send({status:true,data:balances})
  };

  const getrate = async (req, res, next) => {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
    var getBalanceInWeis = await contract.methods.rate().call();
    var balances =   web3.utils.fromWei(getBalanceInWeis,'ether')
    console.log((balances));
    res.status(201).send({status:true,data:balances})
  };




module.exports = {
    swapFufiToFusd,
    swapFusdToFufi,
    getFusdBalance,
    getrate
}
