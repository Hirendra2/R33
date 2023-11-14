var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_HRewards.json", "utf-8");
const abi1 = fs.readFileSync("./abis/abi_Stable.json", "utf-8");

const schedule = require("node-schedule");

//const job = schedule.scheduleJob("20-55 * *  * *", function () {

const getSolidData = async () => {
  async function RewardTransfer() {
    var myAddress = process.env.HREWARDS_ADDRESS;
    var privateKey = process.env.HREWARDS_PRIVATEKEY;
    var contractAddress = process.env.HReward;
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, contractAddress, {
      from: myAddress,
    });
     
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      value: "0x0",
      data: contract.methods.gorewards().encodeABI(),
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
          return receipt.transactionHash;
          // return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          // return rejects(err);
        });
      })
      .catch((err) => {
        console.log(err);
        // return rejects(err);
      });

    // });
  }
  RewardTransfer();

  async function StableTransfer() {
    var myAddress = process.env.STABLE_ADDRESS;
    var privateKey = process.env.STABLE_PRIVATEKEY;
    var contractAddress = process.env.Hstable;
    const abiArray1 = JSON.parse(abi1);
    var contract = new web3.eth.Contract(abiArray1, contractAddress, {
      from: myAddress,
    });
     
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: contractAddress,
      value: "0x0",
      data: contract.methods.gorewards().encodeABI(),
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
          return receipt.transactionHash;
          // return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          // return rejects(err);
        });
      })
      .catch((err) => {
        console.log(err);
        // return rejects(err);
      });

    // });
  }
  StableTransfer();

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
};

let rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
rule2.hour = 00;
rule2.minute = 06;
schedule.scheduleJob(rule2, function () {
    console.log('This runs at 3:10AM every Friday, Balance Update.');
    getSolidData().then((res) => {
        console.log("&&**", res);
    }).catch((err) => {
        console.log("ERRRRRRRRRR", err);
    });
});



module.exports = {
  getSolidData,}
