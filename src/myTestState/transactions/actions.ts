import { createAction } from '@reduxjs/toolkit'
import { ChainId } from 'constants/chain'

export interface IBaseTransaction {
  chainId: ChainId // 当前链
  hash: string // 交易哈希
  from: string // 触发交易的用户的地址
  approval?: { tokenAddress: string; spender: string } // 动作： 授权
  claim?: { recipient: string }
  userSubmitted?: UserSubmittedProp
  summary?: string // 交易提示
}

export interface UserSubmittedProp {
  account: string
  action: string
  key?: string
}
export const addTransaction = createAction<IBaseTransaction>('testTransactions/addTransaction')
