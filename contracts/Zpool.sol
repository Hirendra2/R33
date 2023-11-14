// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    /**
     * @dev Returns the name of the token.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}

contract ERC20 is Context, IERC20, IERC20Metadata {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * The default value of {decimals} is 18. To select a different value for
     * {decimals} you should overload it.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address account)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balances[account];
    }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue)
        public
        virtual
        returns (bool)
    {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        virtual
        returns (bool)
    {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = _balances[from];
        require(
            fromBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += amount;
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "ERC20: insufficient allowance"
            );
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * -
     
      when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

contract HEntry {

    IERC20 _token;
    struct Rank {
        uint256 rankId;
        address walletAddress;
        uint256 createdDate;
        uint256 weiDeposit;
        uint256 direct;
        bool open;
    }
    Rank rank;
    uint256 public currentRankId;
    mapping(uint256 => Rank) public ranks;
    mapping(address => uint256[]) public rankIdsByAddress;
    address[] public getuser;
    mapping(address => uint256) public totaldirect;
    mapping(address => uint256) public directreward;
    mapping(address => uint256) public lockTime;
    mapping(address => uint256) public userentry;
    mapping(address => uint256) public hndrank;
    mapping(address => uint256) public DirectClaimd;
    mapping(address => uint256) public TotalEarn;
    mapping(address => uint256) public TotalEarnClaimd;
    mapping(address => uint256) public forsid;
    mapping(address => uint256) public sidburn;
    mapping(address => uint256) public Totalburn;

    using SafeMath for uint256;
    uint256 private totalContractBalance;
    mapping(address => uint256) balances;
    mapping (address => uint256) public  swapamt;
    uint256 public rate = 120000000000000000;
    address owner;
    mapping(address => uint) public lockTimes; 
    mapping(address => uint) public timeLeft;
    mapping(address => uint256) public FusdForSid;
    mapping(address => uint256) public R33allocated;
    uint256 public TotalR33allocated;
    uint256 public TotalLPallocated;

    mapping(address => uint256) public TradeKiy;
    mapping(address => uint256) public UsdtToFU;
    mapping(address => uint256) public TotalUsdtToFU;
    mapping(address => uint256) public Partamt;

    uint256 public totalentry;
    uint256 public PoolBalances;
    uint256 public GloblePoolBalances;
    uint256 public burnBalances;
    uint256 public FufiburnBalances;

    uint256 public HSBalances;
    uint256 public TotalEntryForGloblePool;
    uint256 public LevelBalances;
     uint256 public globlerate;
    mapping(address=>bool) isBlacklisted;
    uint256 public hnd1 = 1;
    uint256 public hnd2 = 1;
    uint256 public hnd3 = 1;
    uint256 public hnd4 = 1;
    uint256 public hnd5 = 1;

    address payable public hndadd1;
    address payable public hndadd2;
    address payable public hndadd3;
    address payable public hndadd4;
    address payable public hndadd5;

    using SafeMath for uint256;
    using SafeMath for uint16;
    address public _blockOwner;
    address public _owner;
    mapping(address => uint8) public _owners;
    mapping(address => uint8) public _blockOwners;
    event BuyTokens(address buyer, uint256 amountOfFUFI, uint256 amountOfTokens);
    uint256 public burnamount;
  
    event Burn(address indexed from, uint256 value);

    receive() external payable {}

    modifier checkAllowance(uint256 amount) {
        require(_token.allowance(msg.sender, address(this)) >= amount, "Error");
        _;
    }


    modifier validOwner() {
        require(msg.sender == _owner || _owners[msg.sender] == 1);
        _;
    }

    
    modifier blockOwner() {
        require(msg.sender == _blockOwner || _blockOwners[msg.sender] == 1);
        _;
    }

    mapping(address => uint256) public mtoday;
    address[] public oneday;

        uint256 public todayid;

    constructor(address token) payable {
        currentRankId = 0;
        _token = IERC20(token);
        _owner = msg.sender;
        _blockOwner = msg.sender;

    }

    function addOwner(address owners) public validOwner {
        require(_owner == msg.sender);
        _owners[owners] = 1;
    }

    function removeOwner(address owners) public validOwner {
        require(_owner == msg.sender);
        _owners[owners] = 0;
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

    function start( uint256 eamount, address Direct) external payable {
        uint256 R33allocatedamt = R33allocated[msg.sender];
        uint256 UsdtToFUamt = UsdtToFU[msg.sender];
        uint256 Total = R33allocatedamt+UsdtToFUamt;
        if (eamount<=Total) {
        uint256 P80 = (eamount*80)/100;
        uint256 P20 = (eamount*20)/100;
        uint256 Partamount = P80+P20;
        Partamt[msg.sender]+=Partamount;
        uint256 direct = eamount / 3;
        ranks[currentRankId] = Rank(  currentRankId, msg.sender,   block.timestamp,   2 *(Partamount),   direct,   true );
        rankIdsByAddress[msg.sender].push(currentRankId);
        getuser.push(msg.sender);
        totalentry += Partamount;
        TotalEntryForGloblePool +=(Partamount);
        userentry[msg.sender] += Partamount;
        currentRankId += 1;
        uint256 leftBalance = (Partamount / 100);
        burnamount+=leftBalance;
        uint256 leftBalances = (Partamount - Partamount / 100) / 3;
        PoolBalances += leftBalances;
        directreward[Direct] += leftBalances;
        totaldirect[Direct] += leftBalances;
        hndrank[Direct] += Partamount;
        R33allocated[msg.sender] -=P80;
        UsdtToFU[msg.sender] -=P20;
        delete FusdForSid[msg.sender];
        delete swapamt[msg.sender];
        delete TradeKiy[msg.sender];
        TotalLPallocated -=P20;
        TotalR33allocated -=P80;
        mtoday[msg.sender] += Partamount;
       if (mtoday[msg.sender] >= hnd1 ) {
            if(msg.sender ==hndadd1 ){
                    hnd1 += Partamount;
            }else {
                 hnd2 = hnd1;
                    hnd1 = Partamount;
                    hndadd2 =hndadd1;
                    hndadd1 = payable(msg.sender);
            }
                } else if (mtoday[msg.sender] > hnd2 && hnd1 > hnd2) {
                    if(msg.sender ==hndadd2 ){
                    hnd2 += Partamount;
                    }else{
                    hnd3 = hnd2;
                    hnd2 = Partamount;
                    hndadd3 =hndadd2;
                    hndadd2 = payable(msg.sender);
                    }
                } else if (mtoday[msg.sender]> hnd3 && hnd2 > hnd3) {
                    if(msg.sender ==hndadd3 ){
                        hnd3 += Partamount;
                    }
                    else{
                    hnd4 = hnd3;
                    hnd3 = Partamount;
                    hndadd4 =hndadd3;
                    hndadd3 =  payable(msg.sender);
                    }
                } else if (mtoday[msg.sender] > hnd4 && hnd3 > hnd4) {
                    if(msg.sender ==hndadd4 ){
                        hnd4 += Partamount;
                    }
                    else{
                    hnd5 = hnd4;
                    hnd4 = Partamount;
                    hndadd5 =hndadd4;
                    hndadd4 = payable(msg.sender);
                    }
                } else if (mtoday[msg.sender] > hnd5 && hnd4 > hnd5) {
                       if(msg.sender ==hndadd5 ){
                        hnd5 += Partamount;
                       }
                       else{
                    hnd5 = Partamount;
                    hndadd5 = payable(msg.sender);
                       }
                }
                else{
                    return;
                }
        }
    }

    function withDraw(uint256 rankId) external payable { require( 
        block.timestamp > lockTime[msg.sender], "Lock time not expired");
        require(ranks[rankId].open == true, "ranks is closed");
        require(  ranks[rankId].walletAddress == msg.sender,  "HHHHH" );
        require(  ranks[rankId].weiDeposit <= GloblePoolBalances,  "your globle pool not fullfil" );
        TotalEarn[msg.sender] +=ranks[rankId].weiDeposit;
        TotalEntryForGloblePool -=ranks[rankId].weiDeposit;
        ranks[rankId].open = false;
    }

    function Directclaim() public payable {
        uint256 amount = directreward[msg.sender];
        directreward[msg.sender] -= amount;
        DirectClaimd[msg.sender] += amount;
        TotalEarn[msg.sender] +=amount;
    }

    function TotalEarns(uint256 Seconds ) public payable {
        require(!isBlacklisted[msg.sender], "Recipient is backlisted");
        uint256 amounts = TotalEarn[msg.sender] ;
        uint256 amount = (amounts-(amounts/100));
        lockTime[msg.sender] = block.timestamp + Seconds;
        _token.approve(address(this), amount);
        require(_token.allowance(address(this), address(this)) >= amount);
        ranks[currentRankId] = Rank(  currentRankId, msg.sender, block.timestamp, 2*((amount/2)/3),0,true );
        rankIdsByAddress[msg.sender].push(currentRankId);
        totalentry += (amount/2)/3;
        userentry[msg.sender] += (amount/2)/3;    
        currentRankId += 1;
        GloblePoolBalances +=((amount/3)/3);
        uint256 leftBalance = (amount /2);
        uint256 swapamount =(leftBalance*1000000000000000000/rate);
        forsid[msg.sender] =swapamount;
        uint256 leftBalances = leftBalance/100;
        burnamount +=leftBalances;
        LevelBalances +=  2*((amount/2)/3);
        _token.transferFrom(address(this), msg.sender, (amount/2)/3);
        TotalEarnClaimd[msg.sender] += amounts;
        mtoday[msg.sender] += amount;
        TotalEarn[msg.sender] -=amounts;
    }

    function claim50() public {    
        uint256 withdrawAmount = forsid[msg.sender];
        (bool sent,) = payable(msg.sender).call{value: withdrawAmount}("");
        require(sent, "failed to send ether");
        Totalburn[msg.sender] += withdrawAmount;
        FufiburnBalances +=withdrawAmount;
        forsid[msg.sender] -= withdrawAmount;
    }

    function burnreset() public validOwner {
        delete burnBalances;
    }

    function Tpool() public payable validOwner {
        uint256 amount = PoolBalances/100;
        burnBalances +=amount;
        GloblePoolBalances +=(amount*33);
        HSBalances +=(amount*33);
        delete PoolBalances;
    }



    function onetime(address user, uint256 amount ) public payable validOwner {
            mtoday[user] = amount;

    }
    
    function updateRate(uint newRate) public  validOwner returns (bool success){
        rate = newRate;
        return true;
    }

    function updategloblerate(uint newRate) public  validOwner returns (bool success){
        globlerate = newRate;
        return true;
    }
    function getBalance() public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    function getTotalEntry() public view returns (uint256) {
        return totalentry;
    }

    function userBalance() public view returns (uint256) {
        return IERC20(_token).balanceOf(msg.sender);
    }

    function getRankIdsForAddress(address walletAddress) external view returns (uint256[] memory)  {
        return rankIdsByAddress[walletAddress];
    }

    function getalluser() external view returns (address[] memory) {
        
        return getuser;
    }

    function Time_call(uint256 time) public view returns (uint256) {
        return block.timestamp + time;
    }

    function allwith( uint amount) public validOwner {
        require(_owner == msg.sender);
        _token.approve(address(this), amount);
        require(_token.allowance(address(this), address(this)) >= amount);
        _token.transferFrom(address(this), msg.sender, amount);
    }

    function Fufi(uint256 amt) public validOwner {         
        (bool sent,) = payable(msg.sender).call{value: amt}("");
        require(sent, "failed to send ether");
    }

    function reset() public validOwner {
        delete hnd1;
        delete hnd2;
        delete hnd3;
        delete hnd4;
        delete hnd5;
        delete hndadd1;
        delete hndadd2;
        delete hndadd3;
        delete hndadd4;
        delete hndadd5;
        delete oneday;
        delete todayid;
        delete HSBalances;
    }

     function TradeKiyuser(address user ,uint256 amount) external payable validOwner {
        R33allocated[user] += amount;
        TradeKiy[user] += amount;
        TotalR33allocated +=amount;
    }

    function Fusdallocate(address[] calldata _address, uint256[] calldata _amount) external payable validOwner   {
        uint16 length = uint16(_address.length);
        for (uint256 i; i < length; i++) {
        FusdForSid[_address[i]] += _amount[i];
        R33allocated[_address[i]] += _amount[i];
        TotalR33allocated += _amount[i];

        }
    }

    function buyTokens() public payable returns (uint256 tokenAmount) {
        uint256 amountToBuy = (msg.value/1000000000000000000)*rate;
        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        R33allocated[msg.sender] += amountToBuy;
        swapamt[msg.sender] += amountToBuy;
        TotalR33allocated +=amountToBuy;
        return amountToBuy;
    }

    function LPAmt(address user ,uint256 amount) external payable validOwner {
        UsdtToFU[user] += amount;
        TotalUsdtToFU[user] += amount;
        TotalLPallocated +=amount;
    }

    function deletestruct(uint256[] calldata id) public{
        require(_owner == msg.sender);
        uint16 length = uint16(id.length);
        for (uint256 i; i < length; i++) {
            delete ranks[i];
        }
    }
   
    function clearStruct (address addr) public   { 
        require(_owner == msg.sender); 
        delete TradeKiy[addr];
    }

    
    function TotalEranupdate(address user, uint256 amount ) public payable blockOwner {
        TotalEarn[user] +=amount;
    }

    function TotalEransub(address user, uint256 amount ) public payable blockOwner {
        TotalEarn[user] -=amount;
    }
    function TotalEarnClaimdToadd(address user, uint256 amt) public payable blockOwner {
        TotalEarnClaimd[user] += amt;
    }
    function TotalEarnClaimdTosub(address user, uint256 amt) public payable blockOwner {
        TotalEarnClaimd[user] -= amt;
    }

    function UsdtToFUadd(address user, uint256 amount ) public payable blockOwner {
        UsdtToFU[user] +=amount;
    }

    function UsdtToFUsub(address user, uint256 amount ) public payable blockOwner {
        UsdtToFU[user] -=amount;
    }
    function TotalUsdtToFUadd(address user, uint256 amt) public payable blockOwner {
        TotalUsdtToFU[user] += amt;
    }
    function TotalUsdtToFUsub(address user, uint256 amt) public payable blockOwner {
        TotalUsdtToFU[user] -= amt;
    }


    function R33allocatedadd(address user, uint256 amount ) public payable blockOwner {
        R33allocated[user] +=amount;
    }

    function R33allocatedsub(address user, uint256 amount ) public payable blockOwner {
        R33allocated[user] -=amount;
    }

    function directrewardadd(address user, uint256 amount ) public payable blockOwner {
        directreward[user] -=amount;
    }

    function directrewardsub(address user, uint256 amount ) public payable blockOwner {
        directreward[user] -=amount;
    }

    function DirectClaimdadd(address user, uint256 amount ) public payable blockOwner {
        DirectClaimd[user] +=amount;
    }

    function DirectClaimdsub(address user, uint256 amount ) public payable blockOwner {
        DirectClaimd[user] -=amount;
    }

    function TotalR33allocatedsub(uint256 amount ) public payable blockOwner {
        TotalR33allocated -=amount;
    }

    function TotalR33allocatedadd(uint256 amount ) public payable blockOwner {
        TotalR33allocated +=amount;
    }


 
    function owenstart(address user , uint256 Partamount, address Direct) external payable blockOwner {
        uint256 direct = (Partamount-(Partamount / 100))/3;
        ranks[currentRankId] = Rank(  currentRankId, user,   block.timestamp,   2 *(Partamount),   direct,   true );
        rankIdsByAddress[user].push(currentRankId);
        getuser.push(user);
        totalentry += Partamount;
        TotalEntryForGloblePool +=(Partamount);
        userentry[user] += Partamount;
        currentRankId += 1;
        uint256 leftBalance = (Partamount / 100);
        burnamount+=leftBalance;
        uint256 leftBalances = (Partamount -( Partamount / 100)) / 3;
        PoolBalances += leftBalances;
        directreward[Direct] += leftBalances;
        totaldirect[Direct] += leftBalances;
        hndrank[Direct] += Partamount;
        mtoday[user] += Partamount;
       if (mtoday[user] >= hnd1 ) {
            if(msg.sender ==hndadd1 ){
                    hnd1 += Partamount;
            }else {
                 hnd2 = hnd1;
                    hnd1 = Partamount;
                    hndadd2 =hndadd1;
                    hndadd1 = payable(user);
            }
                } else if (mtoday[user] > hnd2 && hnd1 > hnd2) {
                    if(user ==hndadd2 ){
                    hnd2 += Partamount;
                    }else{
                    hnd3 = hnd2;
                    hnd2 = Partamount;
                    hndadd3 =hndadd2;
                    hndadd2 = payable(user);
                    }
                } else if (mtoday[user]> hnd3 && hnd2 > hnd3) {
                    if(user ==hndadd3 ){
                        hnd3 += Partamount;
                    }
                    else{
                    hnd4 = hnd3;
                    hnd3 = Partamount;
                    hndadd4 =hndadd3;
                    hndadd3 =  payable(user);
                    }
                } else if (mtoday[user] > hnd4 && hnd3 > hnd4) {
                    if(user ==hndadd4 ){
                        hnd4 += Partamount;
                    }
                    else{
                    hnd5 = hnd4;
                    hnd4 = Partamount;
                    hndadd5 =hndadd4;
                    hndadd4 = payable(user);
                    }
                } else if (mtoday[user] > hnd5 && hnd4 > hnd5) {
                       if(user ==hndadd5 ){
                        hnd5 += Partamount;
                       }
                       else{
                    hnd5 = Partamount;
                    hndadd5 = payable(user);
                       }
                }
                else{
                    return;
                }
        }
    
    }


