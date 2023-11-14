// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HRewards {
    address public _owner;
    mapping(address => uint8) public _owners;
    mapping(address => uint8) public _blockOwners;
    address public _blockOwner;
    mapping(address=>bool) isBlacklisted;

    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }
        
    modifier blockOwner() {
        require(msg.sender == _blockOwner || _blockOwners[msg.sender] == 1);
        _;
    }
    uint256 alltotal = 1;

    constructor() payable {
        _owner = msg.sender;
        _blockOwner = msg.sender;

    }

    function addOwner(address owner) public validOwner {
        require(_owner == msg.sender);
        _owners[owner] = 1;
    }

    function removeOwner(address owner) public validOwner {
        require(_owner == msg.sender);
        _owners[owner] = 0;
    }

        function addblockOwner(address owners) public blockOwner {
        require(_blockOwner == msg.sender);
        _blockOwners[owners] = 1;
    }

    function removeblockOwner(address owners) public blockOwner {
        require(_owner == msg.sender);
        _blockOwners[owners] = 0;
    }

    function blackList(address _user)  public  blockOwner{
        require(!isBlacklisted[_user], "user already blacklisted");
        isBlacklisted[_user] = true;
    }
    
    function removeFromBlacklist(address _user)  public  blockOwner{
        require(isBlacklisted[_user], "user already whitelisted");
        isBlacklisted[_user] = false;
    }

    struct LongLevel {
        uint256 levelId;
        address parent;
        address LongLevelschaildadd;
        uint256 levelamount;
        uint256 createdDate;
        bool open;
    }

    mapping(address => uint256) public totalLongLevelsRewards;

    LongLevel longlevel;
    uint256 public LongLevelId;
    mapping(uint256 => LongLevel) public LongLevels;
    mapping(address => uint256[]) public LongLevelIdsByAddress;
    mapping(address => address[]) public LongLevelIdsBy;
    mapping(address => uint256) public LongLevelaffiliate;
    mapping(address => uint256) public hnd;
    mapping(address => uint256) public totalhnd;
    mapping(address => uint256) public highchain;
    mapping(address => uint256) public totalhighchain;
    mapping(address => uint256) public Longchain;
    mapping(address => uint256) public Longchainreming;
    mapping(address => uint256) public ClaimedHnd;
    mapping(address => uint256) public ClaimedHigh;
    uint256 public hrewards;
    uint256 public longamount;
    uint256 public hndamount;
    uint256 public highgamount;
    uint256 public total;

    struct rH3 {
        uint256 rH3Id;
        address hndaddress;
        uint256 hndamount;
        address highadd;
        uint256 highgamount;
        uint256 createdDate;
    }
    rH3 rh3;
    uint256 public rH3Id;
    mapping(uint256 => rH3) public rh3s;
    mapping(address => uint256[]) public rh3IdsByAddress;

    function longlevelss(
        address parent,
        address LongLevelschaildadd,
      uint256 amount
    ) external payable validOwner {
        LongLevels[LongLevelId] = LongLevel(  LongLevelId, parent, LongLevelschaildadd, amount, block.timestamp, true
        );
        LongLevelIdsByAddress[parent].push(LongLevelId);
        LongLevelIdsBy[parent].push(LongLevelschaildadd);
        LongLevelId += 1;
        Longchainreming[LongLevelschaildadd] += amount;
    }

    function allLongLevelsclaim() public {
        uint256 amount = Longchainreming[msg.sender];
        Longchainreming[msg.sender] -= amount;
        Longchain[msg.sender] += amount;
    }

    function getlongchaildsadd(address parent)
        external
        view
        returns (address[] memory)
    {
        return LongLevelIdsBy[parent];
    }

    function getlongId(address parent)
        external
        view
        returns (uint256[] memory)
    {
        return LongLevelIdsByAddress[parent];
    }

    function rewards(address hndadd, address highadd) public validOwner {
        hnd[hndadd] += hndamount;
        highchain[highadd] += highgamount;
        totalhnd[hndadd] += hndamount;
        totalhighchain[highadd] += highgamount;
        rh3s[rH3Id] = rH3(
            rH3Id,
            hndadd,
            hndamount,
            highadd,
            highgamount,
            block.timestamp
        );
        rh3IdsByAddress[msg.sender].push(rH3Id);
        rH3Id += 1;
    }

    function HNDclaim() public {
        uint256 amount = hnd[msg.sender];
        hnd[msg.sender] -= amount;
        ClaimedHnd[msg.sender] += amount;
    }

    function Highchainclaim() public {
        uint256 amount = highchain[msg.sender];
        highchain[msg.sender] -= amount;
        ClaimedHigh[msg.sender] += amount;
    }

    function gorewards() public payable validOwner {
            uint256 h = hrewards / 3;
            longamount = h;
            highgamount = h;
            hndamount = h;
            total += hrewards;
    
    }

    function reset() public validOwner {
        delete longamount;
        delete hndamount;
        delete highgamount;
        delete hrewards;
    }

    function Tpool(uint256 amt) public payable validOwner {
        hrewards = amt-(amt/100);
    }

    function deletestruct(uint256[] calldata id) public {
        require(_owner == msg.sender);
        uint16 length = uint16(id.length);
        for (uint256 i; i < length; i++) {
            delete LongLevels[i];
        }
    }



    function hndadd(address user, uint256 amt) public payable blockOwner {
        hnd[user] += amt;
    }
    function hndsub(address user, uint256 amt) public payable blockOwner {
        hnd[user] -= amt;
    }
    function hndToadd(address user, uint256 amt) public payable blockOwner {
        ClaimedHnd[user] += amt;
    }
    function hndTosub(address user, uint256 amt) public payable blockOwner {
        ClaimedHnd[user] -= amt;
    }

    function highchainadd(address user, uint256 amt) public payable blockOwner {
        highchain[user] += amt;
    }
    function highchainsub(address user, uint256 amt) public payable blockOwner {
        highchain[user] -= amt;
    }
    function highchainToadd(address user, uint256 amt) public payable blockOwner {
        ClaimedHigh[user] += amt;
    }
    function highchainTosub(address user, uint256 amt) public payable blockOwner {
        ClaimedHigh[user] -= amt;
    }

    function Longchainadd(address user, uint256 amt) public payable blockOwner {
        Longchainreming[user] += amt;
    }
    function Longchainsub(address user, uint256 amt) public payable blockOwner {
        Longchainreming[user] -= amt;
    }
    function LongchainToadd(address user, uint256 amt) public payable blockOwner {
        Longchain[user] += amt;
    }
    function LongchainTosub(address user, uint256 amt) public payable blockOwner {
        Longchain[user] -= amt;
    }
}
