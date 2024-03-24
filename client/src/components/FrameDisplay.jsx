import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const FrameDisplay = ({ frameurl }) => {
  const [frameData, setFrameData] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/get-meta-tags?url=${frameurl}`)
      .then((response) => {
        setFrameData(response.data);
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

  return (
    <div className="max-w-xl mx-auto my-8 p-4 border-2 border-black rounded-lg shadow-lg">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Frame"
          className={`w-full ${aspectRatio === "1.91:1" ? "h-56" : "h-64"
            } border border-black cursor-pointer`} // Added cursor-pointer class here
          onClick={() => window.open(frameurl, "_blank")}
        />

        <p className="absolute bottom-0 right-0 bg-black text-white text-xs p-1">
          {frameurl}
        </p>
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
