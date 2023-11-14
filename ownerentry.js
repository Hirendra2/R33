var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_entry.json", "utf-8");
const abi2 = fs.readFileSync("./abis/levelreward.json", "utf-8");
const abi3 = fs.readFileSync("./abis/referral.json", "utf-8");
var myAddresss = process.env.LEVELREWARD_ADDRESS;
var privateKeys = process.env.LEVELREWARD_PRIVATEKEY;
let count = 0;
const getData = async (address, amount) => {
  await sleep(30000);

  var data = JSON.stringify({
    myAddress: address,
  });

  var config = {
    method: "post",
    url: "http://165.22.217.204:3333/user_info",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(async function (response) {
      if (
        response.data.data.referred_by !=
        "0x0000000000000000000000000000000000000000"
      ) {
        if (response.data.data.referred) {
          count += 1;
          if (count <= 33) {
            var counts = `Level ${count}`;
            console.log(response.data.data.referred_by);
            makeTransaction(
              response.data.data.referred_by,
              counts,
              address,
              amount
            );
            return getData(response.data.data.referred_by);
          } else {
            console.log({ status: true });
            //  return res.send({ status: true });
          }
        } else {
          return "0";
        }
      } else {
        console.log({ status: true });
        //  return res.send({ status: true });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};
const ownerentry = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var address = req.body.address;
  var parent = req.body.parent;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);
  var amounts = web3.utils.toWei(amount, "ether");

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
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
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.owenstart(address, amounts, parent).encodeABI(),
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

        var data = JSON.stringify({
          // myAddress: myAddress,
          //privateKey: privateKey,
          parentadd: parent,
          childadd: address,
        });
        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/ownerreferral",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        //   console.log("config  >> ", data);

        axios(config)
          .then(async (res) => {
            // console.log("@@#@@@@@@", res);
            getData(address, amount);
            var data1 = JSON.stringify({
              myAddress: myAddress,
            });
            var config = {
              method: "post",
              url: "http://165.22.217.204:3333/setuser",
              headers: {
                "Content-Type": "application/json",
              },
              data: data1,
            };
            await axios(config)
              .then((res) => {
                //  console.log("TotalEra",res)
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
            response = { status: false, msg: "Failed" };
            // return reject(response);
          });

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

async function makeTransaction(newAddress, counts, chaild, amount) {
  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT,
    { from: myAddresss }
  );

   
  console.log(gasPrices);
  var gasPriceGwei = 53;
  //let amountss = amount/100;
  // let amountsss = (amount-(amountss)/3);
  var amounts = web3.utils.toWei(amount.toString(), "ether");

  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddresss,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.LEVELREWARD_CONTRACT,
    value: "0x0",
    data: contract.methods
      .levelreawrd(newAddress, chaild, counts, amounts)
      .encodeABI(),
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
    privateKeys
  );

  signPromise
    .then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        // res.status(201).send({status:true,msg:"https://fufiscan.com/tx/" +receipt.transactionHash})
      });
      sentTx.on("error", (err) => {
        console.log(err);
        //    res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

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
  ownerentry,
};
