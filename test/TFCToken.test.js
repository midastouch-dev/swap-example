const TFCToken = artifacts.require("TFCToken");

contract("TFCToken Test", (accounts) => {
  let contract;
  let investor = "0xF3a8aEf1D28d4713df4505a3408e3e63264E26f8";
  let buyer = "0x5BbC0c6DAFa586c2769d685FC6901166051fcF59";
  const name = "Tyler Fyu Token";
  const symbol = "TFC";
  const supply = 10000;

  before(async () => {
    contract = await TFCToken.new(name, symbol, supply);
  })

  describe("deployment", () => {
    it('deploys successfully', async () => {
      const _address = contract.address;
      assert.notEqual(_address, 0x0);
    });

    it('get successfully the token name', async () => {
      const _name = await contract.name();
      assert.equal(name, _name);
    });

    it('get successfully the symbol', async () => {
      const _symbol = await contract.symbol();
      assert.equal(symbol, _symbol);
    });

    it('get successfully the total balance', async () => {
      const _balance = await contract.balanceOf(investor);
      assert.equal(_balance.toString(), supply.toString());
    });

    it('Transfer successfully', async () => {
      await contract.transfer(buyer, 3000);
      const _balanceOfInvestor = await contract.balanceOf(investor);
      const _balanceOfBuyer = await contract.balanceOf(buyer);
      assert.equal(_balanceOfInvestor.toString(), "7000");
      assert.equal(_balanceOfBuyer, "3000");
    });

    // it("Reward Successfullly", async () => {
    //   await contract.approve(investor, 1000);
    //   await contract.transferFrom(buyer, investor, 1000);
    //   const _balanceOfInvestor = await contract.balanceOf(investor);
    //   const _balanceOfBuyer = await contract.balanceOf(buyer);
    //   assert.equal(_balanceOfInvestor.toString(), "8000");
    //   assert.equal(_balanceOfBuyer, "2000");
    // })
  })
})