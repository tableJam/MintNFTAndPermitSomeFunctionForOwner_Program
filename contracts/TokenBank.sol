// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank{
    // state params;
    string private name;
    string private symbol;
    uint256 constant totalSpply = 1000;
    uint256 private bankTotakDeposit;
    address public owner;
    mapping(address => uint256) private _balances;
    mapping(address => uint256) private _tokenBankBalances;
    /// @dev events
    event transferToken(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event tokenDeposit(
        address indexed from,
        uint256 amount
    );
    event tokenWithdraw(
        address indexed from,
        uint256 amount
    );

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        owner = msg.sender;
        _balances[owner] = totalSpply;
    }

    /// @dev return token name
    function getname() public view returns (string memory){
        return name;
    }
    /// @dev return token symbol
    function getsymbol() public view returns (string memory) {
        return symbol;
    }

    /// @dev return token total supply
    function gettotalsupply() public pure returns (uint256) {
        return totalSpply;
    } 

    /// @dev return address => token
       function balanceOf(address account) public view returns(uint256) {
        return _balances[account];
    }

}