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
const abi5 = fs.readFileSync("./abis/Test.json", "utf-8");

const { idwithDraw } = require("./Testentry");


const checkmember = async (myAddress) => {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);

    const abiArray = JSON.parse(abi3);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.REFERRAL_CONTRACT_ADDRESS1
    );

    var checkmember = await contract.methods.isMember(myAddress).call();
    console.log(checkmember);
    if (checkmember == true) {
      // res.status(201).send({ status: true, data: "Valid" });
      return resolve({ status: true, data: "Valid" });
    } else {
      return resolve({ status: false, data: "Valid" });
    }
  });
};

const getData = async (myAddress, privateKey, parent, amount) => {
  let response;
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      address: myAddress,
    });

    var config = {
      method: "post",
      url: "https://api.fufi.info/getRefferalCode",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        console.log(response.data.status);
        console.log(response.data.status);
        if (response.data.status == false) {
          response = { status: false };
          return reject(response);
        } else {
          await makeTransaction(amount, parent, privateKey, myAddress)
            .then(async (r) => {
              response = { status: true };
              return resolve(response);
            })
            .catch((err) => {
              response = { status: false };
              return reject(response);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        response = { status: false };
        return reject(response);
      });
  });
};

function last(array) {
  return array[array.length - 1];
}
const dkupdate = async (myAddress, amount,type) => {
  return new Promise(async function executor(resolve, reject) {
    var data = JSON.stringify({
      myAddress: myAddress,
    });
    const getrankid = {
      url: "http://165.22.217.204:3333/getRankId",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: data,
    };

    await axios(getrankid).then(async (response) => {
      newAddress1 = last(response.data.data);

      console.log(newAddress1);
      var data = JSON.stringify({
        weiDeposit: amount,
        walletAddress: myAddress,
        rankId: newAddress1,
        type:type
      });
      const hndaddress = {
        url: "https://api.tradekia.com/api/saveRank",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        data: data,
      };
      await axios(hndaddress).then(async (response) => {
        //  newAddress1 = response;
        // console.log(newAddress1);
        return resolve("success");
      });
    });
  });
};

const sumitaffiliate = async (myAddress, parent) => {
	return new Promise(async function executor(resolve, reject) {
	  var data = JSON.stringify({
		child: myAddress,
		parent: parent,
	  });
	  const parentadd = {
		url: "http://64.227.177.68:8565/createMND24h",
		method: "POST",
		headers: {
		  Accept: "application/json",
		  "Content-Type": "application/json;charset=UTF-8",
		},
		data: data,
	  };
  
	  await axios(parentadd).then(async (response) => {
		console.log("sumitadd");
	  });
	});
  };
  
