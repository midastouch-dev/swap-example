import React, { useState } from 'react';
import Web3 from 'web3/dist/web3.min.js'
import logo from './logo.svg';
import './App.css';
import TFCToken from './abis/TFCToken.json';
import SwapContract from './abis/SwapContract.json';
import ArrowIcon from './assets/img/top-bottom-arrow.svg';

function App() {
  const [balanceEth, setBalanceEth] = React.useState('0');
  const [balanceTFC, setBalanceTFC] = React.useState('0');
  const [walletAddress, setWalletAddress] = React.useState('');
  const [globalWeb3, setGlobalWeb3] = useState(null);
  const [contractTFCToken, setContractTFCToken] = useState(null);
  const [contractSwapContract, setcontractSwapContract] = useState(null);
  const networkID = 97;
  const [swapValue, setSwapValue] = useState('');
  const [buy, setBuy] = useState(true);
  const [swapAddress, setSwapAddress] = useState('');

  React.useEffect(() => {
    connectNetwork();
  }, []);

  const connectNetwork = async () => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Make sure you have a MetaMask wallet!");
      return;
    }
    const provider = window.ethereum;

    const netId = await window.web3.eth.net.getId();
    if(networkID != netId) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1691' }], // chainId must be in hexadecimal numbers
        })
      } catch(switchError) {
        if (switchError.code === 4902) {
          console.log("This network is not available in your metamask, please add it")
         }
         window.alert("Failed to switch to the network")
         return;
      }
    }
    connectWallet();
  }

  const connectWallet = async () => {

    const networkId = await window.web3.eth.net.getId();
    const netsTFCToken = await TFCToken.networks[networkId];
    const netsSwapContract = await SwapContract.networks[networkId];

    const address = await window.web3.eth.getAccounts();
    if(netsTFCToken) {
      const contract = new window.web3.eth.Contract(TFCToken.abi, netsTFCToken.address);
      setContractTFCToken(contract);
      const balance = await contract.methods.balanceOf(address[0]).call();
      setBalanceTFC(balance);
    } else {
      window.alert("Token contract net deployed to detected network");
      return;
    }

    if(netsSwapContract) {
      const contract = new window.web3.eth.Contract(SwapContract.abi, netsSwapContract.address);
      setcontractSwapContract(contract);
      setSwapAddress(netsSwapContract.address)
    } else {
      window.alert("Token contract net deployed to detected network");
      return;
    }

    const balance = await window.web3.eth.getBalance(address[0]);
    setWalletAddress(address[0]);
    setBalanceEth(balance);
  }

  const handleClickSwap = async () => {
    buy? buyCoin() : sellCoin();
  }

  const buyCoin = async() => {
    const value = window.web3.utils.toWei(swapValue, 'ether');
    if(parseInt(value) > parseInt(balanceEth)) {
      window.alert("The coin's amount is incorrect. Make sure it's lower than the balance");
      return;
    }
    await contractSwapContract.methods.buyTokens().send({value: value, from: walletAddress});
    let balance = await contractTFCToken.methods.balanceOf(walletAddress).call();
    setBalanceTFC(balance);
    balance = await window.web3.eth.getBalance(walletAddress);
    setBalanceEth(balance);
  }

  const sellCoin = async() => {
    const value = window.web3.utils.toWei(swapValue, 'ether');
    if(parseInt(value) > parseInt(balanceTFC)) {
      window.alert("The coin's amount is incorrect. Make sure it's lower than the balance");
      return;
    }
    await contractTFCToken.methods.approve(swapAddress, value).send({from: walletAddress});
    await contractSwapContract.methods.sellTokens(value).send({from: walletAddress});

    let balance = await contractTFCToken.methods.balanceOf(walletAddress).call();
    setBalanceTFC(balance);
    balance = await window.web3.eth.getBalance(walletAddress);
    setBalanceEth(balance);
  }

  return (
    <div className="app">
      <button  onClick={() => connectWallet()}>{walletAddress ? "Disconnect":"Connect the Wallet"}</button>
      <div>{walletAddress && "Address: " + walletAddress}</div>
      <div className='swap-area'>
        <div>
          <div className='coin-area'>
            <div>{buy ? "Ethereum" : "TFC"}</div>
            <div className='balance-area'>Balance: {balanceEth != 0 ? window.web3.utils.fromWei(buy ? balanceEth : balanceTFC, "Ether") : "0"}</div>
          </div>
          <input className='input' placeholder="0" value={swapValue} onChange={(event) => setSwapValue(event.target.value)}/>
        </div>
        <div className='arrow-area'>
          <img className='arrow' src={ArrowIcon} onClick={() => setBuy(!buy)}/>
        </div>
        <div>
          <div className='coin-area'>
            <div>{buy ? "TFC" : "Ethereum"}</div>
            <div className='balance-area'>Balance: {balanceTFC != 0 ? window.web3.utils.fromWei(buy ? balanceTFC : balanceEth, "Ether") : "0"}</div>
          </div>
          <input className='input' placeholder="0" value={buy ? swapValue * 100 : swapValue / 100} disabled/>
        </div>
        <button className='swap-button' onClick={()=>handleClickSwap()}>Swap</button>
      </div>
    </div>
  );
}

export default App;
