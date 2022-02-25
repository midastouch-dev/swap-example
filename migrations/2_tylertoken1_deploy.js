const CustomToken = artifacts.require("test/CustomToken");

module.exports = async function (deployer) {
  await deployer.deploy(CustomToken, "Tyler Token1", "TT1", web3.utils.toWei("10000", "ether"));
  const tylerToken1 = await CustomToken.deployed();
};
