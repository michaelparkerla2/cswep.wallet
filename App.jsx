import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useDisconnect,
  WagmiConfig,
  createClient,
  chain,
  configureChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

const presaleAddress = "0x446bbDbEd2C6A499cd6A3BEbf8fed26d93809FBf"; // your presale contract

const { provider, webSocketProvider } = configureChains([chain.mainnet], [publicProvider()]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains: [chain.mainnet],
    }),
  ],
  provider,
  webSocketProvider,
});

export default function AppWrapper() {
  return (
    <WagmiConfig client={wagmiClient}>
      <App />
    </WagmiConfig>
  );
}

function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [txHash, setTxHash] = useState("");
  const [status, setStatus] = useState("");

  const handleBuy = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      setStatus("Sending...");
      const tx = await signer.sendTransaction({
        to: presaleAddress,
        value: ethers.parseEther("0.01"),
      });
      setTxHash(tx.hash);
      setStatus("Success!");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed or rejected");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#000", color: "#fff" }}>
      <h1>🔥 CSWEP Presale</h1>
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#8247e5", color: "#fff", border: "none", borderRadius: "8px" }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <button
            onClick={handleBuy}
            style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#00c896", color: "#fff", border: "none", borderRadius: "8px" }}
          >
            Buy with 0.01 ETH
          </button>
          <br />
          <button
            onClick={() => disconnect()}
            style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#aaa", border: "none", borderRadius: "6px" }}
          >
            Disconnect
          </button>
          {txHash && (
            <p style={{ marginTop: "1rem" }}>
              <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" style={{ color: "#44f" }}>
                View on Etherscan
              </a>
            </p>
          )}
          {status && <p>{status}</p>}
        </>
      )}
    </div>
  );
}
