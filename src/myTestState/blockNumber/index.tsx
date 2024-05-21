import { getOtherNetworkLibrary } from 'connection/MultiNetworkConnector'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface IBlockNumberList {
  readonly [chainId: number]: number
}
export default function BlockNumberUpdater() {
  const [state, setState] = useState<IBlockNumberList>({})
  const { chainId, library } = useActiveWeb3React()
  const handleSetState = useCallback(
    (blockNumber: number, _chainId?: number) => {
      // 设置其他链
      if (blockNumber && _chainId) {
        if (!state[_chainId]) {
          setState({ ...state, [_chainId]: blockNumber })
          return
        }
        if (blockNumber !== state[_chainId]) {
          setState({ ...state, [_chainId]: Math.max(blockNumber, state[_chainId]) })
          return
        }
        return
      }
      // 设置当前链
      if (chainId && state[chainId] && blockNumber !== state[chainId]) {
        setState({ ...state, [chainId]: Math.max(blockNumber, state[chainId]) })
        return
      }
      if (chainId && !state[chainId]) {
        setState({ ...state, [chainId]: blockNumber })
        return
      }
    },
    [chainId, state]
  )
  // 设置当前链的区块高度
  useEffect(() => {
    if (!chainId || !library) {
      return
    }
    if (!state[chainId]) {
      library.getBlockNumber().then(handleSetState)
    }
    library.on('block', handleSetState)
    return () => {
      library.removeListener('block', handleSetState)
    }
  }, [chainId, handleSetState, library, state])

  const providers = useMemo(
    () => SUPPORT_NETWORK_CHAIN_IDS.filter(i => i !== chainId).map(i => getOtherNetworkLibrary(i)),
    [chainId]
  )
  const [timeInt, setTimeInt] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => setTimeInt(timeInt + 1), 1000)
    providers.forEach((i, d) => {
      i?.getBlockNumber().then(v => handleSetState(v, SUPPORT_NETWORK_CHAIN_IDS[d]))
    })
    return () => {
      clearTimeout(timer)
    }
  }, [handleSetState, providers, timeInt])

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ state:', state)
  }, [state])
  return null
}
