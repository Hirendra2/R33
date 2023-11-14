var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_sid.json", "utf-8");
const abi1 = fs.readFileSync("./abis/abi_entry.json", "utf-8");

const SidFusd = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let receiver = req.body.receiver;
  let refferalcode = req.body.refferalcode;
  let amount = req.body.amount;
  let type = req.body.type;
  console.log("FFFFF",req.body);
  if (type == "R33Pool") {
    console.log("aa", type);
    await R33(myAddress, amount, privateKey).then(async (r) => {
        console.log("R33***********", r);
        await sidR33poolupdate(myAddress, amount, privateKey).then(async (r) => {
            console.log("sidR33poolupdate***********", r);
            res.status(201).send({ status: true, msg: r });
          }).catch((e) => {
            console.log("eesidR33poolupdate", e);
          });
      }).catch((e) => {
        console.log("eeR33", e);
        res.status(404).send({ status: false, msg: "Failed" });
      });

  } else if (type == "friend") {
    console.log("bb", type);
    await friend(myAddress, receiver, amount, privateKey).then(async (r) => {
        console.log("friend***********", r);
        res.status(201).send({ status: true, msg: r });
      }).catch((e) => {
        console.log("eefriend", e);
        res.status(404).send({ status: false, msg: "Failed" });
      });
  } else if (refferalcode=="1") {
    console.log("norefferalburn");
    await Fusdburn(myAddress, amount, privateKey).then(async (r) => {
        console.log("Fusdburn***********", r);

        await Fufiburn(myAddress, amount).then(async (r) => {
            console.log("Fufiburn***********", r);
            await FUfiBurns(myAddress, amount,privateKey).then(async (r) => {
              console.log("FUfiBurns***********");
              res.status(201).send({ status: true, msg: r.status });
            }).catch((e) => {
              console.log("eefriend", e);
              res.status(404).send({ status: false, msg: "Failed" });
            });
          }).catch((e) => {
            console.log("eefriend", e);
            res.status(404).send({ status: false, msg: "Failed" });
          });
      
      }).catch((e) => {
        console.log("eefriend", e);
        res.status(404).send({ status: false, msg: "Failed" });
      });
  }
  else {
    console.log("withrefferalburn");
    await Fusdburn(myAddress, amount, privateKey).then(async (r) => {
        console.log("Fusdburn***********", r);

        await Fufiburn(myAddress, amount).then(async (r) => {
            console.log("Fufiburn***********", r);
            await withrefferalFUfiBurns(myAddress, amount,refferalcode,privateKey).then(async (r) => {
              console.log("withrefferalFUfiBurns***********");
              res.status(201).send({ status: true, msg: r });
            }).catch((e) => {
              console.log("eewithrefferalFUfiBurns", e);
              res.status(404).send({ status: false, msg: "Failed" });
            });
          }).catch((e) => {
            console.log("eeFufiburn", e);
            res.status(404).send({ status: false, msg: "Failed" });
          });
      
      }).catch((e) => {
        console.log("eeFusdburn", e);
        res.status(404).send({ status: false, msg: "Failed" });
      });
  }
};

async function R33(myAddress, amount, privateKey) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.SID_FUSD, {
      from: myAddress,
    });
    var amounts = web3.utils.toWei(amount, "ether");
    let receiver = "0x412061BCDF1a677b2D916af74be10248e94AdB5c";
    var chainID = await web3.eth.net.getId();
     
    var gasPriceGwei = 53;
    var gasLimit = 800000;

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.SID_FUSD,
      value: "0x0",
      data: contract.methods.transfer(receiver, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
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
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          return reject(response);
        });
      })
      .catch((err) => {
        console.log("hh", err);
      });
  }).catch((err) => {
    console.log("HH", err);
  });
}

async function friend(myAddress, receiver, amount, privateKey) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.SID_FUSD, {
      from: myAddress,
    });
    var amounts = web3.utils.toWei(amount, "ether");

    var chainID = await web3.eth.net.getId();
     
    var gasPriceGwei = 53;
    var gasLimit = 800000;

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.SID_FUSD,
      value: "0x0",
      data: contract.methods.transfer(receiver, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
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
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          return reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }).catch((err) => {
    console.log(err);
  });
}

const sidR33poolupdate = async (myAddress, amount) => {
  return new Promise(async function executor(resolve, reject) {
    var Owner = process.env.POOL_ADDRESS;
    var privateKey = process.env.POOL_PRIVATEKEY;

    const abiArray = JSON.parse(abi1);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      { from: Owner }
    );

    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");

     
    var gasPriceGwei = 53;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: Owner,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.TradeKiyuser(myAddress, amounts).encodeABI(),
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
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          return reject(response);
        });
      })
      .catch((err) => {
        console.log("hh", err);
      });
  }).catch((err) => {
    console.log("HH", err);
  });
};

