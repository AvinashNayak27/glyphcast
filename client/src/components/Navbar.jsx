import React from 'react'
import { usePrivy } from "@privy-io/react-auth";

function Navbar() {
    const { ready, authenticated, login, user, logout, exportWallet } =
    usePrivy();
    return (
        <div className="navbar w-full flex justify-between items-center px-6 py-4 bg-slate-700 shadow-md">
            <h1 className="text-3xl font-bold ml-60">
                Glyphcast <span className="text-blue-300">Farcaster Client for videos</span>
                <span className="text-blue-500">{user?.farcaster?.displayName}</span>
            </h1>

            <div>
                {authenticated ? (
                    <button
                        onClick={logout}
                        className="px-6 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 transition duration-150"
                    >
                        Log Out
                    </button>
                ) : (
                    <button
                        onClick={login}
                        className="px-6 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 transition duration-150"
                    >
                        Log In
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar