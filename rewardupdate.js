var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_HRewards.json", "utf-8");
const schedule = require("node-schedule");
const abi1 = fs.readFileSync('./abis/abi_Stable.json','utf-8');

  const getSolidData = async () => {
    return new Promise(async function executor(resolve, reject) {
    const rates = {
      url: "http://165.22.217.204:3333/getHSBalances",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };

    await axios(rates).then(async (response) => {
      var rate = response.data.data;
     // var rates = web3.utils.toWei(rate, "ether");

      console.log(rate);

      FUSDTransfer(rate);
    });

    async function FUSDTransfer(rate) {
      var myAddress = process.env.HREWARDS_ADDRESS;
      var privateKey = process.env.HREWARDS_PRIVATEKEY;
      var contractAddress = process.env.HReward;

      const abiArray = JSON.parse(abi);
      var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress,
      });
      var gasPriceGwei = "22";
      console.log("gasPriceGwei", gasPriceGwei);
      var gasLimit = 800000;
      console.log("gasLimit", gasLimit);

      var rawTransaction = {
        from: myAddress,
        gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        gasLimit: web3.utils.toHex(gasLimit),
        to: contractAddress,
        value: "0x0",
        data: contract.methods.Tpool(rate).encodeABI(),
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
            // return receipt.transactionHash;
            return resolve(receipt.transactionHash);
          });
          sentTx.on("error", (err) => {
            console.log(err);
            return rejects(err);
          });
        })
        .catch((err) => {
          console.log(err);
          return rejects(err);
        });

      // });
    }
  });
  };
 ;

  const getSolidData1 = async () => {
    return new Promise(async function executor(resolve, reject) {
    const rates = {
      url: "http://165.22.217.204:3333/getHSBalances",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };

    await axios(rates).then(async (response) => {
      var rate = response.data.data;

      //var rates = web3.utils.toWei(rate, "ether");

      console.log(rate);

      FUSDTransfer(rate);
    });

    async function FUSDTransfer(rate) {
      var myAddress = process.env.STABLE_ADDRESS;
      var privateKey = process.env.STABLE_PRIVATEKEY;
      var contractAddress = process.env.Hstable;

      const abiArray = JSON.parse(abi1);
      var contract = new web3.eth.Contract(abiArray, contractAddress, {
        from: myAddress,
      });
      var gasPriceGwei = "22";
      console.log("gasPriceGwei", gasPriceGwei);
      var gasLimit = 800000;
      console.log("gasLimit", gasLimit);

      var rawTransaction = {
        from: myAddress,
        gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        gasLimit: web3.utils.toHex(gasLimit),
        to: contractAddress,
        value: "0x0",
        data: contract.methods.Tpool(rate).encodeABI(),
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
            // return receipt.transactionHash;
            return resolve(receipt.transactionHash);
          });
          sentTx.on("error", (err) => {
            console.log(err);
            return reject(err);
          });
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });

      // });
    }
  });
  };

  let rule2 = new schedule.RecurrenceRule();
  rule2.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
  rule2.hour = 23;
  rule2.minute = 58;
  schedule.scheduleJob(rule2, function () {
      console.log('This runs at 3:10AM every Friday, reward update.');
      getSolidData().then((res) => {
          console.log("&&**", res);
      }).catch((err) => {
          console.log("ERRRRRRRRRR", err);
      });
  });


  let rule3 = new schedule.RecurrenceRule();
  rule3.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
  rule3.hour = 23;
  rule3.minute = 59;
  schedule.scheduleJob(rule3, function () {
      console.log('This runs at 3:10AM every Friday, reward update .');
      getSolidData1().then((res) => {
          console.log("&&**", res);
      }).catch((err) => {
          console.log("ERRRRRRRRRR", err);
      });
  });


  module.exports = {
    getSolidData,
    getSolidData1
  }