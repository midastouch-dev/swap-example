const TFCToken = artifacts.require("TFCToken");
const SwapContract = artifacts.require("SwapContract");

module.exports = async function (deployer) {
  await deployer.deploy(TFCToken, "Tyler Fyu Token", "TFC", web3.utils.toWei('10000', 'ether'));
  const token = await TFCToken.deployed();

  await deployer.deploy(SwapContract, token.address);
  const swap = await SwapContract.deployed();

  await token.transfer(swap.address, web3.utils.toWei('10000', 'ether'));
};
