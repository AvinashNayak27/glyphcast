import { usePrivy, useExperimentalFarcasterSigner } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, useBalance } from "wagmi";
import { encodeFunctionData } from "viem";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import FrameDisplay from "./components/FrameDisplay";
import { Player, createAsset } from "@livepeer/react";

export default function App() {
  const { ready, authenticated, login, user, logout, exportWallet } =
    usePrivy();

  const { submitCast } = useExperimentalFarcasterSigner();

  const [castText, setCastText] = useState("");

  const submit = async () => {
    try {
      if (castText.trim() === "") {
        alert("Please enter a cast");
        return;
      }

      let submissionData = {};

      if (isValidURL(castText)) {
        submissionData = { embeds: [{ url: castText }] };
      } else {
        submissionData = { text: castText };
      }

      const { hash } = await submitCast(submissionData);
      alert("Cast submitted successfully");
      console.log("Cast hash:", hash);
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  const [messages, setMessages] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://hub.pinata.cloud/v1/castsByFid?fid=${user?.farcaster?.fid}`
      );
      const newMessages = response.data.messages;
      console.log("New messages:", newMessages);

      newMessages.forEach((msg) => {
        if (msg.data.type === "MESSAGE_TYPE_CAST_ADD") {
          setMessages((prevMessages) => {
            if (
              msg.data.castAddBody &&
              msg.data.castAddBody.text &&
              msg.data.castAddBody.embeds &&
              msg.data.castAddBody.embeds.length > 0
            )
              return prevMessages;
            const hashExists = prevMessages.some(
              (prevMsg) => prevMsg.hash === msg.hash
            );
            if (!hashExists) {
              return [
                ...prevMessages,
                {
                  text:
                    msg.data.castAddBody.text ||
                    msg.data.castAddBody.embeds[0].url,
                  hash: msg.hash,
                },
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

  function endsWihM3u8(string) {
    return string.endsWith(".m3u8");
  }

  const [uploading, setUploading] = useState(false); // State to track uploading status

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true); // Start uploading
      createAsset({
        sources: [
          {
            name: file.name,
            file: file,
          },
        ],
      })
        .then((createdAsset) => {
          console.log("Asset created:", createdAsset[0]);
          setCastText(createdAsset[0].playbackUrl);
        })
        .catch((error) => {
          console.error("Error creating asset:", error);
        })
        .finally(() => {
          setUploading(false); // Stop uploading
        });
    } else {
      console.error("No file selected for upload.");
    }
  };

  return (
    <div className="App flex flex-col min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <Navbar />

      <Sidebar />
      {authenticated && (
        <div className="content flex-1 p-7 ml-64">
          <div className="casts flex flex-col items-center space-y-8">
            <div className="interaction w-full max-w-2xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create a Cast</h2>
              <div style={{ position: "relative" }}>
                <textarea
                  className="w-full p-4 text-black rounded-lg focus:outline-none"
                  rows="3"
                  placeholder="What's happening?"
                  value={castText}
                  onChange={(e) => setCastText(e.target.value)}
                ></textarea>
                <label
                  htmlFor="video-upload"
                  className="absolute right-4 bottom-4 cursor-pointer bg-blue-500 hover:bg-blue-600 transition duration-150 rounded-full w-10 h-10 flex items-center justify-center text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleUpload}
                  className="hidden"
                  id="video-upload"
                />
              </div>
              {uploading && <p className="text-lg mt-4">Uploading...</p>}

              <div className="flex items-center mt-4">
                <button
                  onClick={submit}
                  className="px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 transition duration-150"
                >
                  Cast
                </button>
              </div>
            </div>
            {[...messages].reverse().map((message, index) => (
              <div
                key={index}
                className="feed w-full max-w-2xl bg-slate-700/90 backdrop-blur-lg rounded-lg p-6 shadow-lg"
              >
                {isValidURL(message.text) ? (
                  endsWihM3u8(message.text) ? (
                    <Player
                      autoPlay
                      muted
                      controls
                      src={message.text}
                      width="100%"
                      height="auto"
                    />
                  ) : (
                    <FrameDisplay frameurl={message.text} />
                  )
                ) : (
                  <p className="text-lg">{message.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {!authenticated && (
        <div className="w-full max-w-xl bg-slate-700/90 backdrop-blur-md rounded-lg p-6 shadow-xl ml-auto mr-auto mt-16">
          <p className="text-lg text-center">Please log in to view </p>
        </div>
      )}
    </div>
  );
}
