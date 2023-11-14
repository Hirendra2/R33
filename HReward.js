var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_HRewards.json", "utf-8");

const HNDclaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward, {
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
    to: process.env.HReward,
    value: "0x0",
    data: contract.methods.HNDclaim().encodeABI(),
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
      sentTx.on("receipt", async (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
       await sleep(20000);
        var data = JSON.stringify({
          myAddress: myAddress,
          amount: amount,
        });

        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/TotalEranupdates",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then((res) => {
            console.log("Hndaddd");
          })
          .catch(function (error) {
            console.log(error);
          });
        res
          .status(201)
          .send({
            status: true,
            msg: "https://fufiscan.com/tx/" + receipt.transactionHash,
          });
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

const getTotalHNDReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var HNDReward = await contract.methods.ClaimedHnd(myAddress).call();
  console.log(HNDReward);
  // var amounts =  web3.utils.toWei(getrank, 'ether');

  res.status(201).send({ status: true, data: HNDReward });
};


const getHNDReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var HNDReward = await contract.methods.hnd(myAddress).call();
  console.log(HNDReward);
  //var amounts =  web3.utils.toWei(HNDReward, 'ether');

  res.status(201).send({ status: true, data: HNDReward });
};

const Highchainclaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward, {
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
    to: process.env.HReward,
    value: "0x0",
    data: contract.methods.Highchainclaim().encodeABI(),
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
      sentTx.on("receipt", async (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
       await sleep(20000);
        var data = JSON.stringify({
          myAddress: myAddress
        });

        var data = JSON.stringify({
          myAddress: myAddress,
          amount: amount,
        });

        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/TotalEranupdates",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then((res) => {
            console.log("Hdradd");
          })
          .catch(function (error) {
            console.log(error);
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
const getHighchainReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);
  var getrank = await contract.methods.highchain(myAddress).call();
  console.log(getrank);
  res.status(201).send({ status: true, data: getrank });
};

const getTotalHighchainReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var HNDReward = await contract.methods.ClaimedHigh(myAddress).call();
  console.log(HNDReward);
  // var amounts =  web3.utils.toWei(getrank, 'ether');

  res.status(201).send({ status: true, data: HNDReward });
};
const getLongchainId = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var LevelReward = await contract.methods.getlongId(myAddress).call();
  console.log(LevelReward);
  res.status(201).send({ status: true, data: LevelReward });
};

const getLongchainIdetails = async (req, res, next) => {
  var levelId = req.body.levelId;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var LevelReward = await contract.methods.LongLevels(levelId).call();
  console.log(LevelReward);
  res.status(201).send({ status: true, data: LevelReward });
};

const getTotalLongchainReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var amount = await contract.methods.Longchain(myAddress).call();
  console.log(amount);
  // var amounts =   web3.utils.fromWei(amount,'ether')

  res.status(201).send({ status: true, data: amount });
};

const allLongLevelsclaim = async (req, res, next) => {
  var amount = req.body.amount;
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward, {
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
    to: process.env.HReward,
    value: "0x0",
    data: contract.methods.allLongLevelsclaim().encodeABI(),
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
      sentTx.on("receipt", async (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
       //await sleep(20000);
        var data = JSON.stringify({
          myAddress: myAddress,
          amount: amount,
        });

        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/TotalEranupdates",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then((res) => {
            console.log("longadd");
          })
          .catch(function (error) {
            console.log(error);
          });
        res
          .status(201)
          .send({
            status: true,
            msg: "https://fufiscan.com/tx/" + receipt.transactionHash,
          });
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

const getLongchainamt = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);
  var amount = await contract.methods.totalLongLevelsRewards(myAddress).call();
  console.log(amount);

  res.status(201).send({ status: true, data: amount});
};

const getLongchainreming = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);
  var amount = await contract.methods.Longchainreming(myAddress).call();
  console.log(amount);
  //var amounts = web3.utils.fromWei(amount, "ether");
  res.status(201).send({ status: true, data: amount});
};

const gethrewards = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var LevelReward = await contract.methods.hrewards().call();
  console.log(LevelReward);
  res.status(201).send({ status: true, data: LevelReward });
};

const gethndamount = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var LevelReward = await contract.methods.hndamount().call();
  console.log(LevelReward);
  res.status(201).send({ status: true, data: LevelReward });
};

const updatelongrewards = async (req, res, next) => {
  var myAddress = process.env.HREWARDS_ADDRESS;
  var privateKey = process.env.HREWARDS_PRIVATEKEY;
  var user = req.body.user;
  var balance = req.body.balance;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.HReward,
    { from: myAddress }
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
 console.log("HHHHHHggggggggggggggggggggggggggggHHH",balance)
  var amount = web3.utils.toWei(balance.toString(), "ether");
   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.HReward,
    value: "0x0",
    data: contract.methods.Longchainadd(user,amount).encodeABI(),
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

const Longchain = async (req, res, next) => {
  var myAddress =process.env.HREWARDS_ADDRESS;
  var privateKey =process.env.HREWARDS_PRIVATEKEY;
  var longadd = req.body.longadd;
  var chaild = req.body.chaild;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.HReward, {
    from: myAddress,
  });

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);
  var fufifess = web3.utils.toWei(amount, "ether");

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.HReward,
    value: "0x0",
    data: contract.methods.longlevelss(longadd, chaild,fufifess.toString()).encodeABI(),
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
      sentTx.on("receipt", async (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
      
        res
          .status(201)
          .send({
            status: true,
            msg: "https://fufiscan.com/tx/" + receipt.transactionHash,
          });
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
  HNDclaim,
  Highchainclaim,
  getLongchainIdetails,
  getHNDReward,
  getLongchainId,
  getHighchainReward,
  getTotalHNDReward,
  getTotalHighchainReward,
  getTotalLongchainReward,
  allLongLevelsclaim,
  getLongchainreming,
  getLongchainamt,
  gethrewards,
  gethndamount,
  Longchain,
updatelongrewards 
};
