import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import { useState } from "react";

const PRESALE_ADDRESS = "0x446bbDbEd2C6A499cd6A3BEbf8fed26d93809FBf";

export default function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: injected() });
  const { disconnect } = useDisconnect();
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState("");

  const buyWithETH = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    try {
      setStatus("Sending...");
      const tx = await signer.sendTransaction({
        to: PRESALE_ADDRESS,
        value: ethers.parseEther("0.01"),
      });
      setTxHash(tx.hash);
      setStatus("Transaction sent!");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed.");
    }
  };

  return (
    <div style={{ padding: "2rem", background: "#000", color: "#fff", textAlign: "center" }}>
      <h1>🔥 CSWEP Presale</h1>
      {!isConnected ? (
        <button
          onClick={() => connect()}
          style={{ padding: "1rem", background: "#8247e5", color: "#fff", borderRadius: "8px" }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected: {address}</p>
          <button
            onClick={buyWithETH}
            style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#00c896", color: "#fff", borderRadius: "8px" }}
          >
            Buy with 0.01 ETH
          </button>
          <br />
          <button
            onClick={disconnect}
            style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#aaa", borderRadius: "6px" }}
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
          {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
        </>
      )}
    </div>
  );
}
