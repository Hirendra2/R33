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
        getalladdressbal(propertyValues)

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
      const abiArray1 = JSON.parse(abi1);
      var contract = new web3.eth.Contract(
        abiArray1,
        process.env.TOKEN_CONTRACT_ADDRESS
      );
      var bal = await contract.methods.balanceOf(element).call();
      var amounts = web3.utils.fromWei(bal, "ether");

      console.log("oldamount", amount);
      amount = parseFloat(amount) + parseFloat(amounts);

      console.log("newamount", amount);
    });
    setTimeout(() => {
      console.log("JJJJJJJJJJJJ", amount);
      return resolve(amount);
    }, 10000);
  });
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

