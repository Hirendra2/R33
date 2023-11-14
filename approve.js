var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require('dotenv').config()
const fs = require('fs');
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync('./abis/approve.json','utf-8');


const approves  = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;
  var entryadd = process.env.CONTRACT_ADDRESS;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.TOKEN_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.approve(entryadd,amounts).encodeABI(),
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

const Tokentransfer   = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var receiver = req.body.receiver;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.TOKEN_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.transfer(receiver,amounts).encodeABI(),
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

const getBalance = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

 

  var getrank = await contract.methods.balanceOf(myAddress).call();
  console.log((getrank));
  var totalDirectR =   web3.utils.fromWei(getrank,'ether')
  res.status(201).send({status:true,data:totalDirectR})
};

const Fusdtransfer   = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var receiver = req.body.receiver;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

   
  var gasPriceGwei =  53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.TOKEN_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.transfer(receiver,amounts).encodeABI(),
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

const FusdHolders = async (req, res, next) => {
  let user1add  = "0x57F02a4d5Db9b879dd5f3e42cE6Df3bFe202B527"
  let user2add  = "0xe5a8eD8D5FF2247E9F51c823A8AD355CD9AFF842"

   const abiArray = JSON.parse(abi);
   var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS);
   let userbalance = await contract.methods.balanceOf(user1add).call();
   let user2balance = await contract.methods.balanceOf(user2add).call();
   let totalSupply = await contract.methods.totalSupply().call();
   let userbalance1 =web3.utils.fromWei(userbalance.toString(), 'ether');
   let user2balance2 = web3.utils.fromWei(user2balance.toString(), 'ether');
   let totalSupply1 = web3.utils.fromWei(totalSupply.toString(), 'ether');

   let amt =( parseFloat(totalSupply1)-(parseFloat(user2balance2)+parseFloat(userbalance1)))
   console.log("33444443",amt);
   let amount = Math.trunc(amt)

   res.status(201).send({status:true,data:amount})
 
};
const praveensir = async (req, res, next) => {
  let user1add  = "0x57F02a4d5Db9b879dd5f3e42cE6Df3bFe202B527"
   const abiArray = JSON.parse(abi);
   var contract = new web3.eth.Contract(abiArray, process.env.TOKEN_CONTRACT_ADDRESS);
   let userbalance = await contract.methods.balanceOf(user1add).call();
   let totalSupply = await contract.methods.totalSupply().call();

   var amounts =  web3.utils.fromWei(userbalance.toString(), 'ether');
   var amounts1 =  web3.utils.fromWei(totalSupply.toString(), 'ether');
  let userbalance1 = parseFloat(amounts);
  let totalSupply1 =parseFloat(amounts1);
  let amount = totalSupply1-userbalance1

  res.status(201).send({status:true,data:amount})
 
};

const Fufibalance = async (req, res, next) => {
  return new Promise(async function executor(resolve, reject) {
    var config = {
      method: "post",
      url: "http://165.22.217.204:3333/getalluser",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then(async function (response) {
        newAddress1 = response.data.data;
        totaladdress = response.data.data.length;
       // console.log("ttttt", totaladdress);
        const propertyValues = Object.values(newAddress1);
        const web3 = new Web3(new Web3.providers.HttpProvider(url));
        let amount = 0;
        let count = 1;
        propertyValues.forEach(async (element, i, totaladdress) => {
          await sleep(i * 200);
         // console.log("ttttt", totaladdress.length);
          web3.eth.getBalance(element, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              var amounts = web3.utils.fromWei(result, "ether");
           //   console.log("cccc", count);
           //   console.log("oldamount", amount);
              amount = parseFloat(amount) + parseFloat(amounts);
              count = count + 1;
              if (totaladdress.length == count) {
                res.status(201).send({ status: true, data: amount });
              }
            }
            setTimeout(() => {
             // console.log("JJJJJJJJJJJJ", amount);
              return resolve(amount);
            }, 5000);
          });
        });
      })
      .catch(function (error) {
        console.log(error);
        return reject("failed");
      });
  });
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

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
    approves,
    getBalance,
    Tokentransfer,
    Fusdtransfer,
    FusdHolders,
    praveensir,
    Fufibalance
  };
  