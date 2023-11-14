var ethers = require("ethers");
var url = "https://fufi.finance/rpc";

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/levelreward.json", "utf-8");
const abi2 = fs.readFileSync("./abis/abi_entry.json", "utf-8");

const { dkupdate } = require("./entry");
const Levelsclaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT,
    { from: myAddress }
  );

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
    to: process.env.LEVELREWARD_CONTRACT,
    value: "0x0",
    data: contract.methods.Levelsclaim().encodeABI(),
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
            console.log("Levelclaimadddd");
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
const LevelsRewardsID = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var LevelReward = await contract.methods.getchaildId(myAddress).call();
  console.log(LevelReward);
  res.status(201).send({ status: true, data: LevelReward });
};

const LevelsRewards = async (req, res, next) => {
  var levelId = req.body.levelId;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var LevelReward = await contract.methods.Levels(levelId).call();
  console.log(LevelReward);

  res.status(201).send({ status: true, data: LevelReward });
};

const totalLevelsRewards = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var amount = await contract.methods.affiliate(myAddress).call();
  //console.log((amount));
  // var amounts =   web3.utils.fromWei(amount,'ether')

  res.status(201).send({ status: true, data: amount });
};


const totalLevelsRewardsearn = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var amount = await contract.methods.totalLevelsRewards(myAddress).call();
  //console.log((amount));
  // var amounts =   web3.utils.fromWei(amount,'ether')

  res.status(201).send({ status: true, data: amount });
};



const ClaimTotalEarns = async (req, res, next) => {
  let count = 0;
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  var Seconds = "10";
  var address = myAddress;
  var chaild = myAddress;

  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var chainID = await web3.eth.net.getId();
   
  var gasPriceGwei = 53;
  var gasLimit = 800000;

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.TotalEarns(Seconds).encodeABI(),
    chainId: chainID,
  };

  console.log(amount);
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
        //const reward = async (myAddress,privateKey) => {await sleep();
        const rates = {
          url: "https://api.tradekia.com/api/getFufiPrize",
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        };

        await axios(rates).then(async (response) => {
          var rate = response.data.usd.toString();
          console.log(rates);
            let am = web3.utils.fromWei(amount, "ether");
          let amounts = (am/2) / rate;
          console.log("Fufibbbbbbbbbbbbb".amounts);
          var data1 = JSON.stringify({
            address: myAddress,
            amount: amounts,
          });

          var config = {
            method: "post",
            url: "https://api.fufi.info/insertR33Offer",
            headers: {
              "Content-Type": "application/json",
            },
            data: data1,
          };

          await axios(config).then(async (response) => {
              let am = web3.utils.fromWei(amount, "ether");
              let amt = (parseFloat(am)/2)/3
            await sleep(10000)
            await dkupdate(myAddress, amt,"re").then((r) => {     
              console.log("readddd")        
            }).catch((err)=>{
              console.log("rrree",err)
            })
          });
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

  getData(address);

  function getData(address) {
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
        if (response.data.data.referred) {
          count += 1;
          if (count <= 33) {
            var counts = `Level ${count}`;
          //  await sleep(20000);
            console.log(response.data.data.referred_by);
            await sleep(10000)
            makeTransaction(
              response.data.data.referred_by,
              counts,
              chaild,
              amount
            );
            return getData(response.data.data.referred_by);
          } else {
            return "0";
          }
        } else {
          return "0";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};

async function makeTransaction(newAddress, counts, chaild, amount) {
  const abiArray = JSON.parse(abi);
  myAddresss = process.env.LEVELREWARD_ADDRESS;
  privateKeys = process.env.LEVELREWARD_PRIVATEKEY;
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT,
    {
      from: myAddresss,
    }
  );

   
  console.log(gasPrices);
  var gasPriceGwei = 53;
  //var amounts = web3.utils.toWei(amount, "ether");
  let amounts = (parseFloat(amount)/2);
    let amountss = amounts.toString();
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddresss,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.LEVELREWARD_CONTRACT,
    value: "0x0",
    data: contract.methods.levelreawrd(newAddress, chaild, counts, amountss)
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
        // res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

const affiliateadd = async (req, res, next) => {
  var myAddress = process.env.LEVELREWARD_ADDRESS;
  var privateKey = process.env.LEVELREWARD_PRIVATEKEY;
  var user = req.body.user;
  var amount = req.body.amount;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.LEVELREWARD_CONTRACT,
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
    to: process.env.LEVELREWARD_CONTRACT,
    value: "0x0",
    data: contract.methods.longadd(user,amounts).encodeABI(),
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
  Levelsclaim,
  LevelsRewardsID,
  LevelsRewards,
  totalLevelsRewards,
  ClaimTotalEarns,
  totalLevelsRewardsearn,
  affiliateadd
};
