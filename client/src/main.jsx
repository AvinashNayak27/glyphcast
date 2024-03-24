import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig } from "@privy-io/wagmi";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrivyProvider
      appId="clu57peqq021bvby6vwyd3pp6"
      config={{
        loginMethods: ["farcaster"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  </React.StrictMode>
);
