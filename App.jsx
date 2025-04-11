import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import {
  createClient,
  WagmiConfig,
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { mainnet } from "wagmi/chains";

const config = createClient(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: "2e6ef9ae07248e56d6a61f627aa6f70d", // free tier project
    appName: "CSWEP Wallet",
  })
);

const PRESALE_ADDRESS = "0x446bbDbEd2C6A499cd6A3BEbf8fed26d93809FBf";

export default function App() {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <PresaleApp />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

function PresaleApp() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState(null);
  const [status, setStatus] = useState("");

  async function contributeETH() {
    try {
      setStatus("Waiting for wallet...");
      const hash = await walletClient.sendTransaction({
        to: PRESALE_ADDRESS,
        value: ethers.parseEther("0.01"),
      });
      setTxHash(hash);
      setStatus("Transaction sent!");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed or rejected");
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">🔥 CSWEP Presale</h1>
      <ConnectKitButton />

      {isConnected && (
        <>
          <p className="mt-4 text-green-400">Wallet: {address}</p>
          <button
            onClick={contributeETH}
            className="mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl text-white shadow-lg"
          >
            Buy with 0.01 ETH
          </button>

          {status && <p className="mt-3 text-sm text-yellow-300">{status}</p>}

          {txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              className="mt-2 underline text-blue-400"
            >
              View on Etherscan
            </a>
          )}
        </>
      )}
    </div>
  );
}
