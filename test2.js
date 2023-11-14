var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_Stable.json", "utf-8");
const abi1 = fs.readFileSync("./abis/approve.json", "utf-8");
const schedule = require("node-schedule");
var myAddresss = process.env.STABLE_ADDRESS;
var privateKey = process.env.STABLE_PRIVATEKEY;

const getData1 = async (SupplyFusdAmount) => {
  return new Promise(async function executor(resolve, reject) {
    var config = {
      method: "post",
      url: "http://165.22.217.204:3333/getalluser",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then(async function (response) {
        newAddress1 = response.data.data;
        const inputArray = Object.values(newAddress1);

        const perChunk = 25; // items per chunk

        const result = inputArray.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / perChunk);
          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);

        result.forEach(async (elementArrays, index) => {
          console.log(elementArrays);
          await sleep(index * 20000);
          console.log("GOTO INIT LENGTH >> ", elementArrays.length);

          await makeTransaction(elementArrays, SupplyFusdAmount)
            .then(async (res) => {
              console.log("FINALRES", res);
              return resolve("Success");
            })
            .catch((err) => {
              console.log("LLLLLLLLLLL", err);
              return reject("Failed");
            });
        });
      })
      .catch(function (error) {
        console.log(error);
        return reject("Failed");
      });
  });
};

async function getalladdressbal(data, SupplyFusdAmount) {
  console.log("INSIDE FETCH BALANCE >>", data);

  return new Promise(async function executor(resolve, reject) {
    let response;
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    let amount = [];
    data.forEach(async (element, i) => {
      await sleep(i * 1000);
      // const abiArray1 = JSON.parse(abi1);
      // var contract = new web3.eth.Contract(
      //   abiArray1,
      //   process.env.TOKEN_CONTRACT_ADDRESS
      // );
      web3.eth.getBalance(element, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var amounts = web3.utils.fromWei(result, "ether");
          console.log("oldamount", amounts);
          let amss = Math.trunc(amounts);

          if (amss == 0) {
            amount.push(amss);
          } else {
            getfusdamountsc().then(async (r) => {
              let fusdamountsc = Number(r);
              console.log("fusdamountsc***********", fusdamountsc);
              let wightage = (amss * 100) / SupplyFusdAmount;
              console.log("wightage***********", wightage);
              let amounts = (fusdamountsc * wightage) / 100;
              console.log("rewards***********", amounts);
              let am = web3.utils.toWei(amounts.toString(), "ether");
              amount.push(am);
              console.log("FLAG >>", amount.length == data.length);
              if (amount.length == data.length) {
                return resolve(amount);
              }
            });
          }
        }
      });

      //var bal = await contract.methods.balanceOf(element).call();
      // amount.push(bal);
    });
    // setTimeout(() => {
    //   console.log("JJJJJJJJJJJJ", amount);
    //   return resolve(amount);
    // }, 5000);
  });
}

async function getfusdamountsc() {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(abiArray, process.env.Hstable);
    var fusdamountsc = await contract.methods.fusdamount().call();
    let am = web3.utils.fromWei(fusdamountsc, "ether");
    console.log("fufiamountsc", am);
    resolve(Number(am));
  });
}

async function makeTransaction(propertyValues, SupplyFusdAmount) {
  return new Promise(async function executor(resolve, reject) {
    let response;
    if (propertyValues.length > 0) {
      await getalladdressbal(propertyValues, SupplyFusdAmount)
        .then(async (res) => {
          console.log("BALANCE ARRAY >>>>", res);
          const abiArray = JSON.parse(abi);
          var contract = new web3.eth.Contract(abiArray, process.env.Hstable, {
            from: myAddresss,
          });
           
          var gasPriceGwei = 100;
          console.log("gasPriceGwei", gasPriceGwei);
          var gasLimit = 6599999;
          console.log("gasLimit", gasLimit);
          let amt = res;
          var rawTransaction = {
            from: myAddresss,
            gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
            gasLimit: web3.utils.toHex(gasLimit),
            to: process.env.Hstable,
            value: "0x0",
            data: contract.methods.Fufi(propertyValues, amt).encodeABI(),
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
                console.log(
                  "https://fufiscan.com/tx/" + receipt.transactionHash
                );
              });
              sentTx.on("error", (err) => {
                console.log(err);
                response = { status: false, message: err };
                return reject(response);
              });
            })
            .catch((err) => {
              console.log(err);
              response = { status: false, message: err };
              return reject(response);
            });
        })
        .catch((err) => {
          console.log("hdshsd", err);
        });
    } else {
      response = { status: true, message: "Success" };
      return resolve(response);
    }
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

const getFUSDSupply = async () => {
  return new Promise(async function executor(resolve, reject) {
    var config = {
      method: "post",
      url: "http://165.22.217.204:3333/getalluser",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios(config)
      .then(async function (response) {
        newAddress1 = response.data.data;
        const propertyValues = Object.values(newAddress1);
        await getAllFUSDAmount(propertyValues)
          .then((res) => {
            console.log("FINALRES", res);

            getData1(res);

            return resolve(res);
          })
          .catch((err) => {
            console.log("LLLLLLLLLLL", err);
            return reject("failed");
          });
      })
      .catch(function (error) {
        console.log(error);
        return reject("Failed");
      });
  });
};

async function getAllFUSDAmount(data) {
  return new Promise(async function executor(resolve, reject) {
    let response;
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    let amount = 0;

    data.forEach(async (element, i) => {
      await sleep(i * 500);
      // const abiArray1 = JSON.parse(abi1);
      // var contract = new web3.eth.Contract(
      //   abiArray1,
      //   process.env.TOKEN_CONTRACT_ADDRESS
      // );
      // var bal = await contract.methods.balanceOf(element).call();
      // var amounts = web3.utils.fromWei(bal, "ether");
      web3.eth.getBalance(element, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var amounts = web3.utils.fromWei(result, "ether");
          console.log("oldamount", amount);
          amount = parseFloat(amount) + parseFloat(amounts);
          console.log("newamount", amount);
        }
      });
    });
    setTimeout(() => {
      console.log("JJJJJJJJJJJJ", amount);
      return resolve(amount);
    }, 10000);
  });
}

getFUSDSupply();

// var rule2 = new schedule.RecurrenceRule();
// rule2.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
// rule2.hour = 22;
// rule2.minute = 20;
// rule2.hour = process.env.TIME_HOURES;
// rule2.minute = process.env.TIME_MENUTES+29;
// let h = parseFloat(process.env.TIME_HOURES);
// let m = parseFloat(process.env.TIME_MENUTES);
// let menute = m + 29 >= 60 ? m + 29 - 60 : m + 29;
// let hour = m + 29 >= 60 ? h + 1 : h;
// rule2.hour = hour;
// rule2.minute = menute;
// schedule.scheduleJob(rule2, async function () {
//   console.log(
//     "This runs at " + hour + ":" + menute + "AM every ,On fusdholderr  "
//   );

//   //     await getData1().then((re)=>{
//   //         console.log("^^^^^^^^^^^^^^^^",re);
//   // }).catch((err)=>{
//   //     console.log("EEEEEEE",err);
//   // })
// });
