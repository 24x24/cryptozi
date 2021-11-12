import './styles/App.css';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ZiNft from './utils/ZiNFT.json';

const TOTAL_MINT_COUNT = 50;

// I moved the contract address to the top for easy access.
const CONTRACT_ADDRESS = "0xeb261433379A89856B01AAc67FD23cF7b0F11083";

const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");

    console.log("#1.1 State currentAccount Load");

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    console.log("#1.2 Effect checkIfWalletIsConnected Load");
    
    const checkIfWalletIsConnected = async () => {

      console.log("#2 Run checkIfWalletIsConnected()");

      const { ethereum } = window;

      if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
      } else {
          console.log("#2.1 We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("#2.2 Found an authorized account:", account);
          setCurrentAccount(account)
          
          // Setup listener! This is for the case where a user comes to our site
          // and ALREADY had their wallet connected + authorized.
          console.log("#2.3  setupEventListener after checkIfWalletIsConnected");
          setupEventListener()
          
      } else {
          console.log("#2.4 No authorized account found")
      }
  }

  const connectWallet = async () => {

    console.log("#3 connectWallet");

    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("#3.1 Connected & Run setCurrentAccount()", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      console.log("#3.2 setupEventListener after Connected");
      setupEventListener() 
      

    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {

    console.log("#4 setupEventListener");
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ZiNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("#4.1  connectedContract.on")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {

    console.log("#5 askContractToMintNft");

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, ZiNft.abi, signer);

        console.log("#5.1 Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("#5.2 Mining...please wait.")
        await nftTxn.wait();
        console.log(nftTxn);
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }



  const renderNotConnectedContainer = () => (
    <div>
      {console.log("#1.4 connectWallet Button Load")}
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    </div>
  );

  const renderMintUI = () => (
    <div>
      {console.log("#1.5 askContractToMintNft Button Load")}
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint on Rinkeby Testnet
      </button>
    </div>
  )

  return (
    <div className="App">
    {console.log("#1.3 App HTML Load")}
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">CryptoZi</p>
          <p className="sub-text">
            Hi, Chinese characters, also called Zi, are the oldest continuously used system of writing in the world.
            <br /><br /> Each CryptoZi is manually created, unique and stored on IPFS permanently. 
          </p>
        </div>

        <div className="image-container">
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/QmZF3Ai7m3fvwCx6JVd6GdCBTfCwvJYuGFWT3EHzrFnkdr" width="64" height="64" />
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/QmXRZnVUWMMgpnQrzZvJ8Q6TwGRWzLgAUU4e3oBMsV9fKk" width="64" height="64" />
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/QmRQyeJ1fFAF1JDJoEm3kkH7e7h8PWHJkSMaQQxm84YPfX" width="64" height="64" />
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/QmUnYvRbkyYtPwFfDPQowGhywdYNoiAZRTKsKrWASkLgNe" width="64" height="64" />
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/Qmc7mKMgurMiM8CGjiHHvNMtGm1AtYvbUQqpXNLDbtX8wh" width="64" height="64" />
          <img alt="zi" className="" src="https://gateway.pinata.cloud/ipfs/QmTWpPyuKxu6hQKbsxn1fkX2thDSumAt6TQBgWugyMnN1c" width="64" height="64" />        
        </div>

        <div className="button-container">
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>

        <p className="p-text">
          If you want to get your lucky word, last name, or anything special minted as CryptoZi,  get in contact. 
        </p>

        <div className="footer-container">

          <a href="https://twitter.com/_24x24_">
          <img src="./twitter.svg" alt="Twitter" width="32" height="32" />
          </a>

          <a href="https://opensea.io/collection/cryptozi">
          <img src="./opensea.svg" alt="Opensea" width="32" height="32" />
          </a>
          
        </div>
      </div>
    </div>
  );
};

export default App;
