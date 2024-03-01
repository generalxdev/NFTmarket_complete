import { Contract } from "@ethersproject/contracts";
const nft_abi = require("artifacts/contracts/NFT.sol/NFT.json")
const market_abi = require("artifacts/contracts/market.sol/NFTMarket.json")
import {
    nftaddress, nftmarketaddress
  } from 'config'
import {ethers} from 'ethers';

export function truncateWalletString(walletAddress) {
  if (!walletAddress) return walletAddress;
  const lengthStr = walletAddress.length;
  const startStr = walletAddress.substring(0, 7);
  const endStr = walletAddress.substring(lengthStr - 7, lengthStr);
  return `${startStr}...${endStr}`;
}

export function truncateHashString(txhash) {
  if (!txhash) return txhash;
  const lengthStr = txhash.length;
  const startStr = txhash.substring(0, 10);
  const endStr = txhash.substring(lengthStr - 10, lengthStr);
  return `${startStr}...${endStr}`;
}

export function getnftContractObj(provider) {

  return new Contract(nftaddress, nft_abi,  provider);
}

export function getmarketContractObj(_provider) {
  
  return new Contract(nftmarketaddress, market_abi, _provider);
}

export const shorter = (str) =>
  str?.length > 8 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
