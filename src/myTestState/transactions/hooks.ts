import { useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { addTransaction, UserSubmittedProp } from './actions'
import { useActiveWeb3React } from 'hooks'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state/hooks'
import { AppState } from 'state'

export function useTransactionAdder() {
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        approval,
        userSubmitted,
        claim
      }: {
        approval?: { tokenAddress: string; spender: string } // 动作： 授权
        claim?: { recipient: string }
        userSubmitted?: UserSubmittedProp
        summary?: string
      }
    ) => {
      const { hash } = response
      if (!account || !chainId) {
        return
      }
      if (!hash) {
        throw Error('hash is empty')
      }
      console.log('useTransactionAdder', addTransaction)

      dispatch(addTransaction({ chainId, from: account, hash, summary, approval, userSubmitted, claim }))
    },
    [account, chainId, dispatch]
  )
}

export function useAllTransaction() {
  const { chainId } = useActiveWeb3React()
  const state = useSelector<AppState, AppState['testTransactions']>(state => {
    return state.testTransactions
  })
  console.log('🚀 ~ useAllTransaction ~ state:', state)
  return chainId ? state[chainId] ?? {} : {}
}
