import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import multicall from './multicall/reducer'
import wallets from './wallet/reducer'
import userWallet from './userWallet/reducer'
import testTransactions from 'myTestState/transactions/reducer'
const PERSISTED_KEYS: string[] = ['transactions', 'userWallet', 'testTransactions']

const store = configureStore({
  reducer: {
    application,
    user,
    wallets,
    userWallet,
    transactions,
    multicall,
    testTransactions
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }) // 自动保存在本地
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
