var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const { isValid } = require("shortid");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/referral.json", "utf-8");
const abi2 = fs.readFileSync("./abis/new_abi_referral.json", "utf-8");

var rankId1, rankId2, rankId3,rankId3;

const referral = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var parentadd = req.body.parentadd;
  var childadd = req.body.childadd;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1,
    { from: myAddress }
  );
console.log(process.env.REFERRAL_CONTRACT_ADDRESS1)
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    nonce: "0x" + count.toString(16),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e10),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS1,
    value: "0x0",
    data: contract.methods.referral(parentadd,childadd).encodeABI(),
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
        res.status(404).send({ status: false, msg: "Already referred" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const refer_info1 = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var referralrank = await contract.methods.refer_info(myAddress).call();

  //referralrank= (referralrank01+referralrank02+referralrank03);
  console.log(referralrank);

  res.status(201).send({ status: true, data: referralrank });
};
const refer_info2 = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var referralrank2 = await contract.methods.refer_info2(myAddress).call();

  console.log(referralrank2);

  res.status(201).send({ status: true, data: referralrank2 });
};

const refer_info3 = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var referralrank3 = await contract.methods.refer_info3(myAddress).call();
  console.log(referralrank3);
  res.status(201).send({ status: true, data: referralrank3 });
};
const refer_info4 = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var referralrank3 = await contract.methods.refer_info4(myAddress).call();
  console.log(referralrank3);
  res.status(201).send({ status: true, data: referralrank3 });
};

const refer_info = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  getSolidData(myAddress);
  function getSolidData(myAddress) {
    var data = { myAddress: myAddress };
    console.log(data);

    const refer_info = {
      url: "http://165.22.217.204:3333/refer_info1",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };

    const refer_info2 = {
      url: "http://165.22.217.204:3333/refer_info2",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };

    const refer_info3 = {
      url: "http://165.22.217.204:3333/refer_info3",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };
    const refer_info4 = {
      url: "http://165.22.217.204:3333/refer_info4",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };

    axios(refer_info)
      .then(async (response) => {
        console.log("1", response.data);
        rankId = response.data.data._totalreferred;
        rankId1 = parseFloat(rankId);
        console.log("1", rankId1);

        axios(refer_info2)
          .then(async (response) => {
            console.log("2", response.data);
            rankId = response.data.data._totalreferred;
            rankId2 = parseFloat(rankId);
            console.log("2", rankId2);

            axios(refer_info3)
              .then(async (response) => {
                console.log("3", response.data);
                rankId = response.data.data._totalreferred;
                rankId3 = parseFloat(rankId);
                console.log("3", rankId3);

                axios(refer_info4)
                .then(async (response) => {
                  console.log("4", response.data);
                  rankId = response.data.data._totalreferred;
                  rankId4 = parseFloat(rankId);
                  console.log("2", rankId4);
                  
                  var resrankId = rankId1 + rankId2 + rankId3,rankId4;
                  var rankId22 = JSON.stringify(resrankId)
                  console.log(rankId22);
                  var finaldata={"_totalreferred":rankId22};
                  res.status(201).send({ status: true, data: finaldata });
                }) .catch(function (error) {
                  console.log("Show error notification3");
                });
              })
              .catch(function (error) {
                console.log("Show error notification3");
              });
          })
          .catch(function (error) {
            console.log("Show error notification2");
          });
      })
      .catch(function (error) {
        console.log("Show error notification1");
      });
  }
  console.log(getSolidData());

  
};

const  getdirecrtreferral  = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );


  var getdirecrtreferral = await contract.methods
    .getListReferrals(myAddress)
    .call();
  console.log(getdirecrtreferral);

  res.status(201).send({ status: true, data: getdirecrtreferral });
};

const getTotaluser = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getTotaluser = await contract.methods.getTotaluser().call();
  console.log(getTotaluser);

  res.status(201).send({ status: true, data: getTotaluser });
};

const checkmember = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var checkmember = await contract.methods.isMember(myAddress).call();
  console.log(checkmember);
  if(checkmember == true){
    res.status(201).send({ status: true, data: "Valid" });

  } else{
    res.status(401).send({ status: false, data: "Not Valid" });

  }

};

const totaluser = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var totaluser = await contract.methods.lastMember(myAddress).call();
  console.log(totaluser);

  res.status(201).send({ status: true, data: totaluser });
};

const user_info = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );


  var checkmember = await contract.methods.user_info(myAddress).call();
  console.log(checkmember);

  res.status(201).send({ status: true, data: checkmember });
};

const getDirectcount = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var getDirectcounts = await contract.methods.members(myAddress).call();

  console.log(getDirectcounts);

  res.status(201).send({ status: true, data: getDirectcounts });
};

const getcount = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var getcount1 = await contract.methods.count1().call();
  var getcount2 = await contract.methods.count2().call();
  var getcount3 = await contract.methods.count3().call();
  var getcount4 = await contract.methods.count4().call();
  var getcount5 = await contract.methods.count5().call();

  console.log(checkmember);

  res
    .status(201)
    .send({
      status: true,
      data: getcount1,
      getcount2,
      getcount3,
      getcount4,
      getcount5,
    });
};

const getuserhighchainadd = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var getuserhighchainadd = await contract.methods.userhighchainadd().call();
  console.log(getuserhighchainadd);

  res.status(201).send({ status: true, data: getuserhighchainadd });
};



const getonedayalladds = async (req, res, next) => {
  var Id = req.body.Id;
  const abiArray = JSON.parse(abi);

  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var getonedayalladds = await contract.methods.oneday(Id).call();
  console.log("HELLO", getonedayalladds);
  res.status(201).send({ status: true, data: getonedayalladds });
};

