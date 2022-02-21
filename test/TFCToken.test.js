const TFCToken = artifacts.require("TFCToken");
const SwapContract = artifacts.require("SwapContract");

contract("TFCToken Test", (accounts) => {
  let token;
  let swapContract;
  let investor = "0xF3a8aEf1D28d4713df4505a3408e3e63264E26f8";
  let buyer = "0x8949432405096EC73FE901CE9e1bf934E8AC168D";
  const name = "Tyler Fyu Token";
  const symbol = "TFC";
  const supply = 10000;

  before(async () => {
    token = await TFCToken.new(name, symbol, web3.utils.toWei(supply.toString(), 'ether'));
    swapContract = await SwapContract.new(token.address);
    token.transfer(swapContract.address, web3.utils.toWei(supply.toString(), 'ether'));
  })

  describe("deployment", () => {
    it('deploys successfully', async () => {
      const _address = token.address;
      assert.notEqual(_address, 0x0);
    });

    it('get successfully the token name', async () => {
      const _name = await token.name();
      assert.equal(name, _name);
    });

    it('get successfully the symbol', async () => {
      const _symbol = await token.symbol();
      assert.equal(symbol, _symbol);
    });

    it('get successfully the total balance', async () => {
      const _balance = await token.balanceOf(swapContract.address);
      assert.equal(web3.utils.fromWei(_balance.toString(), 'ether'), supply.toString());
    });
  })

  describe("Swap token", () => {
    let result;
    let buyEther = 2;
    let sellTFC = 100;

    it('Buy successfully the TFC token.', async() => {
      result = await swapContract.buyTokens({from: buyer, value: web3.utils.toWei(buyEther.toString(),'ether')});
      const _balanceOfInvestor = await token.balanceOf(swapContract.address);
      const _balanceOfBuyer = await token.balanceOf(buyer);
      assert.equal(web3.utils.fromWei(_balanceOfBuyer.toString(), 'ether'), "200");
      assert.equal(web3.utils.fromWei(_balanceOfInvestor.toString(), 'ether'), "9800");
    });

    
  })

  describe("Sell Token", () => {
    let sellTFC = 100;

    before(async () => {
      await token.approve(swapContract.address, web3.utils.toWei(sellTFC.toString(), 'ether'));
    });

    it('Sell successfully the TFC token.', async() => {
      result = await swapContract.sellTokens(web3.utils.toWei(sellTFC.toString(), 'ether'), {from: buyer})
      // const _balanceOfInvestor = await token.balanceOf(swapContract.address);
      // const _balanceOfBuyer = await token.balanceOf(buyer);
      // assert.equal(web3.utils.fromWei(_balanceOfBuyer.toString(), 'ether'), "100");
      // assert.equal(web3.utils.fromWei(_balanceOfInvestor.toString(), 'ether'), "9900");
    });
  });
})