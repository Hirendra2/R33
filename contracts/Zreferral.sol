// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

library SafeMath {
    function tryAdd(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    function trySub(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    function tryMul(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    function tryDiv(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    function tryMod(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

contract refer {
    using SafeMath for uint256;

    struct User {
        bool referred;
        address referred_by;
    }

    address[] member;

    struct MemberStruct {
        bool isExist;
        uint256 id;
        uint256 referrerID;
        uint256 referredUsers;
        uint256 count;
    }

    struct Referal_levels {
        uint256 level_1;
        uint256 level_2;
        uint256 level_3;
        uint256 level_4;
        uint256 level_5;
        uint256 level_6;
        uint256 level_7;
        uint256 level_8;
        uint256 level_9;
        uint256 _totalreferred;
    }
    struct Referal_levels2 {
        uint256 level_10;
        uint256 level_11;
        uint256 level_12;
        uint256 level_13;
        uint256 level_14;
        uint256 level_15;
        uint256 level_16;
        uint256 level_17;
        uint256 level_18;
        uint256 _totalreferred;
    }
    struct Referal_levels3 {
        uint256 level_19;
        uint256 level_20;
        uint256 level_21;
        uint256 level_22;
        uint256 level_23;
        uint256 level_24;
        uint256 level_25;
        uint256 level_26;
        uint256 level_27;
        uint256 _totalreferred;
    }
    struct Referal_levels4 {
        uint256 level_28;
        uint256 level_29;
        uint256 level_30;
        uint256 level_31;
        uint256 level_32;
        uint256 level_33;
        uint256 _totalreferred;
    }

    uint256 public count1 = 0;
    uint256 public count2 = 0;
    uint256 public count3 = 0;
    uint256 public count4 = 0;
    uint256 public count5 = 0;
    uint256 public parentcount = 0;
    uint256 public usercount = 0;
    address payable public userhighchainadd;
    address payable public highchainadd1;
    address payable public highchainadd2;
    address payable public highchainadd3;
    address payable public highchainadd4;
    address payable public highchainadd5;

    address payable public multichainadd1;
    address payable public multichainadd2;
    address payable public multichainadd3;
    address payable public multichainadd4;
    address payable public multichainadd5;
    address payable public multichainadd6;

    uint256 public multicount1 = 0;
    uint256 public multicount2 = 0;
    uint256 public multicount3 = 0;
    uint256 public multicount4 = 0;
    uint256 public multicount5 = 0;
    uint256 public multicount6 = 0;

        address public _owner;
    mapping(address => uint8) public _owners;
     modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }
        constructor() payable {
        _owner = msg.sender;

    }

    function addOwner(address owner) public validOwner {
        require(_owner == msg.sender);
        _owners[owner] = 1;
    }

    function removeOwner(address owner) public validOwner {
        require(_owner == msg.sender);
        _owners[owner] = 0;
    }



    mapping(address => Referal_levels) public refer_info;
    mapping(address => Referal_levels2) public refer_info2;
    mapping(address => Referal_levels3) public refer_info3;
    mapping(address => Referal_levels4) public refer_info4;

    mapping(address => User) public user_info;
    mapping(address => MemberStruct) public members;
    mapping(uint256 => address) public membersList;
    mapping(uint256 => mapping(uint256 => address)) public memberChild;
    uint256 public lastMember;
    event eventNewUser(address _mod, address _member, address _ref_add);
    address[] public user;
    uint256 public todayid;
    mapping(address => uint256) public storauser;

    receive() external payable {}

    mapping(uint256 => uint256) map;


    struct Today {
        uint256 tcount;
    }

    struct MultiToday {
        uint256 multicount;
    }
    mapping(address => Today) public mtoday;
    mapping(address => MultiToday) public onemultitoday;

    address[] public oneday;
    address[] public multioneday;

    function referral(address _ref_add, address _member)
        public
        payable
        returns (address[] memory)
    {
        require(user_info[_member].referred == false, " Already referred ");
        require(_ref_add != _member, " You cannot refer yourself ");
      //  require(msg.sender == _member, "You are not user");
        user_info[_member].referred_by = _ref_add;
        user_info[_member].referred = true;
        MemberStruct memory memberStruct;
        memberStruct = MemberStruct({
            isExist: true,
            id: lastMember,
            referrerID: members[_ref_add].id,
            referredUsers: 0,
            count: 0
        });
        members[_member] = memberStruct;
        membersList[lastMember] = _member;
        memberChild[members[_ref_add].id][
            members[_ref_add].referredUsers
        ] = _member;
        members[_ref_add].referredUsers++;
        members[_ref_add].count++;
        lastMember++;
        emit eventNewUser(_member, _member, _ref_add);
        user.push(_member);

        Today memory today;
        today = Today({tcount: 0});
        todayid += 1;
        oneday.push(_ref_add);
        mtoday[_member] = today;
        mtoday[_ref_add].tcount++;

        MultiToday memory multiToday;
        multiToday = MultiToday({multicount: 0});
        todayid += 1;
        multioneday.push(_ref_add);
        onemultitoday[_member] = multiToday;
        onemultitoday[_ref_add].multicount++;

        if (mtoday[_ref_add].tcount > usercount) {
            usercount = mtoday[_ref_add].tcount;
            multicount1 = onemultitoday[_ref_add].multicount;

            userhighchainadd = payable(_ref_add);
        }

        if (mtoday[_ref_add].tcount > count1) {
            count1 = mtoday[_ref_add].tcount;
            highchainadd2 = highchainadd1;
            highchainadd1 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count1 && mtoday[_ref_add].tcount > count2
        ) {
            count2 = mtoday[_ref_add].tcount;
            highchainadd3 = highchainadd2;
            highchainadd2 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count2 && mtoday[_ref_add].tcount > count3
        ) {
            count3 = mtoday[_ref_add].tcount;
            highchainadd4 = highchainadd3;
            highchainadd3 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count3 && mtoday[_ref_add].tcount > count4
        ) {
            count4 = mtoday[_ref_add].tcount;
            highchainadd5 = highchainadd4;
            highchainadd4 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count4 && mtoday[_ref_add].tcount > count5
        ) {
            count5 = mtoday[_ref_add].tcount;
            highchainadd5 = payable(_ref_add);
        }

        address level1 = user_info[_member].referred_by;
        address parentaddress = _ref_add;

        if ((level1 != _member) && (level1 != address(0))) {
            refer_info[level1].level_1 += 1;
            refer_info[level1]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level2 = user_info[level1].referred_by;

        if ((level2 != _member) && (level2 != address(0))) {
            refer_info[level2].level_2 += 1;
            refer_info[level2]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level3 = user_info[level2].referred_by;

        if ((level3 != _member) && (level3 != address(0))) {
            refer_info[level3].level_3 += 1;
            refer_info[level3]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level4 = user_info[level3].referred_by;
        address _members =_member;
        if ((level4 != _members )&& (level4 != address(0))) {
            refer_info[level4].level_4 += 1;
            refer_info[level4]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level5 = user_info[level4].referred_by;

        if ((level5 !=_members) && (level5 != address(0))) {
            refer_info[level5].level_5 += 1;
            refer_info[level5]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level6 = user_info[level5].referred_by;

        if ((level6 != _members) && (level6 != address(0))) {
            refer_info[level6].level_6 += 1;
            refer_info[level6]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level7 = user_info[level6].referred_by;

        if ((level7 != _members) && (level7 != address(0))) {
            refer_info[level7].level_7 += 1;
            refer_info[level7]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level8 = user_info[level7].referred_by;

        if ((level8 != _members) && (level8 != address(0))) {
            refer_info[level8].level_8 += 1;
            refer_info[level8]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level9 = user_info[level8].referred_by;

        if ((level9 != _members) && (level9 != address(0))) {
            refer_info[level9].level_9 += 1;
            refer_info[level9]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level10 = user_info[level9].referred_by;

        if ((level10 != _members) && (level10 != address(0))) {
            refer_info2[level10].level_10 += 1;
            refer_info2[level10]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level11 = user_info[level10].referred_by;

        if ((level11 != _members) && (level11 != address(0))) {
            refer_info2[level11].level_11 += 1;
            refer_info2[level11]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level12 = user_info[level11].referred_by;

        if ((level12 != _members) && (level12 != address(0))) {
            refer_info2[level12].level_12 += 1;
            refer_info2[level12]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level13 = user_info[level12].referred_by;

        if ((level13 != _members) && (level13 != address(0))) {
            refer_info2[level13].level_13 += 1;
            refer_info2[level13]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level14 = user_info[level13].referred_by;
                address parentaddress1 = parentaddress;

        if ((level14 != _members) && (level14 != address(0))) {
            refer_info2[level14].level_14 += 1;
            refer_info2[level14]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level15 = user_info[level14].referred_by;

        if ((level15 != _members) && (level15 != address(0))) {
            refer_info2[level15].level_15 += 1;
            refer_info2[level15]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }

        address level16 = user_info[level15].referred_by;

        if ((level16 != _members) && (level16 != address(0))) {
            refer_info2[level16].level_16 += 1;
            refer_info2[level16]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level17 = user_info[level16].referred_by;
        address _members1 = _members;

        if ((level17 != _members1) && (level17 != address(0))) {
            refer_info2[level17].level_17 += 1;
            refer_info2[level17]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level18 = user_info[level17].referred_by;

        if ((level18 != _members1) && (level18 != address(0))) {
            refer_info2[level18].level_18 += 1;
            refer_info2[level18]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level19 = user_info[level18].referred_by;

        if ((level19 != _members1) && (level19 != address(0))) {
            refer_info3[level19].level_19 += 1;
            refer_info3[level19]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level20 = user_info[level19].referred_by;

        if ((level20 != _members1) && (level20 != address(0))) {
            refer_info3[level20].level_20 += 1;
            refer_info3[level20]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level21 = user_info[level20].referred_by;

        if ((level21 != _members1) && (level21 != address(0))) {
            refer_info3[level21].level_21 += 1;
            refer_info3[level21]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level22 = user_info[level21].referred_by;

        if ((level22 != _members1) && (level22 != address(0))) {
            refer_info3[level22].level_22 += 1;
            refer_info3[level22]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level23 = user_info[level22].referred_by;
        if ((level23 != _members1) && (level23 != address(0))) {
            refer_info3[level23].level_23 += 1;
            refer_info3[level23]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level24 = user_info[level23].referred_by;
        if ((level24 != _members1) && (level24 != address(0))) {
            refer_info3[level24].level_25 += 1;
            refer_info3[level24]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level25 = user_info[level24].referred_by;
        if ((level25 != _members1) && (level25 != address(0))) {
            refer_info3[level25].level_25 += 1;
            refer_info3[level25]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level26 = user_info[level25].referred_by;
        if ((level26 != _members1) && (level26 != address(0))) {
            refer_info3[level26].level_26 += 1;
            refer_info3[level26]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
                        address parentaddress2 = parentaddress1;

        address level27 = user_info[level26].referred_by;
        if ((level27 != _members1) && (level27 != address(0))) {
            refer_info3[level27].level_27 += 1;
            refer_info3[level27]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }

        address level28 = user_info[level27].referred_by;
        if ((level28 != _members1) && (level28 != address(0))) {
            refer_info4[level28].level_28 += 1;
            refer_info4[level28]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level29 = user_info[level28].referred_by;
        if ((level29 != _members1) && (level29 != address(0))) {
            refer_info4[level29].level_29 += 1;
            refer_info4[level29]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level30 = user_info[level29].referred_by;
        if ((level30 != _members1) && (level30 != address(0))) {
            refer_info4[level30].level_30 += 1;
            refer_info4[level30]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
                                address _members2 = _members1;

        address level31 = user_info[level30].referred_by;
        if ((level31 != _members2) && (level31 != address(0))) {
            refer_info4[level31].level_31 += 1;
            refer_info4[level31]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }

        address level32 = user_info[level31].referred_by;
        if ((level32 != _members2) && (level32 != address(0))) {
            refer_info4[level32].level_32 += 1;
            refer_info4[level32]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level33 = user_info[level32].referred_by;
        if ((level33 != _members2) && (level33 != address(0))) {
            refer_info4[level33].level_33 += 1;
            refer_info4[level33]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address totalreferred = user_info[level33].referred_by;

   

        if (onemultitoday[parentaddress2].multicount > multicount1) {
            multicount1 = onemultitoday[parentaddress2].multicount;
            multichainadd1 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount1 &&
            onemultitoday[parentaddress2].multicount > multicount2
        ) {
            multicount2 = onemultitoday[parentaddress2].multicount;
            multichainadd3 = multichainadd2;
            multichainadd2 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount2 &&
            onemultitoday[parentaddress2].multicount > multicount3
        ) {
            multicount3 = onemultitoday[parentaddress2].multicount;
            multichainadd4 = multichainadd3;
            multichainadd3 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount3 &&
            onemultitoday[parentaddress2].multicount > multicount4
        ) {
            multicount4 = onemultitoday[parentaddress2].multicount;
            multichainadd5 = multichainadd4;
            multichainadd4 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount4 &&
            onemultitoday[parentaddress2].multicount > multicount5
        ) {
            multicount4 = onemultitoday[parentaddress2].multicount;
            multichainadd5 = payable(parentaddress2);
        }else if (
            onemultitoday[parentaddress2].multicount < multicount5 &&
            onemultitoday[parentaddress2].multicount > multicount6
        ) {
            multicount5 = onemultitoday[parentaddress2].multicount;
            multichainadd6 = payable(parentaddress2);
        }
        //   address onereferred = user_info[level33].referred_by;
    }

    function getListReferrals(address _member)
        public
        view
        returns (address[] memory)
    {
        address[] memory referrals = new address[](
            members[_member].referredUsers
        );
        if (members[_member].referredUsers > 0) {
            for (uint256 i = 0; i < members[_member].referredUsers; i++) {
                if (memberChild[members[_member].id][i] != address(0)) {
                    referrals[i] = memberChild[members[_member].id][i];
                } else {
                    break;
                }
            }
        }
        return referrals;
    }

    function isMember(address _user) public view returns (bool) {
        return members[_user].isExist;
    }

    function getchaild(address parent) public view returns (address) {
        return membersList[members[parent].referrerID];
    }

    function getTotaluser() external view returns (address[] memory) {
        return user;
    }

    function getoneday() external view returns (address[] memory) {
        return oneday;
    }

    function reset() public returns (bool success) {
        require(_owner == msg.sender);
        delete oneday;
        delete multioneday;
        delete usercount;
        delete count1;
        delete count2;
        delete count3;
        delete count4;
        delete count5;
        delete userhighchainadd;
        delete highchainadd1;
        delete highchainadd2;
        delete highchainadd3;
        delete highchainadd4;
        delete highchainadd5;
        delete multichainadd1;
        delete multichainadd2;
        delete multichainadd3;
        delete multichainadd4;
        delete multichainadd5;
        delete multicount1;
        delete multicount2;
        delete multicount3;
        delete multicount4;
        delete multicount5;
        delete todayid;

        return true;
    }

    function getone(uint256 ID) external view returns (address) {
        return oneday[ID];
    }

    function gettodayid() external view returns (uint256) {
        return todayid;
    }

        function sstorauser(address user) external  {
            uint amt = 1;
            storauser[user] = amt;
    }

    function ownerreferral(address _ref_add, address _member)
        public
        payable  validOwner
        returns (address[] memory)
    {
        require(user_info[_member].referred == false, " Already referred ");
        require(_ref_add != _member, " You cannot refer yourself ");
      //  require(msg.sender == _member, "You are not user");
        user_info[_member].referred_by = _ref_add;
        user_info[_member].referred = true;
        MemberStruct memory memberStruct;
        memberStruct = MemberStruct({
            isExist: true,
            id: lastMember,
            referrerID: members[_ref_add].id,
            referredUsers: 0,
            count: 0
        });
        members[_member] = memberStruct;
        membersList[lastMember] = _member;
        memberChild[members[_ref_add].id][
            members[_ref_add].referredUsers
        ] = _member;
        members[_ref_add].referredUsers++;
        members[_ref_add].count++;
        lastMember++;
        emit eventNewUser(_member, _member, _ref_add);
        user.push(_member);

        Today memory today;
        today = Today({tcount: 0});
        todayid += 1;
        oneday.push(_ref_add);
        mtoday[_member] = today;
        mtoday[_ref_add].tcount++;

        MultiToday memory multiToday;
        multiToday = MultiToday({multicount: 0});
        todayid += 1;
        multioneday.push(_ref_add);
        onemultitoday[_member] = multiToday;
        onemultitoday[_ref_add].multicount++;

        if (mtoday[_ref_add].tcount > usercount) {
            usercount = mtoday[_ref_add].tcount;
            multicount1 = onemultitoday[_ref_add].multicount;

            userhighchainadd = payable(_ref_add);
        }

        if (mtoday[_ref_add].tcount > count1) {
            count1 = mtoday[_ref_add].tcount;
            highchainadd2 = highchainadd1;
            highchainadd1 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count1 && mtoday[_ref_add].tcount > count2
        ) {
            count2 = mtoday[_ref_add].tcount;
            highchainadd3 = highchainadd2;
            highchainadd2 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count2 && mtoday[_ref_add].tcount > count3
        ) {
            count3 = mtoday[_ref_add].tcount;
            highchainadd4 = highchainadd3;
            highchainadd3 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count3 && mtoday[_ref_add].tcount > count4
        ) {
            count4 = mtoday[_ref_add].tcount;
            highchainadd5 = highchainadd4;
            highchainadd4 = payable(_ref_add);
        } else if (
            mtoday[_ref_add].tcount < count4 && mtoday[_ref_add].tcount > count5
        ) {
            count5 = mtoday[_ref_add].tcount;
            highchainadd5 = payable(_ref_add);
        }

        address level1 = user_info[_member].referred_by;
        address parentaddress = _ref_add;

        if ((level1 != _member) && (level1 != address(0))) {
            refer_info[level1].level_1 += 1;
            refer_info[level1]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level2 = user_info[level1].referred_by;

        if ((level2 != _member) && (level2 != address(0))) {
            refer_info[level2].level_2 += 1;
            refer_info[level2]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level3 = user_info[level2].referred_by;

        if ((level3 != _member) && (level3 != address(0))) {
            refer_info[level3].level_3 += 1;
            refer_info[level3]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level4 = user_info[level3].referred_by;
        address _members =_member;
        if ((level4 != _members )&& (level4 != address(0))) {
            refer_info[level4].level_4 += 1;
            refer_info[level4]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level5 = user_info[level4].referred_by;

        if ((level5 !=_members) && (level5 != address(0))) {
            refer_info[level5].level_5 += 1;
            refer_info[level5]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level6 = user_info[level5].referred_by;

        if ((level6 != _members) && (level6 != address(0))) {
            refer_info[level6].level_6 += 1;
            refer_info[level6]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level7 = user_info[level6].referred_by;

        if ((level7 != _members) && (level7 != address(0))) {
            refer_info[level7].level_7 += 1;
            refer_info[level7]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level8 = user_info[level7].referred_by;

        if ((level8 != _members) && (level8 != address(0))) {
            refer_info[level8].level_8 += 1;
            refer_info[level8]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level9 = user_info[level8].referred_by;

        if ((level9 != _members) && (level9 != address(0))) {
            refer_info[level9].level_9 += 1;
            refer_info[level9]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level10 = user_info[level9].referred_by;

        if ((level10 != _members) && (level10 != address(0))) {
            refer_info2[level10].level_10 += 1;
            refer_info2[level10]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level11 = user_info[level10].referred_by;

        if ((level11 != _members) && (level11 != address(0))) {
            refer_info2[level11].level_11 += 1;
            refer_info2[level11]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level12 = user_info[level11].referred_by;

        if ((level12 != _members) && (level12 != address(0))) {
            refer_info2[level12].level_12 += 1;
            refer_info2[level12]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level13 = user_info[level12].referred_by;

        if ((level13 != _members) && (level13 != address(0))) {
            refer_info2[level13].level_13 += 1;
            refer_info2[level13]._totalreferred += 1;
            onemultitoday[parentaddress].multicount++;
        }
        address level14 = user_info[level13].referred_by;
                address parentaddress1 = parentaddress;

        if ((level14 != _members) && (level14 != address(0))) {
            refer_info2[level14].level_14 += 1;
            refer_info2[level14]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level15 = user_info[level14].referred_by;

        if ((level15 != _members) && (level15 != address(0))) {
            refer_info2[level15].level_15 += 1;
            refer_info2[level15]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }

        address level16 = user_info[level15].referred_by;

        if ((level16 != _members) && (level16 != address(0))) {
            refer_info2[level16].level_16 += 1;
            refer_info2[level16]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level17 = user_info[level16].referred_by;
        address _members1 = _members;

        if ((level17 != _members1) && (level17 != address(0))) {
            refer_info2[level17].level_17 += 1;
            refer_info2[level17]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level18 = user_info[level17].referred_by;

        if ((level18 != _members1) && (level18 != address(0))) {
            refer_info2[level18].level_18 += 1;
            refer_info2[level18]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level19 = user_info[level18].referred_by;

        if ((level19 != _members1) && (level19 != address(0))) {
            refer_info3[level19].level_19 += 1;
            refer_info3[level19]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level20 = user_info[level19].referred_by;

        if ((level20 != _members1) && (level20 != address(0))) {
            refer_info3[level20].level_20 += 1;
            refer_info3[level20]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level21 = user_info[level20].referred_by;

        if ((level21 != _members1) && (level21 != address(0))) {
            refer_info3[level21].level_21 += 1;
            refer_info3[level21]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level22 = user_info[level21].referred_by;

        if ((level22 != _members1) && (level22 != address(0))) {
            refer_info3[level22].level_22 += 1;
            refer_info3[level22]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level23 = user_info[level22].referred_by;
        if ((level23 != _members1) && (level23 != address(0))) {
            refer_info3[level23].level_23 += 1;
            refer_info3[level23]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level24 = user_info[level23].referred_by;
        if ((level24 != _members1) && (level24 != address(0))) {
            refer_info3[level24].level_25 += 1;
            refer_info3[level24]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level25 = user_info[level24].referred_by;
        if ((level25 != _members1) && (level25 != address(0))) {
            refer_info3[level25].level_25 += 1;
            refer_info3[level25]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
        address level26 = user_info[level25].referred_by;
        if ((level26 != _members1) && (level26 != address(0))) {
            refer_info3[level26].level_26 += 1;
            refer_info3[level26]._totalreferred += 1;
            onemultitoday[parentaddress1].multicount++;
        }
                        address parentaddress2 = parentaddress1;

        address level27 = user_info[level26].referred_by;
        if ((level27 != _members1) && (level27 != address(0))) {
            refer_info3[level27].level_27 += 1;
            refer_info3[level27]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }

        address level28 = user_info[level27].referred_by;
        if ((level28 != _members1) && (level28 != address(0))) {
            refer_info4[level28].level_28 += 1;
            refer_info4[level28]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level29 = user_info[level28].referred_by;
        if ((level29 != _members1) && (level29 != address(0))) {
            refer_info4[level29].level_29 += 1;
            refer_info4[level29]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level30 = user_info[level29].referred_by;
        if ((level30 != _members1) && (level30 != address(0))) {
            refer_info4[level30].level_30 += 1;
            refer_info4[level30]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
                                address _members2 = _members1;

        address level31 = user_info[level30].referred_by;
        if ((level31 != _members2) && (level31 != address(0))) {
            refer_info4[level31].level_31 += 1;
            refer_info4[level31]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }

        address level32 = user_info[level31].referred_by;
        if ((level32 != _members2) && (level32 != address(0))) {
            refer_info4[level32].level_32 += 1;
            refer_info4[level32]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address level33 = user_info[level32].referred_by;
        if ((level33 != _members2) && (level33 != address(0))) {
            refer_info4[level33].level_33 += 1;
            refer_info4[level33]._totalreferred += 1;
            onemultitoday[parentaddress2].multicount++;
        }
        address totalreferred = user_info[level33].referred_by;

   

        if (onemultitoday[parentaddress2].multicount > multicount1) {
            multicount1 = onemultitoday[parentaddress2].multicount;
            multichainadd1 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount1 &&
            onemultitoday[parentaddress2].multicount > multicount2
        ) {
            multicount2 = onemultitoday[parentaddress2].multicount;
            multichainadd3 = multichainadd2;
            multichainadd2 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount2 &&
            onemultitoday[parentaddress2].multicount > multicount3
        ) {
            multicount3 = onemultitoday[parentaddress2].multicount;
            multichainadd4 = multichainadd3;
            multichainadd3 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount3 &&
            onemultitoday[parentaddress2].multicount > multicount4
        ) {
            multicount4 = onemultitoday[parentaddress2].multicount;
            multichainadd5 = multichainadd4;
            multichainadd4 = payable(parentaddress2);
        } else if (
            onemultitoday[parentaddress2].multicount < multicount4 &&
            onemultitoday[parentaddress2].multicount > multicount5
        ) {
            multicount4 = onemultitoday[parentaddress2].multicount;
            multichainadd5 = payable(parentaddress2);
        }else if (
            onemultitoday[parentaddress2].multicount < multicount5 &&
            onemultitoday[parentaddress2].multicount > multicount6
        ) {
            multicount5 = onemultitoday[parentaddress2].multicount;
            multichainadd6 = payable(parentaddress2);
        }
        //   address onereferred = user_info[level33].referred_by;
    }

}