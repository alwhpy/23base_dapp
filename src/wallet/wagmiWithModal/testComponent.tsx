import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function TestComponent() {
  const { open } = useWeb3Modal()
  return (
    <div>
      <p>web3modal</p>
      <button onClick={() => open()}>wallet connect</button>
    </div>
  )
}
