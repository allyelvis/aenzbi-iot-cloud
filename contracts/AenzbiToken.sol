// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Aenzbi Token with basic DApp payment features
/// @author Aenzbi
/// @notice ERC20-compatible token with DApp integration features

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract AenzbiToken is IERC20 {
    string public name = "Aenzbi Token";
    string public symbol = "AZT";
    uint8 public decimals = 18;
    uint256 private _totalSupply;
    address public owner;
    uint256 public tokenPrice = 1 ether;

    mapping(address => uint256) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event TokenPurchased(address indexed buyer, uint256 amount);
    event PaymentReceived(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        _mint(owner, initialSupply * (10 ** uint256(decimals)));
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(_balances[msg.sender] >= amount, "Not enough tokens");
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        uint256 tokensToBuy = (msg.value * (10 ** uint256(decimals))) / tokenPrice;
        require(_balances[owner] >= tokensToBuy, "Not enough tokens in reserve");
        _balances[owner] -= tokensToBuy;
        _balances[msg.sender] += tokensToBuy;
        emit TokenPurchased(msg.sender, tokensToBuy);
    }

    function payWithTokens(uint256 amount) public {
        require(_balances[msg.sender] >= amount, "Insufficient token balance");
        _balances[msg.sender] -= amount;
        _balances[owner] += amount;
        emit Transfer(msg.sender, owner, amount);
        emit PaymentReceived(msg.sender, amount);
    }

    function setTokenPrice(uint256 newPriceWei) public onlyOwner {
        tokenPrice = newPriceWei;
    }

    function withdrawETH() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Zero address not allowed");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    receive() external payable {
        buyTokens();
    }
} 