import { SerializableTransactionReceipt } from 'state/transactions/actions'
import { addTransaction, IBaseTransaction } from './actions'
import { createReducer } from '@reduxjs/toolkit'

export interface TransactionDetails extends IBaseTransaction {
  receipt?: SerializableTransactionReceipt // 交易完成的信息
  lastCheckedBlockNumber?: number //交易交易是否完成的时间
  addedTime: number // 保存交易的时间
  confirmedTime?: number // 交易完成时间
}
export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}
const now = () => new Date().getTime()
export const initialState: TransactionState = {}
export default createReducer(initialState, builder =>
  builder.addCase(addTransaction, (transactions, { payload: _payload }) => {
    const { chainId, hash } = _payload
    // 交易为空
    if (!hash) {
      throw Error('hash can not empty')
    }
    // 包含交易
    if (transactions[chainId]?.[hash]) {
      throw Error('Attempted to add existing transaction.')
    }
    const txs = transactions[chainId] ?? {}
    txs[hash] = { ..._payload, addedTime: now() }
    transactions[chainId] = txs
  })
)
