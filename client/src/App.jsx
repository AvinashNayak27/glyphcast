import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useWallets } from "@privy-io/react-auth";
export default function App() {
  const { ready, authenticated, login, user, logout, exportWallet } = usePrivy();

  const hasEmbeddedWallet = !!user?.linkedAccounts.find(
    (account) => account.type === "wallet" && account.walletClient === "privy"
  );

  const { wallets } = useWallets();
  const wallet = wallets[0]; 
  const switchChain = async () => {
    console.log("Switching chain to Base sepolia");
    await wallet.switchChain(84532);
    console.log("Successfully switched chain to Base sepolia");
    console.log("Current chain ID:", );
  };

  useEffect(() => {
    if (authenticated) {
      switchChain();
      console.log("User is authenticated:", user);
    }
  }, [authenticated, user]);

  return (
    <div className="App">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold mb-8">Welcome to Glyphcast</h1>
        <p className="text-lg mb-6">
          {authenticated
            ? "You're securely logged in."
            : "Please log in to continue."}
        </p>
        <button
          onClick={() => (authenticated ? logout() : login())}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ${authenticated
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {authenticated ? "Log Out" : "Log In"}
        </button>

        {ready && authenticated && user.farcaster && (
          <div className="mt-8 w-full max-w-xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Farcaster Info</h2>
            <div className="flex flex-col items-center">
              <img
                src={user.farcaster.pfp}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <p className="text-lg">
                <strong>FID:</strong> {user.farcaster.fid}
              </p>
              <p className="text-lg">
                <strong>Username:</strong> {user.farcaster.username}
              </p>
              <p className="text-lg">
                <strong>Display Name:</strong> {user.farcaster.displayName}
              </p>
              <p className="text-lg">
                <strong>Bio:</strong> {user.farcaster.bio}
              </p>
            </div>
          </div>
        )}
        {ready && authenticated && user.wallet && (
          <div className="mt-8 w-full max-w-xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Embeded Wallet Info</h2>
            <div className="flex flex-col items-center">
              <p className="text-lg">
                <strong>Address:</strong> {wallet.address}
              </p>
              <p className="text-lg">
                <strong>Current chain ID</strong> {wallet.chainId.split(":")[1]}
              </p>
              <button
                onClick={exportWallet}
                disabled={!authenticated || !hasEmbeddedWallet}
                className={`mt-4 px-6 py-3 rounded-lg font-semibold transition-colors duration-150 bg-green-500 hover:bg-green-600"
                }`}
              >
                Export my wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
