import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import { StateContextProvider } from "./context";
import App from "./App";
import "./index.css";

// Custom Holesky chain configuration
// const holeskyChain = {
//   chainId: 17000, // Correct Holesky Chain ID
//   rpc: ["https://ethereum-holesky.publicnode.com"], // Holesky RPC URL
//   nativeCurrency: {
//     name: "Ether",
//     symbol: "ETH",
//     decimals: 18,
//   },
//   shortName: "holesky",
//   slug: "holesky",
//   name: "Ethereum Holesky Testnet",
// };

const sepoliaChain = {
  chainId: 11155111, // Correct Sepolia Chain ID
  rpc: ["https://ethereum-sepolia.publicnode.com"], // Sepolia RPC URL
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  shortName: "sepolia",
  slug: "sepolia",
  name: "Ethereum Sepolia Testnet",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThirdwebProvider
  clientId="38dd3a5c807472d5dad1ec81d156ac0b"
  supportedChains={[sepoliaChain]}
  activeChain={sepoliaChain.chainId}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
