const express = require('express');
const router  = express.Router();
const poolapi = require('../entry');
const referralapi = require('../referral');
const HRewardapi = require('../HReward');
const approveapi = require('../approve');
const Holdersapi = require('../Holders');
const LevelRewardapi = require('../LevelReward');
const ownerentryapi = require('../ownerentry');
const sidapi = require('../sid');
const Testentryapi = require('../Testentry');
router.post('/praveensir', approveapi.praveensir);
router.post('/Fufibalance', approveapi.Fufibalance);

router.post('/getBalance', approveapi.getBalance);
router.post('/FusdHolders', approveapi.FusdHolders);
router.post('/praveensir', approveapi.praveensir);


router.post('/entry', poolapi.entry);
router.post('/withDraw', poolapi.withDraw);
router.post('/getRankdetails', poolapi.getRankdetails);
router.post('/getRankId', poolapi.getRankId);
router.post('/getalluser', poolapi.getalluser);
router.post('/totaluser', poolapi.totaluser);
router.post('/totalDirectR', poolapi.totalDirectR);
router.post('/getDirectreward', poolapi.getDirectreward);
router.post('/Directclaim', poolapi.Directclaim);
router.post('/totalentry', poolapi.totalentry);
router.post('/userentry', poolapi.userentry);
router.post('/Fusdwith', poolapi.Fusdwith);
router.post('/top5', poolapi.top5);
router.post('/gethnd', poolapi.gethnd);
router.post('/gethndadd', poolapi.gethndadd);
router.post('/getPoolBalance', poolapi.getPoolBalance);
router.post('/get24hndadd', poolapi.get24hndadd);
router.post('/TotalEranupdates', poolapi.TotalEranupdates);
router.post('/Totalhnd', poolapi.Totalhnd);
router.post('/LevelBalancesss', poolapi.LevelBalancesss);
router.post('/getforsid', poolapi.getforsid);
router.post('/claim50s', poolapi.claim50s);
router.post('/globlepoolBalance', poolapi.globlepoolBalance);
router.post('/globlepoolrate', poolapi.globlepoolrate);
router.post('/getHSBalances', poolapi.getHSBalances);
router.post('/getTotalburn', poolapi.getTotalburn);
router.post('/Fufiwith', poolapi.Fufiwith);
router.post('/getgrates', poolapi.getgrates);
router.post('/Fusdtransfer', approveapi.Fusdtransfer);
router.post('/getHs', poolapi.getHs);
router.post('/ownerentry', ownerentryapi.ownerentry);
router.post('/TestwithDraw', poolapi.TestwithDraw);
router.post('/getalluserc', poolapi.getalluserc);



router.post('/currentRankId', poolapi.currentRankId);
router.post('/getTotalEarnClaimd', poolapi.getTotalEarnClaimd);
router.post('/getTotalEarn', poolapi.getTotalEarn);
router.post('/referral', referralapi.referral);
router.post('/refer_info', referralapi.refer_info);
router.post('/refer_info1', referralapi.refer_info1);
router.post('/refer_info2', referralapi.refer_info2);
router.post('/refer_info3', referralapi.refer_info3);
router.post('/refer_info4', referralapi.refer_info4);
router.post('/getdirecrtreferral', referralapi.getdirecrtreferral);
router.post('/getTotaluser', referralapi.getTotaluser);
router.post('/checkmember', referralapi.checkmember);
router.post('/totaluser', referralapi.totaluser);
router.post('/user_info', referralapi.user_info);
router.post('/getcount', referralapi.getcount);
router.post('/getDirectcount', referralapi.getDirectcount);
router.post('/getuserhighchainadd', referralapi.getuserhighchainadd);
router.post('/getonedayalladds', referralapi.getonedayalladds);
router.post('/gettodayid', referralapi.gettodayid);
router.post('/getchailds', referralapi.getchailds);
router.post('/getlongcadd', referralapi.getlongcadd);
router.post('/getlongcount', referralapi.getlongcount);
router.post('/gethighadd', referralapi.gethighadd);
router.post('/gethighreferralcount', referralapi.gethighreferralcount);
router.post('/setuser', referralapi.setuser);
router.post('/getuser', referralapi.getuser);
router.post('/ownerreferral', referralapi.ownerreferral);
router.post('/NEWownerreferral', referralapi.NEWownerreferral);
router.post('/changeparent', referralapi.changeparent);




