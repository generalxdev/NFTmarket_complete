import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const metaMask = new InjectedConnector({
  supportedChainIds: [5001],
});

const walletConnect = new WalletConnectConnector({
  rpc: { 1: "https://rpc.testnet.mantle.xyz"},
  bridge: "https://bridge.walletconnect.org/",
  qrcode: true,
  pollingInterval: 15000,
  supportedChainIds: [5001],
});


 const walletlink = new WalletLinkConnector({
  url: "https://rpc.testnet.mantle.xyz",
  appName: 'Peekaboos Universe',
  supportedChainIds: [5001]
})
export { metaMask, walletConnect,walletlink };
