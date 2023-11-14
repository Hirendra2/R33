var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_Stable.json", "utf-8");

const Fuficlaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(req.body);

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable, {
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
    to: process.env.Hstable,
    value: "0x0",
    data: contract.methods.Fuficlaim().encodeABI(),

    chainId: chainID,
  };
  // console.log(
  //   `Raw of Transaction: \n${JSON.stringify(
  //     rawTransaction,
  //     null,
  //     "\t"
  //   )}\n------------------------`
  // );

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

        var data1 = JSON.stringify({
          myAddress: myAddress,
          amount: amount,
        });

        console.log(data1);

        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/TotalEranupdates",
          headers: {
            "Content-Type": "application/json",
          },
          data: data1,
        };
        await axios(config)
          .then((res) => {
            console.log("Fufiadddd");
          })
          .catch(function (error) {
            console.log(error);
          });

        res.status(201).send({
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

const Fusdclaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;
  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable, {
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
    to: process.env.Hstable,
    value: "0x0",
    data: contract.methods.Fusdclaim().encodeABI(),
    chainId: chainID,
  };
  // console.log(
  //   `Raw of Transaction: \n${JSON.stringify(
  //     rawTransaction,
  //     null,
  //     "\t"
  //   )}\n------------------------`
  // );

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

        var data1 = JSON.stringify({
          myAddress: myAddress,
          amount: amount,
        });

        console.log(data1);

        var config = {
          method: "post",
          url: "http://165.22.217.204:3333/TotalEranupdates",
          headers: {
            "Content-Type": "application/json",
          },
          data: data1,
        };

        await axios(config)
          .then((res) => {
            console.log("Fusdadddd");
          })
          .catch(function (error) {
            console.log(error);
          });

        res.status(201).send({
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
const SidClaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;
  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable, {
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
    to: process.env.Hstable,
    value: "0x0",
    data: contract.methods.sidclaim().encodeABI(),
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
      // await sleep(20000);

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
            console.log("sidaddd");
          })
          .catch(function (error) {
            console.log(error);
          });
        res.status(201).send({
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

const gettotalFufiReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);
  var getranks = await contract.methods.totalFufiHolderdR(myAddress).call();
  var getrank = web3.utils.fromWei(getranks, "ether");
  //var getrank =  web3.utils.toWei(getrankss, 'ether');
  console.log(getrank);
  res.status(201).send({ status: true, data: getrank });
};

const getFufiReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);
  var getranks = await contract.methods.FufiHolderds(myAddress).call();
  //var getrank = web3.utils.fromWei(getranks, "ether");
  //var getrank =  web3.utils.toWei(getrankss, 'ether');
  console.log(getranks);
  res.status(201).send({ status: true, data: getranks });
};

const getFusdReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var getrank = await contract.methods.FusdHoldersds(myAddress).call();
  //var getranks = web3.utils.fromWei(getrank, "ether");
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const gettotalFusdReward = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var getrank = await contract.methods.totalFusdHoldersd(myAddress).call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const getSid = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getrank = await contract.methods.sidHolders(myAddress).call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const gettatalSid = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getrank = await contract.methods.totalsidR(myAddress).call();

  res.status(201).send({ status: true, data: getrank });
};

const updatefufisupply = async (req, res, next) => {
  var myAddress = process.env.STABLE_ADDRESS;
  var privateKey = process.env.STABLE_PRIVATEKEY;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable, {
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
    to: process.env.Hstable,
    value: "0x0",
    data: contract.methods.totalfufi(amount).encodeABI(),

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

        res.status(201).send({
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

const gethstable = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var getrank = await contract.methods.hstable().call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};
const getfufisapply = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var getrank = await contract.methods.totalSupply().call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const getfusdsapply = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var getrank = await contract.methods.totalfusdSupply().call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const getfufiamount = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.Hstable);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

  var fufiamountsc = await contract.methods.fufiamount().call();
  console.log(fufiamountsc);

  res.status(201).send({ status: true, data: fufiamountsc });
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
  Fuficlaim,
  getFufiReward,
  getFusdReward,
  Fusdclaim,
  SidClaim,
  getSid,
  updatefufisupply,
  gettotalFufiReward,
  gettotalFusdReward,
  gettatalSid,
  gethstable,
  getfufisapply,
  getfusdsapply,
};
