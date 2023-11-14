var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_HRewards.json", "utf-8");

const schedule = require("node-schedule");

//const job = schedule.scheduleJob("20-55 * *  * *", function () {

const reward = async () => {
  return new Promise(async function executor(resolve, reject) {
    // await sleep();
    const hndaddress = {
      url: "http://165.22.217.204:3333/get24hndadd",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };

    var data = JSON.stringify({
      "cleardata": false
    });
    const longaddress = {


      url: "http://64.227.177.68:8565/getTop5MND24h",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },data:data
    };

    await axios(hndaddress).then(async (response) => {
      newAddress1 = response.data.data;
      console.log(newAddress1);

      await axios(longaddress).then(async (response) => {
        newAddress2 =response.data.data[0].parent;
        console.log(response.data.data[0].parent);
      });
      async function FUSDTransfer() {
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
          data: contract.methods.rewards(newAddress1, newAddress2).encodeABI(),
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
          }).catch((err) => {
            console.log(err);
            return reject(err);
          });

        // });
      }
      FUSDTransfer();

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
      let statuss = true
      var data = JSON.stringify({
        cleardata: statuss,
      });
  
      var config = {
        method: "post",
        url: "http://64.227.177.68:8565/getTop5MND24h",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
  
      axios(config).then(async function (response) {
        console.log("delete",response)
      })

    });
  });
};


//});

console.log("The answer to life, the universe, and everything!");

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

let rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
rule2.hour = 00;
rule2.minute = 10;
schedule.scheduleJob(rule2, function () {
    console.log('This runs at 3:10AM every Friday, three Reward.');
    reward().then((res) => {
        console.log("&&**", res);
    }).catch((err) => {
        console.log("ERRRRRRRRRR", err);
    });
});



module.exports = {
  reward,}
