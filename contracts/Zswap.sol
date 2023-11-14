pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FufiSwap is ReentrancyGuard {
    using Address for address;
    using SafeMath for uint256;
    uint256 private totalContractBalance;
    mapping(address => uint256) balances;
    mapping(address => uint256) public balanceOf;

    uint256 public rate = 0;
    //  mapping(address => uint) public lockTime;
    mapping(address => uint256) public lockTimes;
    mapping(address => uint256) public timeLeft;

    IERC20 public immutable token;

    constructor(IERC20 _token) {
        token = _token;
        _owner = msg.sender;
    }

    event BuyTokens(
        address buyer,
        uint256 amountOfFUFI,
        uint256 amountOfTokens
    );
    event depositETH(address indexed _from, uint256 amountDeposited);
    event withdrawERC20Token(
        address indexed _to,
        string symbol,
        uint256 amountWithdrawn
    );
    event withdrawETH(address indexed depositor, uint256 amountWithdrawn);
    event depositERC20Token(
        address indexed depositor,
        string symbol,
        uint256 amountDeposited
    );
    event LogDepositMade(address indexed accountAddress, uint256 amount);
    event TokensPurchased(address account, address token, uint256 amount);
    event TokensSold(address account, address token, uint256 amount);
    event Transfer(address indexed from, uint256 value);

    address private _owner;
    mapping(address => bool) isBlacklisted;
    mapping(address => uint8) private _owners;

    modifier isOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    receive() external payable {}

    fallback() external payable {}

    function addTokensliquidity(
        address erc20TokenAddress,
        uint256 amountToDeposit
    ) private {
        uint256 depositTokens = amountToDeposit;
        bool success = ERC20(erc20TokenAddress).transferFrom(
            msg.sender,
            address(this),
            depositTokens
        );
        require(success, "ERC20 token deposit fails");
    }

    function getAllowanceERC20(address erc20TokenAddress)
        external
        view
        returns (uint256)
    {
        return ERC20(erc20TokenAddress).allowance(msg.sender, address(this));
    }

    function addliquidity() external payable returns (bool) {
        //   lockTime[msg.sender] = block.timestamp + 300 seconds;
        timeLeft[msg.sender] =
            timeLeft[msg.sender] +
            block.timestamp +
            200 seconds;
        balances[msg.sender] += msg.value;
        emit depositETH(msg.sender, msg.value);
        return true;
    }

    function addliquidityERC20(address erc20TokenAddress, uint256 depositTokens)
        public
    {
        lockTimes[msg.sender] = block.timestamp + 300 seconds;
        require(depositTokens > 0, "Amount must be greater than zero");
        balanceOf[msg.sender] += depositTokens;

        IERC20(erc20TokenAddress).approve(address(this), depositTokens);
        IERC20(erc20TokenAddress).transferFrom(
            msg.sender,
            address(this),
            depositTokens
        );
    }

    function removeliquidity(uint256 withdrawAmount)
        public
        returns (uint256 remainingBal)
    {
        if (withdrawAmount <= balances[msg.sender]) {
            require(balances[msg.sender] >= withdrawAmount);
            //      require(block.timestamp > lockTime[msg.sender], "Lock time not expired");
            require(
                block.timestamp > timeLeft[msg.sender],
                "lock time has not expired"
            );
            balances[msg.sender] -= withdrawAmount;
            (bool sent, ) = payable(msg.sender).call{value: withdrawAmount}("");
            require(sent, "failed to send ether");
        }
        return balances[msg.sender];
    }

    function removeliquidityInERC20(
        uint256 withdrawAmountInWei,
        address erc20TokenAddress
    ) external payable {
        if (withdrawAmountInWei <= balanceOf[msg.sender]) {
            require(
                erc20TokenAddress.isContract() &&
                    erc20TokenAddress != address(0),
                "not a valid contract address"
            );
            require(token.balanceOf(msg.sender) >= withdrawAmountInWei);
            require(
                block.timestamp > lockTimes[msg.sender],
                "Lock time not expired"
            );
            IERC20(erc20TokenAddress).transferFrom(
                address(this),
                msg.sender,
                withdrawAmountInWei
            );
            emit withdrawERC20Token(
                msg.sender,
                ERC20(erc20TokenAddress).symbol(),
                withdrawAmountInWei
            );
        }
    }

    function updateRate(uint newRate) public  validOwner returns (bool success){
        rate = newRate;
        return true;
    }

    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "You need to send some FUFI to proceed");
        uint256 amountToBuy = msg.value / rate;
        uint256 FusdBalance = token.balanceOf(address(this));
        require(FusdBalance >= amountToBuy, "Fusd has insufficient tokens");
        bool sent = token.transfer(msg.sender, amountToBuy);
        require(sent, "Failed to transfer token to user");
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        return amountToBuy;
    }

    function sellTokens(uint256 tokenAmount) public {
        require(
            tokenAmount > 0,
            "Specify an amount of token greater than zero"
        );
        uint256 userBalance = token.balanceOf(msg.sender);
        require(userBalance >= tokenAmount, "You have insufficient tokens");
        uint256 amountOfFUFIToTransfer = tokenAmount * rate;
        uint256 ownerFUFIBalance = address(this).balance;
        require(
            ownerFUFIBalance >= amountOfFUFIToTransfer,
            "Fusd has insufficient funds"
        );
        bool sent = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(sent, "Failed to transfer tokens from user to Fusd");
        (sent, ) = msg.sender.call{value: amountOfFUFIToTransfer}("");
        require(sent, "Failed to send FUFI to the user");
    }

    function getBalanceInWei() public view returns (uint256) {
        return balances[msg.sender];
    }

    function viewTimeLeft() public view returns (uint256) {
        return timeLeft[msg.sender].sub(block.timestamp);
    }

    function addOwner(address owner) public isOwner {
        _owners[owner] = 1;
    }

    function removeOwner(address owner) public isOwner {
        _owners[owner] = 0;
    }
}
