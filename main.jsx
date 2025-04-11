import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet } from "wagmi/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc"; // ✅ THIS IS THE FIX

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://ethereum.publicnode.com",
      }),
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
