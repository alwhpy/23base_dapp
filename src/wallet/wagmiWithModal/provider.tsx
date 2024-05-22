import { defaultWagmiConfig } from '@web3modal/wagmi'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

export const projectId = '41301e8365d2d65b321281fd10eab138'

export const chains = [mainnet, sepolia]
//  不能直接使用web3modalConfig 作为provider的config,会少一些东西
// 我们可以只取它的连接器
const web3modalConfig = defaultWagmiConfig({ projectId, chains })
const { publicClient, webSocketPublicClient } = configureChains(chains, [
  alchemyProvider({ apiKey: '74_McmNwAy18tBibLLM2aFmRdiihOcwa' })
])
export const wagmiConfig = createConfig({
  publicClient,
  webSocketPublicClient,
  autoConnect: true,
  connectors: [...web3modalConfig.connectors]
})

export default function ConnectProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}
