// @ts-ignore
import { createUIStore } from 'redux-webext'
import React from 'react'
// @ts-ignore
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './app'

async function initApp() {
  const store = await createUIStore()
  const container = document.getElementById('root')
  // @ts-ignore
  const root = createRoot(container)

  root.render(
    <Provider store={store}>     
        <App />      
    </Provider>
  )
}

initApp()
