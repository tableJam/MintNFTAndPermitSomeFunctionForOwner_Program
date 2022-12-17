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
        _balances[owner] = bankTotakDeposit;
    }

}