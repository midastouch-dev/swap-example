const TFCToken = artifacts.require("TFCToken");
const SwapContract = artifacts.require("SwapContract");

module.exports = async function (deployer) {
  await deployer.deploy(TFCToken, "Tyler Fyu Token", "TFC", "1000000000000000000000000");
  const token = await TFCToken.deployed();

  await deployer.deploy(SwapContract, token.address);
  const swap = await TFCToken.deployed();

  await token.transfer(swap.address, "1000000000000000000000000");
};
