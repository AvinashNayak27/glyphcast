import React from "react";
import Navbar from "./Navbar"; // Assuming you have a Navbar component
import Sidebar from "./Sidebar"; // Your Sidebar component
import { usePrivy } from "@privy-io/react-auth"; // Import usePrivy from react-auth

function Profile() {
  const { ready, authenticated, user } = usePrivy();
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        {ready && authenticated && user.farcaster && (
          <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-10">
            <h2 className="text-2xl font-semibold mb-6">Farcaster Info</h2>
            <div className="flex flex-col items-center text-center">
              <img
                src={user.farcaster.pfp}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500"
              />
              <p className="text-lg mb-2">
                <strong>FID:</strong> {user.farcaster.fid}
              </p>
              <p className="text-lg mb-2">
                <strong>Username:</strong> {user.farcaster.username}
              </p>
              <p className="text-lg mb-2">
                <strong>Display Name:</strong> {user.farcaster.displayName}
              </p>
              <p className="text-lg">
                <strong>Bio:</strong> {user.farcaster.bio}
              </p>
            </div>
          </div>
        )}
        {ready && !authenticated && (
          <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
            <p className="text-lg text-center">
              Please log in to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
