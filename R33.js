var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const { response } = require("express");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_entry.json", "utf-8");


const R3333 = async (req, res, next) => {
    var myAddress = process.env.POOL_ADDRESS;
    var privateKey = process.env.POOL_PRIVATEKEY;
    var user = req.body.user;
    var amount = req.body.amount;
  
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      { from: myAddress }
    );
  
    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");
  
     
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
      data: contract.methods.TradeKiyuser(user,amounts).encodeABI(),
      chainId: chainID,
    };
    console.log( `Raw of Transaction: \n${JSON.stringify( rawTransaction, null,
        "\t"
      )}\n------------------------`
    );
  
    const signPromise = web3.eth.accounts.signTransaction( rawTransaction, privateKey);
  
    signPromise.then((signedTx) => {
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

const bridgeamt = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.UsdtToFU(myAddress).call();
  console.log(getalluser);
  res.status(200).send({ status: true, data: getalluser});
};

const usedbridgeamt = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.TotalUsdtToFU(myAddress).call();
  console.log(getalluser);
  res.status(200).send({ status: true, data: getalluser});
};

const getTotalR33allocated = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.TotalR33allocated().call();
 // var amounts = web3.utils.fromWei(getalluser, "ether");
  //var amountss = web3.utils.fromWei(amounts, "ether");

  console.log(getalluser);
  res.status(200).send({ status: true, data: getalluser});
};

const getR33allocated = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.R33allocated(myAddress).call();
  console.log(getalluser);
  res.status(200).send({ status: true, data: getalluser });
};

const getTotalLPallocated = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.TotalLPallocated().call();
  var amounts = web3.utils.fromWei(getalluser, "ether");
  var amountss = web3.utils.fromWei(amounts, "ether");

  console.log(amountss);
  res.status(200).send({ status: true, data: amountss });
};

const Fusd = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var user = req.body.user;
  var balance = req.body.balance;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
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
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.LPAmt(user,amount).encodeABI(),
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

const Fusdnew = async (user, balance) => {
  return new Promise(async (resolve, reject) => {
  let myAddress = process.env.POOL_ADDRESS;
  let privateKey = process.env.POOL_PRIVATEKEY;
  // var user = req.body.user;
  // var balance = req.body.balance;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
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
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.LPAmt(user,amount).encodeABI(),
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
const updateR3333 = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
 // var user = req.body.user;
  var amount = req.body.amount;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
    { from: myAddress }
  );

  var chainID = await web3.eth.net.getId();

  console.log("tttt",amount)
  console.log(`ChainID: ${chainID}\n------------------------`);
 //var amounts = web3.utils.toWei(amount.toString(), "ether");

   
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
    data: contract.methods.TotalR33allocatedadd(amount).encodeABI(),
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

const Fusdadd = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var user = req.body.user;
  var balance = req.body.balance;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
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
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.UsdtToFUadd(user,amount).encodeABI(),
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

const newR3333 = async (user,amount) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
    { from: myAddress }
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts = web3.utils.toWei(amount, "ether");

   
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
    data: contract.methods.TradeKiyuser(user,amounts).encodeABI(),
    chainId: chainID,
  };
  console.log( `Raw of Transaction: \n${JSON.stringify( rawTransaction, null,
      "\t"
    )}\n------------------------`
  );

  const signPromise = web3.eth.accounts.signTransaction( rawTransaction, privateKey);

  signPromise.then((signedTx) => {
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
const Fusdsub = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var user = req.body.user;
  var balance = req.body.balance;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
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
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.UsdtToFUsub(user,amount).encodeABI(),
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

const R3333sub = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var user = req.body.user;
  var amount = req.body.amount;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.CONTRACT_ADDRESS,
    { from: myAddress }
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts = web3.utils.toWei(amount, "ether");

   
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
    data: contract.methods.R33allocatedsub(user,amounts).encodeABI(),
    chainId: chainID,
  };
  console.log( `Raw of Transaction: \n${JSON.stringify( rawTransaction, null,
      "\t"
    )}\n------------------------`
  );

  const signPromise = web3.eth.accounts.signTransaction( rawTransaction, privateKey);

  signPromise.then((signedTx) => {
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
    
    R3333,
    Fusdnew,
    bridgeamt,
    getTotalR33allocated,
    getR33allocated,
    getTotalLPallocated,
    Fusd,
    updateR3333,
    Fusdadd,
    newR3333,
    usedbridgeamt ,
    Fusdsub ,
    R3333sub
    
  };
  