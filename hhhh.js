const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");


const TronTRC20Transfer = async (fromAddress, privateKey, toAddress,am) => {
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  tronWeb.setHeader({ "TRON-PRO-API-KEY": "e0cbf5e4-e9c6-4645-ab9c-949dad837ca9" });
  return new Promise(async (resolve, reject) => {
      try {
          const tronWeb = new TronWeb({
              fullHost: RPC,
              headers: { "TRON-PRO-API-KEY": 'e0cbf5e4-e9c6-4645-ab9c-949dad837ca9' },
              privateKey: '123456'
          });
        
          const tradeobj = await tronWeb.transactionBuilder.sendTrx(
              toAddress,
              // 7000000,
              am,
              fromAddress
          );
          // Sign
          const signedtxn = await tronWeb.trx.sign(
              tradeobj,
              privateKey
          );
          // Broadcast
          const receipt = await tronWeb.trx.sendRawTransaction(
              signedtxn
          ).then(output => {
              console.log('- Output:', output.txid, '\n');
              return resolve(output.txid);;
          });
      } catch (e) {
          console.log(e);
          return reject(e);
      }
  });
}