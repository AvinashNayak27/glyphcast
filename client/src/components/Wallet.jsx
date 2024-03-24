import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, useBalance } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";

function Wallet() {
    const { ready, authenticated, user, exportWallet } = usePrivy();
    const { address } = useAccount();
    const { setActiveWallet } = useSetActiveWallet();
    const hasEmbeddedWallet = !!user?.linkedAccounts.find(
        (account) => account.type === "wallet" && account.walletClient === "privy"
      );
    
    const result = useBalance({
      address: address,
      chainId: 84532,
    });
  
    const { wallets } = useWallets();
    const wallet = wallets[0];
    const switchChain = async () => {
      console.log("Switching chain to Base sepolia");
      await wallet.switchChain(84532);
      console.log("Successfully switched chain to Base sepolia");
      console.log("Current chain ID:", wallet.chainId);
    };
  
    useEffect(() => {
      if ((authenticated, wallet)) {
        switchChain();
        console.log("User is authenticated:", user);
        setActiveWallet(wallet);
      }
    }, [authenticated, user]);

      const send = async () => {
    try {
      const provider = await wallet.getEthereumProvider();
      const transactionRequest = {
        to: "0xf7d4041e751E0b4f6eA72Eb82F2b200D278704A4",
        value: 1e15,
      };
      const transactionHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionRequest],
      });
      console.log("Transaction hash:", transactionHash);
    } catch (error) {
      console.error(error);
    }
  };

  const write = async () => {
    const provider = await wallet.getEthereumProvider();
    const data = encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "num",
              type: "uint256",
            },
          ],
          name: "store",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "retrieve",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "store",
      args: [42],
    });

    const transactionRequest = {
      to: "0xe8d82b9e3f2c165ddfe69f749eb1a2c9c9032b73",
      data: data,
    };
    const transactionHash = await provider.request({
      method: "eth_sendTransaction",
      params: [transactionRequest],
    });
    console.log("Transaction hash:", transactionHash);
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {ready && authenticated && user.wallet && (
      <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl mr-auto ml-auto mt-16">
        <h2 className="text-2xl font-semibold mb-6">Embedded Wallet Info</h2>
        <div className="flex flex-col items-center text-center">
          <p className="text-lg mb-2"><strong>Address:</strong> {address}</p>
          <p className="text-lg mb-2"><strong>Current chain ID:</strong> {wallet?.chainId.split(":")[1]}</p>
          <p className="text-lg mb-4"><strong>Balance:</strong> {(result?.data?.value.toString() / 1e18).toFixed(4)} ETH</p>
          <div className="flex space-x-4">
          <button
            onClick={send}
            disabled={!authenticated || !hasEmbeddedWallet}
            className="px-6 py-3 rounded-lg font-semibold transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400"
          >
            Send 0.001 ETH
          </button>
          <button
            onClick={write}
            disabled={!authenticated || !hasEmbeddedWallet}
            className="px-6 py-3 rounded-lg font-semibold transition duration-150 ease-in-out bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400"
          >
            Write to contract
          </button>
          <button
            onClick={exportWallet}
            disabled={!authenticated || !hasEmbeddedWallet}
            className="px-6 py-3 rounded-lg font-semibold transition duration-150 ease-in-out bg-green-500 hover:bg-green-600 disabled:bg-green-400"
          >
            Export my wallet
          </button>
          </div>
        </div>
      </div>
    )}
    {
        !authenticated && (
            <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
            <p className="text-lg text-center">Please log in to view your wallet.</p>
            </div>
        )
    }
      </div>
    </div>
  )
}

export default Wallet