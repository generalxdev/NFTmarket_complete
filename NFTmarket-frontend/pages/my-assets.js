import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWeb3React } from "@web3-react/core";

import {
  fetchNFTs
} from "src/lib/contractMethods"

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
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
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Metis</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}