const entry = async (req, res, next) => {
  let response;
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var parent = req.body.parent;
  var amount = req.body.amount;

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.currentRankId().call();
  let currentRankId = parseFloat(getalluser) + 1;
  console.log("IIIIIII", currentRankId);

  await getData(myAddress, privateKey, parent, amount)
    .then(async (r) => {
      res.status(200).send({ status: true, msg: "Success" });
    })
    .catch((err) => {
      res.status(404).send({ status: false, msg: "Failed" });
    });

  await sumitaffiliate(myAddress, parent)
    .then(async (r) => {
      console.log("sumitsuccess", r);
    })
    .catch((err) => {
      console.log(err);
    });
};
async function makeTransaction(amount, parent, privateKey, myAddress) {
  let response;
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.CONTRACT_ADDRESS,
      {
        from: myAddress,
      }
    );

     
    console.log(gasPrices);
    var gasPriceGwei = 53;
    var amounts = web3.utils.toWei(amount, "ether");
    console.log(amounts);
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.start(amounts, parent).encodeABI(),
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

          await checkmember(myAddress).then(async (r) => {
            console.log("CheckMemebers***********", r);
            if (r.status) {
              await dkupdate(myAddress, amount,"e")
                .then((r) => {
                  response = {
                    status: true,
                    msg: "https://fufiscan.com/tx/" + receipt.transactionHash,
                  };
                  return resolve(response);
                })
                .catch((e) => {
                  console.log("DKKKKK", e);
                  response = { status: false, msg: "Failed" };
                  return reject(response);
                });
            } else {
              if (parent === " ") {
                let parents = "0xfFAEAAB10699d7f2f21016C097fBb57b6b25C22e";
                var data = JSON.stringify({
                  myAddress: myAddress,
                  privateKey: privateKey,
                  parentadd: parents,
                  childadd: myAddress,
                });
                var config = {
                  method: "post",
                  url: "http://165.22.217.204:3333/referral",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: data,
                };

                console.log("config  >> ", data);

                await axios(config)
                  .then(async (res) => {
                    console.log("@@#@@@@@@", res);
                    await dkupdate(myAddress, amount,"e")
                      .then((r) => {
                        response = {
                          status: true,
                          msg:
                            "https://fufiscan.com/tx/" +
                            receipt.transactionHash,
                        };
                        return resolve(response);
                      })
                      .catch((e) => {
                        console.log("DKKKKK", e);
                        response = { status: false, msg: "Failed" };
                        return reject(response);
                      });
                  })
                  .catch(function (error) {
                    console.log(error);
                    response = { status: false, msg: "Failed" };
                    return reject(response);
                  });
              } else {
                var data = JSON.stringify({
                  myAddress: myAddress,
                  privateKey: privateKey,
                  parentadd: parent,
                  childadd: myAddress,
                });
                var config = {
                  method: "post",
                  url: "http://165.22.217.204:3333/referral",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: data,
                };

                console.log("config  >> ", data);

                await axios(config)
                  .then(async (res) => {
                    console.log("*********", res);
                    await dkupdate(myAddress, amount,"e")
                      .then((r) => {
                        response = {
                          status: true,
                          msg:
                            "https://fufiscan.com/tx/" +
                            receipt.transactionHash,
                        };
                        return resolve(response);
                      })
                      .catch((e) => {
                        console.log("HHHHHHHHHHH", e);
                        response = { status: false, msg: "Failed" };
                        return reject(response);
                      });
                  })
                  .catch(function (error) {
                    response = { status: false, msg: "Failed" };
                    return reject(response);
                  });
              }

              // response = {
              //   status: true,
              //   msg: "https://fufiscan.com/tx/" + receipt.transactionHash,
              // };
              // console.log("******************", response);
              // return resolve(response);
            }
          });
        });
        sentTx.on("error", (err) => {
          console.log(err);
          response = { status: false, msg: "Failed" };
          return reject(response);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
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

const withDraw = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var rankId = req.body.rankId;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.withDraw(rankId).encodeABI(),
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
        idwithDraw(myAddress, privateKey, rankId);

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

const TestwithDraw = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var rankId = req.body.rankId;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.withDraw(rankId).encodeABI(),
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
        idwithDraw(myAddress, privateKey, rankId);

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
//02/01/2023
// const withDraw = async (req, res, next) => {
// 	//var myAddress = req.body.myAddress;
// 	//var privateKey = req.body.privateKey;
// 	var rankId = req.body.rankId;
// 	const getData = async (myAddress, privateKey, rankId) => {
// 		await withdkupdate(myAddress, rankId).then(async(r) => {
// 			AmakeTransaction(myAddress, privateKey, rankId)
// 			await sleep(20000);
// 			idwithDraw(myAddress, privateKey, rankId)
// 		}).catch((err) => {
// 			console.log(err);
// 		});
// 	}

// 	getData(myAddress, privateKey, rankId);
// };

// async function AmakeTransaction(myAddress, privateKey, rankId) {
// 	const abiArray = JSON.parse(abi);
// 	var contract = new web3.eth.Contract(
// 		abiArray,
// 		"0x57F02a4d5Db9b879dd5f3e42cE6Df3bFe202B527",
// 		{ from: myAddress }
// 	);

// 	 
// 	console.log(gasPrices);
// 	var gasPriceGwei = 53;
// 	//let amountss = amount/100;
// 	// let amountsss = (amount-(amountss)/3);

// 	console.log("gasPriceGwei", gasPriceGwei);
// 	var gasLimit = 800000;
// 	console.log("gasLimit", gasLimit);

// 	var rawTransaction = {
// 		from: myAddress,
// 		gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
// 		gasLimit: web3.utils.toHex(gasLimit),
// 		to: "0x57F02a4d5Db9b879dd5f3e42cE6Df3bFe202B527",
// 		value: "0x0",
// 		data: contract.methods.withDraw(rankId).encodeABI(),
// 	};
// 	console.log(
// 		`Raw of Transaction: \n${JSON.stringify(
// 			rawTransaction,
// 			null,
// 			"\t"
// 		)}\n------------------------`
// 	);

// 	const signPromise = web3.eth.accounts.signTransaction(
// 		rawTransaction,
// 		privateKey
// 	);

// 	signPromise
// 		.then((signedTx) => {
// 			const sentTx = web3.eth.sendSignedTransaction(
// 				signedTx.raw || signedTx.rawTransaction
// 			);
// 			sentTx.on("receipt", (receipt) => {
// 				console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

// 				//res.status(201).send({status:true,msg:"https://fufiscan.com/tx/" +receipt.transactionHash})
// 			});
// 			sentTx.on("error", (err) => {
// 				console.log(err);
// 				//res.status(404).send({status:false,msg:"Failed"})
// 			});
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// }

// const withdkupdate = async (rankId) => {
// 	return new Promise(async function executor(resolve, reject) {
// 		var data = JSON.stringify({
// 			rankId: rankId,
// 		});
// 		const getrankid = {
// 			url: "http://165.22.217.204:3333/getRankdetails",
// 			method: "POST",
// 			headers: {
// 				Accept: "application/json",
// 				"Content-Type": "application/json;charset=UTF-8",
// 			},
// 			data: data,
// 		};
// 		console.log("ffffff",data)
// 		await axios(getrankid).then(async (response) => {
// 			newAddress1 = last(response.data.data.weiDeposit);
// 			console.log("wrrrrrrrrrr",response)

// 			console.log(newAddress1);
// 			var data = JSON.stringify({
// 				am: parseFloat(newAddress1),
// 				rankId: parseFloat(rankId),
// 			});
// 			const hndaddress = {
// 				url: "https://api.tradekia.com/api/clameRankReward",
// 				method: "POST",
// 				headers: {
// 					Accept: "application/json",
// 					"Content-Type": "application/json;charset=UTF-8",
// 				},
// 				data: data,
// 			};
// 			await axios(hndaddress).then(async (response) => {
// 				//  newAddress1 = response;
// 				 console.log(response);
// 				return resolve("success");
// 			});
// 		});
// 	});
// };

const getRankdetails = async (req, res, next) => {
  var rankId = req.body.rankId;

  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getrankdetail = await contract.methods.ranks(rankId).call();
  console.log(getrankdetail);

  res.status(201).send({ status: true, data: getrankdetail });
};

const getRankId = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getrank = await contract.methods.getRankIdsForAddress(myAddress).call();
  console.log(getrank);

  res.status(201).send({ status: true, data: getrank });
};

const getalluser = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);
  var getalluser = await contract.methods.getalluser().call();
  console.log(getalluser);
  res.status(201).send({ status: true, data: getalluser });
};

