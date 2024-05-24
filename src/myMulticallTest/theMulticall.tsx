import { useActiveWeb3React } from 'hooks'
import { useMulticallContract, useTokenContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'

// Multicall 的本质就是这样子去查询
export default function TheMulticall() {
  const { account } = useActiveWeb3React()
  const contract = useMulticallContract()
  const erc20Contract = useTokenContract('0x21C3ac8c6E5079936A59fF01639c37F36CE5ed9E')
  const callData = useMemo(() => {
    if (erc20Contract && account) {
      const functionFragment = erc20Contract.interface.getFunction('balanceOf')
      return [
        {
          target: erc20Contract.address,
          callData: erc20Contract.interface.encodeFunctionData(functionFragment, [account])
        }
      ]
    }
    return null
  }, [account, erc20Contract])
  const toCall = useCallback(() => {
    if (!contract || !callData) {
      return
    }
    contract.callStatic
      .tryBlockAndAggregate(false, callData)
      .then(res => {
        console.log('resresresresres', res, callData)
      })
      .catch(error => {
        console.log('resresresresres', error, callData)
      })
  }, [callData, contract])
  return (
    <div>
      <button onClick={() => toCall()}> to call </button>
    </div>
  )
}
