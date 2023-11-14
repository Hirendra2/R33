var ethers = require("ethers");
var url = "https://fufi.finance/rpc";

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const { Console } = require("console");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/levelreward.json", "utf-8");
var myAddresss = process.env.LEVELREWARD_ADDRESS;
var privateKey =process.env.LEVELREWARD_PRIVATEKEY;
  //var amount = 10;
const levelalo = async (req, res, next) => {
  let count = 0;
  var address = req.body.address;
  var amount = req.body.amount;
  var chaild = req.body.chaild;

   

  const getData = async(address) => {
   await  sleep(30000);

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

    axios(config).then(async function (response) {
      if(response.data.data.referred_by !="0x0000000000000000000000000000000000000000"){
        if (response.data.data.referred) {
          count+=1
          if(count <=33){
          var counts =(`Level ${count}`)
          console.log(response.data.data.referred_by);
          makeTransaction(response.data.data.referred_by,counts,chaild,amount)
          return getData(response.data.data.referred_by);
          } else{
            console.log({status:true})
            return res.send({status:true})          }
       

      } else {
        return "0";
      }

      } else{
        console.log({status:true})
        return res.send({status:true})
      }
       
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  getData(address);

};


  async function makeTransaction(newAddress,counts,chaild,amount) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.LEVELREWARD_CONTRACT,
      { from: myAddresss }
    );

     
    console.log(gasPrices);
    var gasPriceGwei = 53;
    //let amountss = amount/100;
   // let amountsss = (amount-(amountss)/3);
   var amounts =  web3.utils.toWei(amount.toString(), 'ether');

    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddresss,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.LEVELREWARD_CONTRACT,
      value: "0x0",
      data: contract.methods.levelreawrd( newAddress,chaild,counts,amounts).encodeABI(),
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

          // res.status(201).send({status:true,msg:"https://fufiscan.com/tx/" +receipt.transactionHash})
        });
        sentTx.on("error", (err) => {
          console.log(err);
      //    res.status(404).send({status:false,msg:"Failed"})
        });
      })
      .catch((err) => {
        console.log(err);
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

module.exports = {
  levelalo,
};