const totaluser = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);
  var totaluser = await contract.methods.currentRankId().call();
  console.log(totaluser);
  res.status(201).send({ status: true, data: totaluser });
};

const totalDirectR = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  const abiArray2 = JSON.parse(abi2);

  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var contract1 = new web3.eth.Contract(
    abiArray2,
    process.env.LEVELREWARD_CONTRACT
  );

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var DirectClaimd0 = await contract.methods.DirectClaimd(myAddress).call();
  var affiliate1 = await contract1.methods.totalLevelsRewards(myAddress).call();

  // console.log(totaldirect1)

  console.log(affiliate1);

  var totalaffiliate1 = web3.utils.fromWei(DirectClaimd0, "ether");
  var totalaffiliate2 = parseFloat(totalaffiliate1);
  var affiliate01 = web3.utils.fromWei(affiliate1, "ether");
  var affiliate02 = parseFloat(affiliate01);

  totalaffiliate = affiliate02 + totalaffiliate2;

  res.status(201).send({ status: true, data: totalaffiliate });
};

const getDirectreward = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var getrank = await contract.methods.directreward(myAddress).call();
  console.log(getrank);
  var totalDirectR = web3.utils.fromWei(getrank, "ether");
  res.status(201).send({ status: true, data: totalDirectR });
};

