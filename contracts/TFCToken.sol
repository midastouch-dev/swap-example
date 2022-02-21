// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TFCToken is ERC20 {
  constructor(string memory _name, string memory _symbol, uint256 _amount) ERC20(_name, _symbol) {
    require(_amount > 0, "amount has to be greater than 0.");
    _mint(msg.sender, _amount);
  }
}