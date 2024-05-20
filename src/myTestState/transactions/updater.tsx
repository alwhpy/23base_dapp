import { useEffect } from 'react'
import { useAllTransaction } from './hooks'
import { useActiveWeb3React } from 'hooks'
import { useBlockNumber } from 'state/application/hooks'

export default function Updater() {
  const { library } = useActiveWeb3React()
  const state = useAllTransaction()
  const lastBlockNumber = useBlockNumber()
  console.log('🚀 ~ Updater ~ state:', state)
  useEffect(() => {
    if (!state) {
      return
    }
    console.log('sasfsafd', state)
    Object.keys(state).forEach(hash => {
      console.log('🚀 ~ Object.keys ~ hash:', hash)
      library?.getTransactionReceipt(hash).then(res => {
        // getTransactionReceipt 如果交易尚未被挖掘，则返回hash或null的交易收据。
        // 特点： 会立即去解析
        // 所以需要依赖一下区块的更新, 很重要!!!
        // waitForTransaction: 可以等到区块挖掘, 缺点： 会造成堵塞
        console.log('🚀 ~ library?.getTransactionReceipt ~ res:', res)
      })
      // state[hash]
    })
  }, [library, state, lastBlockNumber])
  console.log('🚀 ~ Updater ~ state:', state)
  return null
}