const Directclaim = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var amount = req.body.amount;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.Directclaim().encodeABI(),
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

const globlepoolrate = async (req, res, next) => {
  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.updategloblerate("5").encodeABI(),
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

const totalentry = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var getrank = await contract.methods.getTotalEntry().call();
  console.log(getrank);
  var totalDirectR = web3.utils.fromWei(getrank, "ether");
  res.status(201).send({ status: true, data: totalDirectR });
};

const userentry = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var getrank = await contract.methods.userentry(myAddress).call();
  console.log(getrank);
  var totalDirectR = web3.utils.fromWei(getrank, "ether");
  res.status(201).send({ status: true, data: totalDirectR });
};

const Fusdwith = async (req, res, next) => {
  var amount = req.body.amount;

  var myAddress = process.env.POOL_ADDRESS;
  var privateKey = process.env.POOL_PRIVATEKEY;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  // var amounts =   web3.utils.fromWei(amount,'ether')

   
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
    data: contract.methods.allwith(amount).encodeABI(),
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

const top5 = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var rankId = req.body.rankId;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.top5(rankId).encodeABI(),
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

const currentRankId = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.currentRankId().call();
  console.log(getalluser);
  res.status(201).send({ status: true, data: getalluser });
};

const gethnd = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var gethnd11 = await contract.methods.hnd1().call();
  var gethnd22 = await contract.methods.hnd2().call();
  var gethnd33 = await contract.methods.hnd3().call();
  var gethnd44 = await contract.methods.hnd4().call();
  var gethnd55 = await contract.methods.hnd5().call();

  var gethnd1 = web3.utils.fromWei(gethnd11, "ether");
  var gethnd2 = web3.utils.fromWei(gethnd22, "ether");
  var gethnd3 = web3.utils.fromWei(gethnd33, "ether");
  var gethnd4 = web3.utils.fromWei(gethnd44, "ether");
  var gethnd5 = web3.utils.fromWei(gethnd55, "ether");

  console.log(gethnd1);
  console.log(gethnd2);
  console.log(gethnd3);
  console.log(gethnd4);
  console.log(gethnd5);
  res.status(201).send({
    status: true,
    data: { gethnd1, gethnd2, gethnd3, gethnd4, gethnd5 },
  });
};
const gethndadd = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var gethndadd1 = await contract.methods.hndadd1().call();
  var gethndadd2 = await contract.methods.hndadd2().call();
  var gethndadd3 = await contract.methods.hndadd3().call();
  var gethndadd4 = await contract.methods.hndadd4().call();
  var gethndadd5 = await contract.methods.hndadd5().call();

  console.log(gethndadd1);
  console.log(gethndadd2);
  console.log(gethndadd3);
  console.log(gethndadd4);
  console.log(gethndadd5);

  res.status(201).send({
    status: true,
    data: { gethndadd1, gethndadd2, gethndadd3, gethndadd4, gethndadd5 },
  });
};

const get24hndadd = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var gethndadd1 = await contract.methods.hndadd1().call();

  console.log(gethndadd1);

  res.status(201).send({ status: true, data: gethndadd1 });
};
const getTotalEarn = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.TotalEarn(myAddress).call();
  //var amounts = web3.utils.toWei(getalluser, "ether");
  //console.log((amounts));
  res.status(201).send({ status: true, data: getalluser });
};

const getTotalEarnClaimd = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.TotalEarnClaimd(myAddress).call();
  var amounts = web3.utils.fromWei(getalluser, "ether");
  console.log(amounts);
  res.status(201).send({ status: true, data: amounts });
};

const getPoolBalance = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var PoolBalancess = await contract.methods.PoolBalances().call();
  console.log(PoolBalancess);
  res.status(201).send({ status: true, data: PoolBalancess });
};

const globlepoolBalance = async (req, res, next) => {
  const abiArray = JSON.parse(abi5);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.TEST_CONTRACT_ADDRESS
  );
  var PoolBalancess = await contract.methods.GloblePoolBalances().call();
  var amounts = web3.utils.fromWei(PoolBalancess, "ether");
  // let amt = parseFloat(amounts) / 3 / 3;
  // let amts = amt.toString();
  console.log(amounts);
  res.status(201).send({ status: true, data: amounts });
};

