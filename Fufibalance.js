var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_Stable.json", "utf-8");
//var amount = 10;

const Fufibalance = async () => {
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
        // console.log(response.data.length)
        newAddress1 = response.data.data;
        const propertyValues = Object.values(newAddress1);
        await getalladdressbal(propertyValues)
          .then((res) => {
            console.log("FINALRES", res);
            return resolve(res);
          })
          .catch((err) => {
            console.log("LLLLLLLLLLL", err);
            return reject("failed");
          });
      })
      .catch(function (error) {
        console.log(error);
        return reject("failed");
      });
  });
};

async function getalladdressbal(data) {
  return new Promise(async function executor(resolve, reject) {
    let response;
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    let amount = 0;

    data.forEach(async (element, i) => {
      await sleep(i * 100);
      web3.eth.getBalance(element, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var amounts = web3.utils.fromWei(result, "ether");
          console.log("oldamount", amount);
          amount = parseFloat(amount) + parseFloat(amounts);
        }
      });
    });
    setTimeout(() => {
      console.log("JJJJJJJJJJJJ", amount);
      return resolve(amount);
    }, 5000);
  });
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

Fufibalance();
