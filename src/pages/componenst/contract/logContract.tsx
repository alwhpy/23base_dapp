import { TransactionResponse } from '@ethersproject/providers'
import { erc20TokenList } from 'constants/index'
import { useTokenContract } from 'hooks/useContract'
import { useTransactionAdder } from 'myTestState/transactions/hooks'
import { useCallback } from 'react'

export default function LogContract() {
  const erc20Contract = useTokenContract(erc20TokenList.mUSDT.address)
  const addTransaction = useTransactionAdder()
  console.log('erc20Contract', erc20Contract)

  const handleTransfer = useCallback(() => {
    if (erc20Contract) {
      erc20Contract
        .transfer('0xB7912cCB16F4CBfB807e23ff4BD1eD1B001B70dF', '1000000000000000000')
        .then((res: TransactionResponse) => {
          addTransaction(res, { summary: 'transfer mUSDT 执行完成' })
        })
        .catch((err: any) => {
          console.log('err', err)
        })
    }
  }, [addTransaction, erc20Contract])
  return (
    <div>
      <h1>Log Contract</h1>
      <button
        onClick={() => {
          handleTransfer()
        }}
      >
        执行合约
      </button>
    </div>
  )
}
