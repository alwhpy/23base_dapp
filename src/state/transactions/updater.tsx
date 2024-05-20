import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useAddPopup, useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'

// 作用： 检查交易是否需要检查，过滤出已经完成的交易
// lastCheckedBlockNumber: 上次检查的区块号
export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: Record<string, unknown>; lastCheckedBlockNumber?: number }
): boolean {
  if (tx.receipt) return false // 已经完成交易
  if (!tx.lastCheckedBlockNumber) return true // 从未检查过
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber // 从上次检查到现在的区块数
  if (blocksSinceCheck < 1) return false // 未超过一个区块, 不需要检查
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60 // 交易挂起的时间，到现在多少分钟
  if (minutesPending > 60) {
    // 交易挂起超过一个小时
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9 // 每10个区块检查一次,是否完成
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React()
  // 获取当前的区块号
  const lastBlockNumber = useBlockNumber()
  const dispatch = useDispatch<AppDispatch>()
  const state = useSelector<AppState, AppState['transactions']>(state => state.transactions)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transactions = chainId ? state[chainId] ?? ({} as any) : ({} as any)

  // show popup on confirm
  const addPopup = useAddPopup()

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    Object.keys(transactions)
      .filter(hash => shouldCheck(lastBlockNumber, transactions[hash])) // 过滤出需要监听的交易
      .forEach(hash => {
        library
          .getTransactionReceipt(hash) // 获取交易的数据
          .then(receipt => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  // 更新交易状态，标记为已完成
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status, // 1: 成功，0: 失败
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex
                  }
                })
              )

              addPopup(
                // 更新到提示框,弹出提示框
                {
                  txn: {
                    hash,
                    success: receipt.status === 1,
                    summary: transactions[hash]?.summary
                  }
                },
                hash
              )
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch(error => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup])

  return null
}
