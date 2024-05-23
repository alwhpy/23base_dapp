import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'

export default function MulticallDebug() {
  const erc20 = useTokenContract('0x21C3ac8c6E5079936A59fF01639c37F36CE5ed9E')
  console.log('erc20', erc20?.interface.getFunction('balanceOf'))
  console.log(
    'encodeFunctionData',
    erc20?.interface.encodeFunctionData('balanceOf', ['0x67Ac8898203066f2FD0bE7026c5c54009252a800']) //在以太坊中，合约函数调用需要被编码成特定的字节格式，这样才能在区块链上被识别和执行。
  )

  const result = useSingleCallResult(erc20, 'balanceOf', ['0x67Ac8898203066f2FD0bE7026c5c54009252a800'])
  console.log('🚀 ~ MulticallDebug ~ result:', result)

  return null
}
