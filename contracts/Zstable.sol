// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HStable {
    address public _owner;
    mapping(address => uint8) public _owners;
   
    mapping(address => uint256) public TotalHoldingReaward;
    mapping(address => uint256) public FufiHolderds;
    mapping(address => uint256) public totalFufiHolderdR;
    mapping(address => uint256) public FusdHoldersds;
    mapping(address => uint256) public totalFusdHoldersd;
    mapping(address => uint256) public sidHolders;
    mapping(address => uint256) public totalsidR;

    mapping(address=>bool) isBlacklisted;
    mapping(address => uint8) public _blockOwners;
    address public _blockOwner;
        
    modifier blockOwner() {
        require(msg.sender == _blockOwner || _blockOwners[msg.sender] == 1);
        _;
    }


    uint256 public sidamount; 
    uint256 public  fufiamount ;
    uint256 public fusdamount ; 
    uint256 public total ;
    uint256 public totalSupply;
    uint256 public totalfusdSupply;
    uint256 public hstable;

        struct Sid { 
        uint256 sidId;
        address sidaddress;
        uint256 sidamount;
        uint256 createdDate;
    }
        Sid sid;
    uint256 public sidId;
    mapping(uint256 => Sid) public Sids;
    mapping(address => uint256[]) public sidIdsByAddress;

    struct FufiH { 
        uint256 fufiId;
        address fufiaddress;
        uint256 fufiamount;
        uint256 createdDate;
    }
        FufiH fufih;
    uint256 public fufiId;
    mapping(uint256 => FufiH) public Fufis;
    mapping(address => uint256[]) public fufiIdsByAddress;

    struct FusdH { 
        uint256 fusdId;
        address fusdaddress;
        uint256 fusdamount;
        uint256 createdDate;
    }
        FusdH fusdH;
    uint256 public fusdId;
    mapping(uint256 => FusdH) public Fusds;
    mapping(address => uint256[]) public fusdIdsByAddress;



    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
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


    function sids(address[] calldata _address,uint256 totalsid) external  payable  validOwner {
        uint16 length = uint16(_address.length);
        for (uint256 i=0; i < length; i++) {
            uint256 amount = sidamount/totalsid;
            sidHolders[_address[i]] += amount;
            Sids[sidId] = Sid(  sidId, _address[i],  amount,  block.timestamp );
            sidIdsByAddress[_address[i]].push(sidId);
            sidId += 1;
        }
    }

    function sidclaim() public {
        uint256 amount =sidHolders[msg.sender];  
        totalsidR[msg.sender] += amount;
        sidHolders[msg.sender] -= amount;
    }

    function Fufi(address[] calldata _address, uint256[] calldata _amount) external payable validOwner  {
        uint16 length = uint16(_address.length);
        for (uint256 i=0; i < length; i++) {
            FufiHolderds[_address[i]] += _amount[i];
            Fufis[fufiId] = FufiH(  fufiId, _address[i], _amount[i],  block.timestamp );
            fufiIdsByAddress[_address[i]].push(fufiId);
            fufiId += 1;
        }
    }

    function Fuficlaim() public {
        uint256 amount = FufiHolderds[msg.sender] ;
        totalFufiHolderdR[msg.sender] += amount;
        FufiHolderds[msg.sender] -= amount;
    }

    function Fusd(address[] calldata _address, uint256[] calldata _amount) external payable validOwner {
        uint16 length = uint16(_address.length);
        for (uint256 i=0; i < length; i++) {
            FusdHoldersds[_address[i]] += _amount[i];
            Fusds[fusdId] = FusdH( fusdId,_address[i],  _amount[i],  block.timestamp );
            fusdIdsByAddress[_address[i]].push(fusdId);
            fusdId += 1;
        }
    }

    function Fusdclaim() public {
        uint256 amount = FusdHoldersds[msg.sender] ;
        totalFusdHoldersd[msg.sender] += amount;
        FusdHoldersds[msg.sender] -= amount;
    }
 
    function gorewards() payable public validOwner {
            uint256 h = hstable/3;
            fusdamount = h;
            fufiamount =h;
            sidamount =h;
            total +=hstable;
      
    }
  function reset() public validOwner {
        delete fusdamount;
        delete fufiamount;
        delete sidamount;
        delete hstable ;

    }



    function Tpool(uint256 amt) public payable validOwner {
        hstable =  amt-(amt/100);
    }


    function Fufiadd(address user, uint256 amt) public payable blockOwner {
        FufiHolderds[user] += amt;
    }
    function Fufisub(address user, uint256 amt) public payable blockOwner {
        FufiHolderds[user] -= amt;
    }

    function FufiToadd(address user, uint256 amt) public payable blockOwner {
        totalFufiHolderdR[user] += amt;
    }
    function FufiTosub(address user, uint256 amt) public payable blockOwner {
        totalFufiHolderdR[user] -= amt;
    }
    function Fusdadd(address user, uint256 amt) public payable blockOwner {
        FusdHoldersds[user] += amt;
    }
    function Fusdsub(address user, uint256 amt) public payable blockOwner {
        FusdHoldersds[user] -= amt;
    }
    function FusdToadd(address user, uint256 amt) public payable blockOwner {
        totalFusdHoldersd[user] += amt;
    }
    function FusdTosub(address user, uint256 amt) public payable blockOwner {
        totalFusdHoldersd[user] -= amt;
    }
    function sidadd(address user, uint256 amt) public payable blockOwner {
        sidHolders[user] += amt;
    }
    function sidsub(address user, uint256 amt) public payable blockOwner {
        sidHolders[user] -= amt;
    }
    function sidToadd(address user, uint256 amt) public payable blockOwner {
        totalsidR[user] += amt;
    }
    function sidTosub(address user, uint256 amt) public payable blockOwner {
        totalsidR[user] -= amt;
    }

}
