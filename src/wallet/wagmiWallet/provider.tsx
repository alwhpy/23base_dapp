import { configureChains, createConfig, useAccount, useChainId, useConnect, useDisconnect, WagmiConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { alchemyProvider } from 'wagmi/providers/alchemy'
export default function WagmiProvider() {
  const { publicClient, webSocketPublicClient } = configureChains(
    [sepolia, mainnet],
    [alchemyProvider({ apiKey: '74_McmNwAy18tBibLLM2aFmRdiihOcwa' })]
  )
  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient
    // connectors: [new MetaMaskConnector(), new InjectedConnector()]
  })
  return (
    <WagmiConfig config={config}>
      <TestComponent />
    </WagmiConfig>
  )
}

function TestComponent() {
  const { address } = useAccount()
  const chainId = useChainId()
  console.log('🚀 ~ TestComponent ~ address:', address, chainId)
  const { connect } = useConnect({ connector: new MetaMaskConnector() })
  const { disconnect } = useDisconnect()
  return (
    <>
      <button onClick={() => connect()}>connect</button>
      <button onClick={() => disconnect()}> disconnect </button>
    </>
  )
}
