import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Player } from "@livepeer/react";
import { useWallets } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { useReadContract } from "wagmi";

const FrameDisplay = ({ frameurl }) => {
  const [frameData, setFrameData] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/get-meta-tags?url=${frameurl}`)
      .then((response) => {
        setFrameData(response.data);
        console.log('Frame data:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching frame data: ', error);
      });
  }, [frameurl]);

  const imageUrl = frameData["fc:frame:image"];
  const aspectRatio = frameData["fc:frame:image:aspect_ratio"];

  const handleButtonClick = (button) => {
    switch (button.action) {
      case "link":
        window.open(button.target, "_blank");
        break;
      case "mint":
        handleMint(button.target);
      default:
        console.warn("Action not implemented:", button.action);
    }
  };

  const buttons = [];
  for (let i = 1; i <= 4; i++) {
    const baseKey = `fc:frame:button:${i}`;
    const label = frameData[baseKey];
    const action = frameData[`${baseKey}:action`];
    const target = frameData[`${baseKey}:target`];

    if (label) {
      buttons.push({
        label,
        action,
        target,
      });
    }
  }

  if (frameData["fc:frame:video"]) {
    buttons.push({
      label: "View Product Page ↗️",
      action: "link",
      target: frameurl,
    });
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-4 border-2 border-black rounded-lg shadow-lg">
      <div className="relative">
        {!frameData["fc:frame:video"] ? (
          <img
            src={imageUrl}
            alt="Frame"
            className={`w-full ${aspectRatio === "1.91:1" ? "h-56" : "h-64"
              } border border-black cursor-pointer`}
            onClick={() => window.open(frameurl, "_blank")}
          />
        ) : (
          <>
            <Player
              autoPlay={true}
              controls
              width="100%"
              height="100%"
              src={frameData["fc:frame:video"]}
            />
            <p className="absolute bottom-0 right-0 bg-black text-white text-xs p-1">
              {frameurl}
            </p>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="flex w-full">
          {buttons.length > 0 ? (
            buttons.map((button, i) => (
              <button
                key={i}
                onClick={() => handleButtonClick(button)}
                className="bg-slate-500 text-white flex-grow py-2 rounded hover:bg-slate-700 transition-colors mx-1 text-center"
              >
                {button.label}
              </button>
            ))
          ) : (
            <p className="w-full text-center">No buttons defined</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameDisplay;
