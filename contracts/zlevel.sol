pragma solidity ^0.8.0;

contract Level{   


    struct Level { 
        uint256 levelId;
        address parent;
        address Levelschaildadd;
        string RLevel;
        uint256 levelamount;
        uint256 createdDate;
        bool open;
    }
        Level level;
    uint256 public levelId;
    mapping(uint256 => Level) public Levels;
    mapping(address => uint256[]) public levelIdsByAddress;
    mapping(address => address[]) public levelIdsBy;
    mapping(address => uint256) public affiliate; 
    mapping(address => uint256) public totalLevelsRewards;
    address public _owner;
    mapping(address => uint8) public _owners;

   modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    mapping(address=>bool) isBlacklisted;
    mapping(address => uint8) public _blockOwners;
    address public _blockOwner;
        
    modifier blockOwner() {
        require(msg.sender == _blockOwner || _blockOwners[msg.sender] == 1);
        _;
    }

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

    function levelreawrd(  address parent,  address Levelschaildadd,  string calldata RLevel,  uint256 amount ) external payable validOwner {
        uint256 value = amount / 100;
        Levels[levelId] = Level(  levelId,  parent,  Levelschaildadd,  RLevel,  value,  block.timestamp,  true );
        levelIdsByAddress[parent].push(levelId);
        levelIdsBy[parent].push(Levelschaildadd);
        levelId += 1;
        affiliate[parent] += value;

    }
        function Levelsclaim() public payable {
        uint256 amount = affiliate[msg.sender];
        totalLevelsRewards[msg.sender] += amount;
        affiliate[msg.sender] -= amount;

    }

        function getchaildId(address parent)   external   view   returns (uint256[] memory) {
        return levelIdsByAddress[parent];
    }

    function getchaildsadd(address parent) external view returns (address[] memory){
        return levelIdsBy[parent];
    }

       function deletestruct(uint256[] calldata id) public{
        require(_owner == msg.sender);
        uint16 length = uint16(id.length);
        for (uint256 i; i < length; i++) {
            delete Levels[i];
        }
    }

    function longadd(address user, uint256 amt) public payable validOwner {
        affiliate[user] += amt;
    }
    function longsub(address user, uint256 amt) public payable validOwner {
        affiliate[user] -= amt;
    }

    function longTosub(address user, uint256 amt) public payable validOwner {
        totalLevelsRewards[user] -= amt;
    }
    function longToadd(address user, uint256 amt) public payable validOwner {
        totalLevelsRewards[user] += amt;
    }

} 