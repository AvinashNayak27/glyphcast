import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useExperimentalFarcasterSigner, usePrivy } from "@privy-io/react-auth";

function Settigs() {
  const { user, ready, authenticated } = usePrivy();
  const { requestFarcasterSigner } = useExperimentalFarcasterSigner();

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster"
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {ready && authenticated && user.wallet && (

          <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Settings</h2>
              <button
                onClick={() => requestFarcasterSigner()}
                disabled={!farcasterAccount || farcasterAccount.signerPublicKey}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300 ${!farcasterAccount || farcasterAccount.signerPublicKey ? 'cursor-default' : ''}`}
              >
                Request Farcaster Signer
              </button>
            </div>
            {
              farcasterAccount.signerPublicKey && (
                <div className="mt-6">
                  Already set a farcaster signer 
                </div>
              )
            }
          </div>
        )}
        {
          !authenticated && (
            <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
              <p className="text-lg text-center">Please log in to view your settings.</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Settigs;
