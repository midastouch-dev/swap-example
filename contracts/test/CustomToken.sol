pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
  uint256 private decimal = 18;

  constructor (string memory _name, string memory _symbol, uint256 _totalSupply) public ERC20 (_name, _symbol) {
    _mint(msg.sender, _totalSupply);

  }

}