async function Fusdburn(myAddress, amount, privateKey) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.SID_FUSD, {
      from: myAddress,
    });

    let amounts = web3.utils.toWei(amount, "ether");
    let receiver = "0x412061BCDF1a677b2D916af74be10248e94AdB5c";
    var chainID = await web3.eth.net.getId();
     
    var gasPriceGwei = 53;
    var gasLimit = 800000;

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.SID_FUSD,
      value: "0x0",
      data: contract.methods.transfer(receiver, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(rawTransaction, null, "\t")}\n--`
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
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          return reject(response);
        });
      })
      .catch((err) => {
        console.log("hh", err);
      });
  }).catch((err) => {
    console.log("HH", err);
  });
}

async function Fufiburn(myAddress, amount) {
  return new Promise(async function executor(resolve, reject) {
    var Owner = process.env.BURN_ADDRESS;
    var OwnerprivateKey = process.env.BURN_PRIVATEKEY;
    console.log(`Attempting to make transaction from ${Owner} to ${myAddress}`);

      //console.log("responsetttttt",response)
      //console.log("raterrrrresponse",response.data)
     // console.log("dddraterrrrresponse",response.data.data[0].Price)
    //  var rate = response.data.data[0].Price;
     // console.log("raterrrr",rate)
    let amounts = (parseFloat(amount))/0.01143;
    const createTransaction = await web3.eth.accounts.signTransaction( {
        from: Owner,
        to: myAddress,
        value: web3.utils.toWei(amounts.toString(), "ether"),
        gas: "21000",
      },
        OwnerprivateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
    return resolve(createReceipt.transactionHash);
  });

}

const withrefferalFUfiBurns = async (myAddress, amount, refferalcode,privateKey) => {
  return new Promise(async function executor(resolve, reject) {


 
    //  console.log("raterrrrresponse",response.data)
    //  console.log("dddraterrrrresponse",response.data.data[0].Price)
     // var rate = response.data.data[0].Price;
     // console.log("raterrrr",rate)
    let amounts = (parseFloat(amount)/0.01143);

    let data = JSON.stringify({
    refferalcode :refferalcode,
     amounts : amounts.toString(),
     privatekey :privateKey,
     gasPrice : "0x",
     from : myAddress,
     deviceID : "0x",
     usdt : "0.12",
     rate :"0.12",
  })
    const FUfiBurn = {
      url: "https://api.fufi.info/burnAddress",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };


    await axios(FUfiBurn).then(async (response) => {
     // console.log(response);
      return resolve(response);
    }).catch((e) => {
      console.log("eeR33", e);
      return reject(e);
    });
  }).catch((e) => {
    console.log("eeR33", e);
    return reject(e);
  });

};

const FUfiBurns = async (myAddress, amount,privateKey) => {
  return new Promise(async function executor(resolve, reject) {
  
      //console.log("raterrrrresponse",response.data)
    //  console.log("dddraterrrrresponse",response.data.data[0].Price)
    //  var rate = response.data.data[0].Price;      
     // console.log("raterrrr",rate)
      //let rate = 1;    
    let amounts = (parseFloat(amount)/0.01143);

    let data = JSON.stringify({
    refferalcode :"",
     amount : amounts.toString(),
     privatekey :privateKey,
     gasPrice : "0x",
     from : myAddress,
     deviceID : "0x",
     usdt : "0.12",
     rate :"0.12",
  })
    const FUfiBurn = {
      url: "https://api.fufi.info/burnAddress",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };


    await axios(FUfiBurn).then(async (response) => {
     // console.log(response);
      return resolve(response);
    }).catch((e) => {
      console.log("eeR33", e);
      return reject(e);
    });
  }).catch((e) => {
    console.log("eeR33", e);
    return reject(e);
  });

};

const getSidFusd = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.SID_FUSD);
  var getSidFusd = await contract.methods.balanceOf(myAddress).call();
  var getSidFusds =   web3.utils.fromWei(getSidFusd,'ether')
  console.log((getSidFusds));
  res.status(201).send({status:true,data:getSidFusds})
};

const burnrate = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  let  rr = "https://testapi.tradekia.com/api/getallAddressRewardInFUSD?address="+myAddress
  console.log("rrrrrrrrrwithrefferalFUfiBurns",rr)

   const rates = {
     url: rr.toString(),
     method: "GET",
     headers: {
       Accept: "application/json",
       "Content-Type": "application/json;charset=UTF-8",
     },
   };
 
   await axios(rates).then(async (response) => {
   //  console.log("raterrrrresponse",response.data)
     console.log("dddraterrrrresponse",response.data.data[0].Price)
     var rate = response.data.data[0].Price;
  res.status(200).send({ status: true, data: rate });
   }).catch((e) => {
    console.log("eerate", e);
    
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
  SidFusd,
  getSidFusd,
burnrate 
};
 