const gettodayid = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );
  var todaytotalid = await contract.methods.todayid().call();
  console.log(todaytotalid);
  res.status(201).send({ status: true, data: todaytotalid });
};

const getchailds = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);

  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var getchaildss = await contract.methods.getchaild(myAddress).call();
  console.log("HELLO", getchaildss);
  res.status(201).send({ status: true, data: getchaildss });
};

const getlongcadd = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var multichainadds1 = await contract.methods.multichainadd2().call();
  console.log(multichainadds1);
  res.status(201).send({status: true,data: multichainadds1});
};

const getlongcount = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var multichainadds1 = await contract.methods.multicount1().call();
  var amounts =  web3.utils.toWei(multichainadds1, 'ether');
  console.log(amounts);

  res.status(201).send({status: true,data: amounts});
};

const gethighadd = async (req, res, next) => {

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.REFERRAL_CONTRACT_ADDRESS1);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var longchainadds1 = await contract.methods.highchainadd1().call();
  var longchainadds2 = await contract.methods.highchainadd2().call();
  var longchainadds3 = await contract.methods.highchainadd3().call();
  var longchainadds4 = await contract.methods.highchainadd4().call();
  var longchainadds5 = await contract.methods.highchainadd5().call();

  console.log((longchainadds1));
  console.log((longchainadds2));
  console.log((longchainadds3));
  console.log((longchainadds4));
  console.log((longchainadds5));

  res.status(201).send({status:true,data:{longchainadds1,longchainadds2,longchainadds3,longchainadds4,longchainadds5}})
};

const gethighreferralcount = async (req, res, next) => {

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.REFERRAL_CONTRACT_ADDRESS1);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getcount1 = await contract.methods.count1().call();
  var getcount2 = await contract.methods.count2().call();
  var getcount3 = await contract.methods.count3().call();
  var getcount4 = await contract.methods.count4().call();
  var getcount5 = await contract.methods.count5().call();

  console.log((getcount1));
  console.log((getcount2));
  console.log((getcount3));
  console.log((getcount4));
  console.log((getcount4));

  res.status(201).send({status:true,data:{getcount1,getcount2,getcount3,getcount4,getcount5}})
};

const setuser = async (req, res, next) => {
  var myAddresss = process.env.REFERRAL_ADDRESS;
  var privateKey = process.env.REFERRAL_PRIVATEKEY;
  var myAddress = req.body.myAddress;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddresss);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1,
    { from: myAddresss }
  );
console.log(process.env.REFERRAL_CONTRACT_ADDRESS1)
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var count = await web3.eth.getTransactionCount(myAddresss);
  console.log(`num transactions so far: ${count}`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddresss,
    nonce: "0x" + count.toString(16),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e10),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS1,
    value: "0x0",
    data: contract.methods.sstorauser(myAddress).encodeABI(),
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
        res.status(404).send({ status: false, msg: "Already referred" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const getuser = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var amounts = await contract.methods.storauser(myAddress).call();
  console.log(amounts);
  if(amounts >0){
    res.status(201).send({ status: true, data: "Valid" });

  } else{
    res.status(401).send({ status: false, data: "Not Valid" });

  }

};

const ownerreferral = async (req, res, next) => {
  var myAddress = process.env.REFERRAL_ADDRESS;
  var privateKey = process.env.REFERRAL_PRIVATEKEY;
  var parentadd = req.body.parentadd;
  var childadd = req.body.childadd;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1,
    { from: myAddress }
  );
console.log(process.env.REFERRAL_CONTRACT_ADDRESS1)
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    nonce: "0x" + count.toString(16),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e10),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS1,
    value: "0x0",
    data: contract.methods.ownerreferral(parentadd,childadd).encodeABI(),
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
        res.status(404).send({ status: false, msg: "Already referred" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


const NEWownerreferral = async (req, res, next) => {
  var myAddress = process.env.REFERRAL_ADDRESS;
  var privateKey = process.env.REFERRAL_PRIVATEKEY;
  var parentadd = req.body.parentadd;
  var childadd = req.body.childadd;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.REFERRAL_CONTRACT_ADDRESS1,
    { from: myAddress }
  );
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    nonce: "0x" + count.toString(16),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e10),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.REFERRAL_CONTRACT_ADDRESS1,
    value: "0x0",
    data: contract.methods.ownerreferral(parentadd,childadd).encodeABI(),
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
        res.status(404).send({ status: false, msg: "Already referred" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const changeparent = async (req, res, next) => {
  var myAddress = process.env.REFERRAL_ADDRESS;
  var privateKey = process.env.REFERRAL_PRIVATEKEY;
  var parentadd = req.body.parentadd;
  var childadd = req.body.childadd;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.NEW_REFERRAL_CONTRACT_ADDRESS1,
    { from: myAddress }
  );
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var count = await web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 6599999;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    nonce: "0x" + count.toString(16),
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e10),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.NEW_REFERRAL_CONTRACT_ADDRESS1,
    value: "0x0",
    data: contract.methods.changeparent(parentadd,childadd).encodeABI(),
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
        res.status(404).send({ status: false, msg: "Already referred" });
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
  referral,
  refer_info,
  refer_info1,
  refer_info2,
  refer_info3,
  refer_info4,
  getdirecrtreferral,
  getTotaluser,
  checkmember,
  totaluser,
  user_info,
  getcount,
  getDirectcount,
  getuserhighchainadd,
  getonedayalladds,
  gettodayid,
  getchailds,
  getlongcadd,
  getlongcount,
  gethighadd,
  gethighreferralcount,
  setuser,
  getuser,
  ownerreferral,
NEWownerreferral ,
changeparent 

};
