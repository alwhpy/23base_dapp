import { ContractCallContext, Multicall } from 'ethereum-multicall'
import { useActiveWeb3React } from 'hooks'
import { ERC20_ABI } from 'constants/abis/erc20'
import { useEffect, useMemo } from 'react'

export default function TestMulticall() {
  const { library, account } = useActiveWeb3React()
  const multicall = useMemo(() => {
    return library ? new Multicall({ ethersProvider: library, tryAggregate: true }) : null
  }, [library])

  const contractCallContext: ContractCallContext[] = useMemo(
    () => [
      {
        reference: 'erc20Contract',
        contractAddress: '0x21C3ac8c6E5079936A59fF01639c37F36CE5ed9E',
        abi: ERC20_ABI,
        calls: [
          // 同一个合约中的多次方法调用
          {
            reference: 'balanceOf',
            methodName: 'balanceOf',
            methodParameters: [account]
          },
          {
            reference: 'symbol',
            methodName: 'symbol',
            methodParameters: []
          }
        ]
      }
    ],
    [account]
  )

  useEffect(() => {
    if (multicall && contractCallContext) {
      multicall
        .call(contractCallContext)
        .then(res => {
          console.log('🚀 ~ result ~ res:', res)
        })
        .catch(err => {
          console.log('🚀 ~ multicall.call ~ err:', err)
        })
    }
  }, [contractCallContext, multicall])
  return null
}
