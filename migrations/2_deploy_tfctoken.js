const TFCToken = artifacts.require("TFCToken");

module.exports = function (deployer) {
  deployer.deploy(TFCToken, "Tyler Fyu Token", "TFC", 10000);
};
