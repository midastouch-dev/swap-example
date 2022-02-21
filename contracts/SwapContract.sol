// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./TFCToken.sol";

contract SwapContract {
  TFCToken token;
  uint rate = 100;

  event buyTokenEvent(
    address indexed sender,
    address indexed receiver,
    uint256 amount,
    uint rate
  );

  event sellTokenEvent(
    address indexed sender,
    address indexed receiver,
    uint256 amount,
    uint rate
  );

  constructor(TFCToken _token) {
    token = _token;
  }

  function buyTokens () public payable {
    uint256 tokenAmount = msg.value * rate;
    require(token.balanceOf(address(this)) >= tokenAmount);

    token.transfer(msg.sender, tokenAmount);
    emit buyTokenEvent(address(this), msg.sender, tokenAmount, rate);
  }

  function sellTokens (uint256 _amount) public {
    require(token.balanceOf(msg.sender) >= _amount);

    uint256 amount = _amount/rate;
    require(address(this).balance >= amount);
    
    token.transferFrom(msg.sender, address(this), _amount);
    payable(msg.sender).transfer(amount);

    emit buyTokenEvent(msg.sender, address(this), _amount, rate);
  }
}