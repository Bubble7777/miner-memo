import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { Contract, providers, ethers } from 'ethers';
import React, { useEffect, useState, useRef } from 'react';
import Web3Modal from 'web3modal';
import { NFT_CONTRACT_ADDRESS, abi } from '../../constants/index.js';
import { Button } from '@/components/ui/Button.js';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [nfts, setNfts] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 97) {
      window.alert('Change network to binance testnet');
      //TODO metmask переключился на 97
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }
    return web3Provider;
  };

  const mint = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      console.log(signer);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      //console.log(nftContract);
      const tx = await nftContract.mint({
        value: ethers.utils.parseEther('0.005'),
      });
      console.log(tx);

      await getNFTs();
    } catch (error) {
      console.error(error);
    }
  };

  const getNFTs = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const nftBalance = Number(await nftContract.balanceOf(address));
      console.log(nftBalance);
      if (nftBalance) {
        setNfts(nftBalance);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      return (
        <div>
          <div>You can mint NFT:</div>
          <button className={styles.button} onClick={mint}>
            mint
          </button>
        </div>
      );
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 97,
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getNFTs();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <div className={styles.logo}>BNBTEAM</div>

        <div>
          <button onClick={connectWallet} className={styles.button}>
            {!walletConnected ? 'Connect Wallet' : 'disconnect'}
          </button>
        </div>
      </nav>
      <main className={styles.main}>
        <div>
          <img src={'/preview.gif'} alt="gif" width={300} height={300} />
          <Button
            mint={mint}
            walletConnected={walletConnected}
            connectWallet={connectWallet}
          ></Button>
          <br />
          <p className={styles.number}>Your number of nfts: {nfts}</p>
        </div>
      </main>
    </div>
  );
}
