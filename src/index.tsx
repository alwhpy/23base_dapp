import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'inter-ui'
import { CssBaseline, ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material'
import theme from 'theme/index'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import Blocklist from './components/essential/Blocklist'
import App from './pages/App'
import store from './state'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import { Buffer } from 'buffer'
import Web3Provider from 'components/Web3Provider'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { chains, projectId, wagmiConfig } from 'wallet/wagmiWithModal/provider'

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}
window.Buffer = window.Buffer || Buffer

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
// 导入功能的模块尽量使用web3modal/wagmi/react 统一导入，创建和使用hook都是
createWeb3Modal({ projectId, wagmiConfig, chains })
root.render(
  <StrictMode>
    <Provider store={store}>
      <Web3Provider>
        <Blocklist>
          <Updaters />
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </Blocklist>
      </Web3Provider>
    </Provider>
  </StrictMode>
)

serviceWorkerRegistration.unregister()
