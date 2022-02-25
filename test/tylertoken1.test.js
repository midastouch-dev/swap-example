const CustomToken = artifacts.require('test/CustomToken');

contract("TylerToken1 Test", (account) => {
  let tylerToken1;
  const totalSupply = "10000";

  describe("Create Token", () => {
    it('deploys success', async () => {
      tylerToken1 = await CustomToken.new("Tyler Token1", "TT1", web3.utils.toWei(totalSupply, 'ether'))
      console.log(tylerToken1.address);

      const name = await tylerToken1.name();
      assert.equal(name, "Tyler Token1");
    })
  })
  
})

