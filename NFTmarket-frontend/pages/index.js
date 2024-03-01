import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import dynamic from 'next/dynamic';
import { useWeb3React } from "@web3-react/core";
import { Modal } from "react-bootstrap";

import {
  fetchNFTs,
  buyNFT
} from "src/lib/contractMethods"

const ThreeViewer = dynamic(
  () => import('./ThreeViewer'),
  { ssr: false }
);

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [show, setShow] = useState({
    show: false,
    title: "",
    link: "",
    progress: false,
    dismiss: false,
    buttonText: "",
  });
  const handleClose = () => setShow(false);
  function showMintModal(state, title, link, progress, dismiss, buttonText) {
    setShow({
      show: state,
      title,
      link,
      progress,
      dismiss,
      buttonText,
    });
  }
  const { account, active, library, chainId } = useWeb3React();
  useEffect(() => {
    if(account && library){
      loadNFTs()
    }
  }, [account, library])
  async function loadNFTs() {
    try{
      const items = await fetchNFTs(library?.getSigner())
      setNfts(items)
      setLoadingState('loaded') 
    } catch(e){
      console.log(e)
    }    
  }
  async function buyNft(nft) {
    try{
      const tx = await buyNFT(nft, library?.getSigner())
      showMintModal(
        true,
        "Buy submitted",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        true,
        false,
        ""
      );
      await tx.wait(1);
      showMintModal(
        true,
        "Buy Success",
        `https://explorer.testnet.mantle.xyz/tx/${tx.hash}`,
        false,
        true,
        "Done"
      );
      loadNFTs()
    } catch(e){
      console.log(e)
      showMintModal(false, "", "", false, true, "Close");
    }
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <>
      <div className="mintmodalcontainer">
        <Modal show={show.show} onHide={handleClose} className="mymodal">
          <Modal.Body>
            <div className="mintmodal">
              <img
                src="/success.png"
                className="mintmodalimage"
                alt="Mintmodalimage"
              />

              <h2>{show.title}</h2>
              <h3>
                See the transaction on
                <a href={show.link} target="_blank" rel="noreferrer">
                  {" "}
                  Matle Explorer
                </a>
              </h3>
              {show.progress && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              )}
              <h3>{show.body}</h3>

              {show.dismiss && (
                <button className="btn herobtn" onClick={handleClose}>
                  {show.buttonText}
                </button>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    
      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: '1600px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  {/* <img src={nft.image} className="rounded" alt="nft-image" /> */}
                  <ThreeViewer src={nft.image} />
                  <div className="p-4">
                    <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                    <div style={{ height: '70px', overflow: 'hidden' }}>
                      <p className="text-gray-400">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl mb-4 font-bold text-white">{nft.price} Metis</p>
                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}
