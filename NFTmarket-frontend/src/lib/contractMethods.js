import "@ethersproject/shims";
import { getnftContractObj, getmarketContractObj } from "./contract";
import { BigNumber, ethers } from "ethers";
import Web3 from "web3";
import {
    nftaddress, nftmarketaddress
  } from 'config'

export async function fetchNFTs(provider) {
  const nftContract = getnftContractObj(provider);
  const marketContract = getmarketContractObj(provider);

  try {
    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await nftContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item;
    }))
    return items
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function buyNFT(nft, provider) {
  const nftContract = getnftContractObj(provider);
  try {
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const tx = await nftContract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function createToken(uri, provider){
    const nftContract = getnftContractObj(provider);
    try{
        const tx = await nftContract.createToken(uri);
        return tx;
    }catch(e){
        console.log(e)
        return false
    }
}
export async function listToken(tokenid, price, provider){
    const marketContract = getmarketContractObj(provider);
    try{
        const amount = ethers.utils.parseUnits(price, 'ether')
        const listingPrice = await marketContract.getListingPrice()
        const tx = await marketContract.createMarketItem(nftaddress,tokenid,amount,{value: listingPrice});
        return tx;
    }catch(e){
        console.log(e)
        return false
    }
}


