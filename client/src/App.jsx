import { usePrivy, useExperimentalFarcasterSigner } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, useBalance } from "wagmi";
import { encodeFunctionData } from "viem";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import FrameDisplay from "./components/FrameDIsplay";

export default function App() {
  const { ready, authenticated, login, user, logout, exportWallet } =
    usePrivy();

  const { submitCast } =
    useExperimentalFarcasterSigner();

  // const send = async () => {
  //   try {
  //     const provider = await wallet.getEthereumProvider();
  //     const transactionRequest = {
  //       to: "0xf7d4041e751E0b4f6eA72Eb82F2b200D278704A4",
  //       value: 1e15,
  //     };
  //     const transactionHash = await provider.request({
  //       method: "eth_sendTransaction",
  //       params: [transactionRequest],
  //     });
  //     console.log("Transaction hash:", transactionHash);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const write = async () => {
  //   const provider = await wallet.getEthereumProvider();
  //   const data = encodeFunctionData({
  //     abi: [
  //       {
  //         inputs: [
  //           {
  //             internalType: "uint256",
  //             name: "num",
  //             type: "uint256",
  //           },
  //         ],
  //         name: "store",
  //         outputs: [],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //       {
  //         inputs: [],
  //         name: "retrieve",
  //         outputs: [
  //           {
  //             internalType: "uint256",
  //             name: "",
  //             type: "uint256",
  //           },
  //         ],
  //         stateMutability: "view",
  //         type: "function",
  //       },
  //     ],
  //     functionName: "store",
  //     args: [42],
  //   });

  //   const transactionRequest = {
  //     to: "0xe8d82b9e3f2c165ddfe69f749eb1a2c9c9032b73",
  //     data: data,
  //   };
  //   const transactionHash = await provider.request({
  //     method: "eth_sendTransaction",
  //     params: [transactionRequest],
  //   });
  //   console.log("Transaction hash:", transactionHash);
  // };

  const [castText, setCastText] = useState("");

  const sumbit = async () => {
    try {
      const { hash } = await submitCast({ text: castText });
      alert("Cast submitted successfully");
      console.log("Cast hash:", hash);
      window.location.reload();
    } catch (error) {
      alert("Error submitting cast see console for more details");
      console.error(error);
    }
  };

  const [messages, setMessages] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://hub.pinata.cloud/v1/castsByFid?fid=${user?.farcaster?.fid}`
      );
      const newMessages = response.data.messages;

      newMessages.forEach((msg) => {
        if (msg.data.type === "MESSAGE_TYPE_CAST_ADD") {
          setMessages((prevMessages) => {
            const hashExists = prevMessages.some(
              (prevMsg) => prevMsg.hash === msg.hash
            );
            if (!hashExists) {
              return [
                ...prevMessages,
                { text: msg.data.castAddBody.text, hash: msg.hash },
              ];
            }
            return prevMessages;
          });
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.farcaster?.fid]);

  function isValidURL(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }
    return true;
  }

  return (
    <div className="App flex flex-col min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <Navbar />

      <Sidebar />
      {authenticated && (
        <div className="content flex-1 p-7 ml-64">
          <div className="casts flex flex-col items-center space-y-8">
            <div className="interaction w-full max-w-2xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create a Cast</h2>
              <textarea
                className="w-full p-4 text-black rounded-lg focus:outline-none"
                rows="3"
                placeholder="What's happening?"
                value={castText}
                onChange={(e) => setCastText(e.target.value)}
              ></textarea>
              <button
                onClick={sumbit}
                className="mt-4 px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 transition duration-150"
              >
                Cast
              </button>
            </div>
            {[...messages].reverse().map((message, index) => (
              <div
                key={index}
                className="feed w-full max-w-2xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg"
              >
                {isValidURL(message.text) ? (
                  <FrameDisplay frameurl={message.text} />
                ) : (
                  <p className="text-lg">{message.text}</p>
                )}
              </div>
            ))}

          </div>
        </div>
      )}
      {
        !authenticated && (
          <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
            <p className="text-lg text-center">Please log in to view </p>
          </div>
        )
      }
    </div>
  );
}
