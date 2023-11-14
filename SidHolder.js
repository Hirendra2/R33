var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const schedule = require("node-schedule");

const abi = fs.readFileSync("./abis/abi_Stable.json", "utf-8");
var myAddresss = process.env.STABLE_ADDRESS;
var privateKey =process.env.STABLE_PRIVATEKEY;
//var amount = 10;

const getData = async () => {

    var config = {
        method: "post",
        url: "http://165.22.217.204:3333/getalluser",
        headers: {
            "Content-Type": "application/json",
        },
    };

    axios(config).then(async function (response) {
        let start = 0;
        let end = 30;
        newAddress1 = response.data.data;
        let totaluser = response.data.data.length;
        console.log("totaluser",totaluser)
        const propertyValues = Object.values(newAddress1);
       await makeTransaction(propertyValues,0,30,totaluser).then((res)=>{
        console.log("FINALRES",res); 
       }).catch((err)=>{
        console.log("LLLLLLLLLLL",err); 
       });
    })
        .catch(function (error) {
            console.log(error);
        });
};


async function getalladdressbal(data) {
    return new Promise(async function executor(resolve, reject) {
        let response;
        const web3 = new Web3(new Web3.providers.HttpProvider(url));
        let amount= []; 
        data.forEach(async (element,i) => {
            await sleep(i*100);
            web3.eth.getBalance(element, function(err, result) {
                if (err) {
                  console.log(err)
                } else {
                 // let am=web3.utils.fromWei(result, "ether");
                  amount.push(result); 
                }
              })
        }); 
        setTimeout(() => {
          //  console.log("JJJJJJJJJJJJ",amount); 
            return resolve(amount); 
        },5000);      
    });
}


async function makeTransaction(propertyValues, start, end,totaluser) {
    let index = propertyValues.slice(start, end);
    console.log("KKKKKKKKKKKK",index,"orgarr",propertyValues); 
    return new Promise(async function executor(resolve, reject) {
        let response;
        if (index && index.length > 0) {
            await getalladdressbal(index).then(async (res)=>{
              //  console.log("rew@@@@@@@@@@",res); 
                const abiArray = JSON.parse(abi);
            var contract = new web3.eth.Contract(abiArray,process.env.Hstable, { from: myAddresss });
             
         
            var gasPriceGwei = 100;
            console.log("gasPriceGwei", gasPriceGwei);
            var gasLimit = 6599999;
            console.log("gasLimit", gasLimit);
            // var amt = ["1234000000000000000000","1235000000000000000000","1234000005000000000000"];
            let amt = res;
            var rawTransaction = {
                from: myAddresss,
                gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
                gasLimit: web3.utils.toHex(gasLimit),
                to: process.env.Hstable,
                value: "0x0",
                data: contract.methods.sids(index,totaluser).encodeABI(),
            };
            console.log(
                `Raw of Transaction: \n${JSON.stringify(
                    rawTransaction,
                    null,
                    "\t"
                )}\n------------------------`
            );

            const signPromise = web3.eth.accounts.signTransaction(rawTransaction, privateKey);
            signPromise.then((signedTx) => {
                const sentTx = web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction
                );
                sentTx.on("receipt", async (receipt) => {
                    console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
                    await sleep(20000); 
                    start = end;
                    end = end + 30;
                    await makeTransaction(propertyValues, start, end,totaluser).then((res) => {
                        console.log("HElll")
                       
                        // makeTransaction(propertyValues, start, end);

                    }).catch((err) => {
                        response = { "status": false, "message": err };
                        return reject(response);
                    })

                });
                sentTx.on("error", (err) => {
                    console.log(err);
                    response = { "status": false, "message": err };
                    return reject(response);
                });
            }).catch((err) => {
                console.log(err);
                response = { "status": false, "message": err };
                return reject(response);
            });

          }).catch((err)=>{
              console.log("hdshsd",err); 
          })
            
        } else {
            response = { "status": true, "message":"Success" };
            return resolve(response);
        }

    });
}
// makeTransaction(TenAddress);

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

let rule2 = new schedule.RecurrenceRule();
rule2.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
rule2.hour = 00;
rule2.minute = 15;
schedule.scheduleJob(rule2, function () {
    console.log('Sid Holders ');
    getData().then((res) => {
        console.log("&&**", res);
    }).catch((err) => {
        console.log("ERRRRRRRRRR", err);
    });
});



module.exports = {
    getData,}