router.post('/getHNDReward', HRewardapi.getHNDReward);
router.post('/getLongchainId', HRewardapi.getLongchainId);
router.post('/getHighchainReward', HRewardapi.getHighchainReward);
router.post('/getTotalHNDReward', HRewardapi.getTotalHNDReward);
router.post('/getTotalLongchainReward', HRewardapi.getTotalLongchainReward);
router.post('/getTotalHighchainReward', HRewardapi.getTotalHighchainReward);
router.post('/HNDclaim', HRewardapi.HNDclaim);
router.post('/Highchainclaim', HRewardapi.Highchainclaim);
router.post('/getLongchainIdetails', HRewardapi.getLongchainIdetails);
router.post('/allLongLevelsclaim', HRewardapi.allLongLevelsclaim);
router.post('/gethrewards', HRewardapi.gethrewards);
router.post('/getLongchainreming', HRewardapi.getLongchainreming);
router.post('/gethndamount', HRewardapi.gethndamount);
router.post('/Longchain', HRewardapi.Longchain);
router.post('/updatelongrewards', HRewardapi.updatelongrewards);



router.post('/approves', approveapi.approves);
router.post('/Tokentransfer', approveapi.Tokentransfer);

router.post('/Fuficlaim', Holdersapi.Fuficlaim);
router.post('/getFufiReward', Holdersapi.getFufiReward);
router.post('/Fusdclaim', Holdersapi.Fusdclaim);
router.post('/getFusdReward', Holdersapi.getFusdReward);
router.post('/SidClaim', Holdersapi.SidClaim);
router.post('/getSid', Holdersapi.getSid);
router.post('/updatefufisupply', Holdersapi.updatefufisupply);
router.post('/gettotalFufiReward', Holdersapi.gettotalFufiReward);
router.post('/gettotalFusdReward', Holdersapi.gettotalFusdReward);
router.post('/gettatalSid', Holdersapi.gettatalSid);
router.post('/gethstable', Holdersapi.gethstable);
router.post('/getfusdsapply', Holdersapi.getfusdsapply);
router.post('/getfufisapply', Holdersapi.getfufisapply);




router.post('/Levelsclaim', LevelRewardapi.Levelsclaim);
router.post('/LevelsRewards', LevelRewardapi.LevelsRewards);
router.post('/LevelsRewardsID', LevelRewardapi.LevelsRewardsID);
router.post('/totalLevelsRewards', LevelRewardapi.totalLevelsRewards);
router.post('/ClaimTotalEarns', LevelRewardapi.ClaimTotalEarns);
router.post('/totalLevelsRewardsearn', LevelRewardapi.totalLevelsRewardsearn);
router.post('/affiliateadd', LevelRewardapi.affiliateadd);




const R33api = require('../R33');
const usdtapi = require('../usdtpool');
router.post('/R3333', R33api.R3333);
router.post('/bridgeamt', R33api.bridgeamt);
router.post('/getTotalR33allocated', R33api.getTotalR33allocated);
router.post('/getR33allocated', R33api.getR33allocated);
router.post('/getTotalLPallocated', R33api.getTotalLPallocated);
router.post('/Fusd', R33api.Fusd);
router.post('/updateR3333', R33api.updateR3333);
router.post('/Fusdadd', R33api.Fusdadd);
router.post('/newR3333', R33api.newR3333);
router.post('/usedbridgeamt', R33api.usedbridgeamt);

router.post('/Fusdsub', R33api.Fusdsub);
router.post('/R3333sub', R33api.R3333sub);



router.post('/getronaddress', usdtapi.getronaddress);
router.post('/claim', usdtapi.claim);
router.post('/usdtbalance', usdtapi.usdtbalance);
router.post('/Testentry', Testentryapi.Testentry);
router.post('/idwithDraw', Testentryapi.idwithDraw);
//router.post('/getHss', Testentryapi.getHss);


const swapapi = require('../swap');
router.post('/swapFufiToFusd', swapapi.swapFufiToFusd);
router.post('/getFusdBalance', swapapi.getFusdBalance);
router.post('/swapFusdToFufi', swapapi.swapFusdToFufi);
router.post('/getrate', swapapi.getrate);


router.post('/SidFusd', sidapi.SidFusd);
router.post('/getSidFusd', sidapi.getSidFusd);
router.post('/burnrate', sidapi.burnrate);



module.exports = router;