const getHSBalances = async (req, res, next) => {
  const abiArray = JSON.parse(abi5);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var PoolBalancess = await contract.methods.HSBalances().call();
  // var amounts = web3.utils.fromWei(PoolBalancess, "ether");
  // let amt = 2*(amounts)
  //let amts = amounts.toString();
  // console.log(amts);
  res.status(201).send({ status: true, data: PoolBalancess });
};

const TotalEranupdates = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var amount = req.body.amount;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var address = process.env.POOL_ADDRESS;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(address);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: address,
  });

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  //var amounts = web3.utils.toWei(amount, "ether");

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: address,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.TotalEranupdate(myAddress, amount).encodeABI(),
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

const Totalhnd = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var amount = req.body.amount;
  var privateKey = process.env.POOL_PRIVATEKEY;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: myAddress,
  });

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts = web3.utils.toWei(amount, "ether");
  console.log(amounts);
   
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
    data: contract.methods.TopDeposit(myAddress, amounts).encodeABI(),
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

const LevelBalancesss = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.LevelBalances().call();
  //  var amounts =  web3.utils.fromWei(getalluser, 'ether');
  console.log(getalluser);

  res.status(200).send({ status: true, data: getalluser });
};

const getforsid = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.forsid(myAddress).call();
  var amounts = web3.utils.fromWei(getalluser, "ether");
  console.log(amounts);
  res.status(200).send({ status: true, data: amounts });
};

const getTotalburn = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.Totalburn(myAddress).call();
  var amounts = web3.utils.fromWei(getalluser, "ether");
  console.log(amounts);
  res.status(200).send({ status: true, data: amounts });
};

const claim50s = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

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
    data: contract.methods.claim50().encodeABI(),
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

const Fufiwith = async (req, res, next) => {
  var amount = req.body.amount;
  var privateKey = process.env.POOL_PRIVATEKEY;
  var address = process.env.POOL_ADDRESS;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(address);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS, {
    from: address,
  });

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  //var amounts = web3.utils.toWei(amount, "ether");
  var amounts = web3.utils.toWei(amount, "ether");

   
  var gasPriceGwei = 53;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: address,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods.Fufi(amounts).encodeABI(),
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

const getgrates = async (req, res, next) => {
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var PoolBalancess = await contract.methods.globlerate().call();
  // var amounts = web3.utils.fromWei(PoolBalancess, "ether");
  // let amt = 2*(amounts)
  //let amts = amounts.toString();
  // console.log(amts);
  res.status(201).send({ status: true, data: PoolBalancess });
};

const getHs = async (req, res, next) => {
  const abiArray = JSON.parse(abi5);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var PoolBalancess = await contract.methods.HSBalances().call();
  var amounts = web3.utils.fromWei(PoolBalancess, "ether");

  console.log(typeof amounts);
  let amount = parseFloat(amounts) * 0.33;
  let amountss = amount.toString();

  res.status(201).send({ status: true, data: amountss });
};

const getalluserc = async (req, res, next) => {
  console.log(`web3 version: ${web3.version}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.CONTRACT_ADDRESS);
  var getalluser = await contract.methods.getalluser().call();
 // console.log(getalluser);
  res.status(201).send({ status: true, data: getalluser.length });
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
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

module.exports = {
  entry,
  withDraw,
  getRankdetails,
  getRankId,
  getalluser,
  totaluser,
  totalDirectR,
  getDirectreward,
  Directclaim,
  totalentry,
  userentry,
  Fusdwith,
  top5,
  gethnd,
  currentRankId,
  gethndadd,
  get24hndadd,
  getTotalEarn,
  getTotalEarnClaimd,
  getPoolBalance,
  globlepoolBalance,
  TotalEranupdates,
  Totalhnd,
  LevelBalancesss,
  getforsid,
  claim50s,
  globlepoolrate,
  getHSBalances,
  getTotalburn,
  Fufiwith,
  getgrates,
  getHs,
  TestwithDraw,
  getalluserc,
  dkupdate
};
