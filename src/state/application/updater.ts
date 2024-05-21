import { useCallback, useEffect, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useDispatch } from 'react-redux'
import { SUPPORT_NETWORK_CHAIN_IDS } from 'constants/chain'
import { getOtherNetworkLibrary } from 'connection/MultiNetworkConnector'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const windowVisible = useIsWindowVisible()

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState(state => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined
    // 初始化设置
    setState({ chainId, blockNumber: null })
    library
      .getBlockNumber() // 获取当前网络区块高度
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback) // 监听区块被挖出事件
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  // 更新项目中的区块高度
  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  //获取其他网络的区块高度，10 秒钟获取一次
  const providers = useMemo(() => SUPPORT_NETWORK_CHAIN_IDS.map(v => getOtherNetworkLibrary(v)), [])
  const [timeInt, setTimeInt] = useState(0)
  useEffect(() => {
    setTimeout(() => setTimeInt(timeInt + 1), 10000)
    providers.map((provider, index) =>
      provider
        ?.getBlockNumber()
        .then(bn => dispatch(updateBlockNumber({ chainId: SUPPORT_NETWORK_CHAIN_IDS[index], blockNumber: bn })))
    )
  }, [providers, timeInt, dispatch])

  return null
}
