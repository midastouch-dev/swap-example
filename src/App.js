import React, { useState } from 'react';
import Web3 from 'web3/dist/web3.min.js'
import logo from './logo.svg';
import './App.css';
import TFCToken from './abis/TFCToken.json';

function App() {
  const [balanceEth, setBalanceEth] = React.useState('0');
  const [balanceTFC, setBalanceTFC] = React.useState('0');
  const [walletAddress, setWalletAddress] = React.useState('');
  const [globalWeb3, setGlobalWeb3] = useState(null);
  const [contractTFCToken, setContractTFCToken] = useState(null);
  const networkID = 5777;

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

    const balance = await window.web3.eth.getBalance(address[0]);
    setWalletAddress(address[0]);
    setBalanceEth(balance);
  }

  return (
    <div className="app">
      <button  onClick={() => connectWallet()}>{walletAddress ? "Disconnect":"Connect the Wallet"}</button>
      <div>{walletAddress && "Address: " + walletAddress}</div>
      <div className='swap-area'>
        <div>
          <div className='coin-area'>
            <div>Ethereum</div>
            <div className='balance-area'>Balance: {balanceEth != 0 ? window.web3.utils.fromWei(balanceEth, "Ether") : "0"}</div>
          </div>
          <input className='input' placeholder="0" />
        </div>
        <div>
          <div className='coin-area'>
            <div>TFC</div>
            <div className='balance-area'>Balance: {balanceTFC}</div>
          </div>
          <input className='input' placeholder="0" disabled/>
        </div>
        <button className='swap-button'>Swap</button>
      </div>
    </div>
  );
}

export default App;
