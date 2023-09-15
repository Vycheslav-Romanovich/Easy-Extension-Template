// @ts-ignore
import { createUIStore } from 'redux-webext'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app'

async function initApp() {
  const store = await createUIStore()

  ReactDOM.render(
    <Provider store={store}>
      <div className='w-[500px] h-[400px]'>
        <App />
      </div>
    </Provider>,
    document.getElementById('root'),
  )
}

initApp()
