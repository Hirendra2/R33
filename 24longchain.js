var ethers = require("ethers");
var url = "https://fufi.finance/rpc";

require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const { Console } = require("console");
const web3 = new Web3(Web3.givenProvider || url);
 const abi = fs.readFileSync("./abis/abi_HRewards.json", "utf-8");
var myAddresss = process.env.HREWARDS_ADDRESS;
var privateKey =process.env.HREWARDS_PRIVATEKEY;

    const schedule = require("node-schedule");

//const job = schedule.scheduleJob(" * * 23-24 * *", function () {
  
async function getchield(totaluser,paddress,address,counts) {
    return new Promise(async function executor(resolve, reject) {
        let response;
        let data = JSON.stringify({
            myAddress: address,
        })
        let config = {
            method: "post",
            url: "http://165.22.217.204:3333/getchailds",
            headers: {
                "Content-Type": "application/json",
            },
            data: data,
        };
        await axios(config).then(async function (res) {
            await  sleep(10000);

            if (res.data.data !== address) {

              counts=counts+1;
                console.log("parent",address,"chaield",res.data.data,"counts",counts);
             
             await makeTransaction(res.data.data,counts,paddress,totaluser).then(async(r)=>{
                console.log("*********",r); 
                    await getchield(totaluser,paddress,res.data.data,counts);
                }).catch((err)=>{
                    console.log("Some Error occored"); 
                })
                // return getchield(totaluser,paddress,res.data.data,counts);
            } else {
                //   return "0";
                response = { "status": true, "data": 0 };
                return resolve(response);
            }
        }).catch(function (error) {
            console.log(error);
            response = { "status": false, "message": error };
            return reject(response);

        });
    });
}



const getData = async () => {
     await  sleep(20000);
    var longadd = {
        method: "post",
        url: "http://165.22.217.204:3333/getlongcadd",
        headers: {
            "Content-Type": "application/json",
        },

    };
    await axios(longadd).then(async (response) => {
        newAddress1 = response.data.data;
        var getlongcount = {
            method: "post",
            url: "http://165.22.217.204:3333/getlongcount",
            headers: {
                "Content-Type": "application/json",
            },
    
        };
        await axios(getlongcount).then(async (response) => {
             let totaluser = response.data.data;
            console.log(totaluser);
            await getchield(totaluser,newAddress1,newAddress1,0).then((res) => {
                console.log("KKKKKKKKKKKKK", res);
            }).catch((err) => {
                console.log("Helllll", err);
            })
           
    
        });
        
         console.log(newAddress1);
       
       

    });

   




}



async function makeTransaction(newAddress, counts, chaild,totaluser) {
    return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
        abiArray,
        process.env.HReward,
        { from: myAddresss }
    );

     
    console.log(gasPrices);
    var gasPriceGwei = 53;
    // var amounts = web3.utils.toWei(amount, 'ether');

    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);
    var totalusers = web3.utils.fromWei(totaluser, "ether");

    var rawTransaction = {
        from: myAddresss,
        gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
        gasLimit: web3.utils.toHex(gasLimit),
        to: process.env.HReward,
        value: "0x0",
        data: contract.methods.longlevelss(newAddress, chaild, counts,totalusers).encodeABI(),
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
                return resolve("Success");
                // res.status(201).send({status:true,msg:"https://fufiscan.com/tx/" +receipt.transactionHash})
            });
            sentTx.on("error", (err) => {
                console.log(err);
                return reject(err); 
                //    res.status(404).send({status:false,msg:"Failed"})
            });
        })
        .catch((err) => {
            console.log(err);
        });
    });
}
//});
//console.log("The answer to life, the universe, and everything!");

setTimeout(() => {
    getData();
}, 5000);
getData();

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
