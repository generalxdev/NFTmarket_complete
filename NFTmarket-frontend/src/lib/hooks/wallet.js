import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as WUserRejectedRequestError,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";

import { toast } from "react-hot-toast";
import { metaMask, walletConnect, walletlink } from "./connector";
import { CACHE_PROVIDER } from "./constants";

const resetWalletConnector = (connector) => {
  if (connector && connector instanceof WalletConnectConnector) {
    console.log("resetting");
    connector.walletConnectProvider = undefined;
  }
};

const handleSwitchNetwork = async () => {
  try {
    var NetworkDetails = [
      {
        chainId: "0x1389",
        chainName: "Mantle testnet",
        rpcUrls: ["https://rpc.testnet.mantle.xyz"],
        blockExplorerUrls: ["https://explorer.testnet.mantle.xyz/"],
        nativeCurrency: {
          symbol: "BIT", // 2-6 characters long
          decimals: 18,
        },
      },
      {
        chainId: "0x1388",
        chainName: "Mantle mainnet",
        rpcUrls: ["https://rpc.mantle.xyz"],
        blockExplorerUrls: ["https://explorer.mantle.xyz"],
        nativeCurrency: {
          symbol: "BIT", // 2-6 characters long
          decimals: 18,
        },
      },
    ];
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: NetworkDetails[0].chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      console.log(
        "This network is not available in your metamask, please add it"
      );
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NetworkDetails[0]],
        });
      } catch (addError) {
        // handle "add" error
        console.log(addError);
      }
    }
  }
};

const handleError = async (error) => {
  resetWalletConnector(walletConnect);
  if (error instanceof NoEthereumProviderError) {
    toast.error(
      "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
    );
  } else if (error instanceof UnsupportedChainIdError) {
    toast(
      (t) => (
        <div
          style={{
            width: "800px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "14px", margin: "0px" }}>
            {" "}
            Please Switch Your Network
          </p>
          <button
            style={{
              fontSize: "14px",
              padding: "4px 26px",
              borderRadius: "8px",
              background: "#fed5ac",
            }}
            className="switchbtn"
            onClick={(e) => {
              e.preventDefault();
              handleSwitchNetwork();
            }}
          >
            Switch
          </button>
        </div>
      ),
      {
        icon: "👏",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }
    );
  } else if (
    error instanceof UserRejectedRequestError ||
    error instanceof WUserRejectedRequestError
  ) {
    toast.error(
      "Please authorize this website to access your Ethereum account."
    );
  } else if (error.message.includes("Already processing eth_requestAccount")) {
    toast.error(
      "Already processing eth_requestAccounts. Please check your wallet."
    );
  } else {
    toast.error(
      "An unknown error occurred. Check the console for more details."
    );
  }
};

export const useWallet = () => {
  const { activate, connector, ...props } = useWeb3React();
  const data = useWeb3React();

  const connectWallet = async (wallet1) => {
    try {
      if (wallet1 == 0) {
        const { ethereum } = window;
        if (!ethereum) {
          return toast.error(
            "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile."
          );
        }

        await activate(metaMask, (error) => handleError(error));
        localStorage.setItem(CACHE_PROVIDER, "true");
      } else if (wallet1 == 1) {
        await activate(walletConnect, (error) => handleError(error));
      } else if (wallet1 == 2) {
        await activate(walletlink, (error) => handleError(error));
      }
    } catch (err) {
      console.log("Connect wallet", err);
    }
  };

  const disconnectWallet = async () => {
    props.deactivate();
    localStorage.removeItem(CACHE_PROVIDER);
  };

  return {
    ...props,
    connector,
    connectWallet,
    disconnectWallet,
  };
};
