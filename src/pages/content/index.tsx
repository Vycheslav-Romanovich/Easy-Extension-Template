// @ts-ignore
import { createUIStore } from 'redux-webext'
import React from 'react'
import './index.css'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import YoutubeController from './controllers/youtubeController'
import NetflixController from './controllers/netflixController'
import { getService } from '../../utils/url'
import AllPagesController from './controllers/allPagesController'
import { LanguageContextProvider } from '../../context/LanguageContext'
import CourseraController from './controllers/courseraConsroller'


async function initApp() {
  const service = getService()
  const store = await createUIStore()
  const anchor = document.createElement('div')
  if (service !== 'netflix') {
    document.body.appendChild(anchor)
  }

  anchor.classList.add('elangExtension')
  
  ReactDOM.render(
    <Provider store={store}>
      <LanguageContextProvider>
          <AllPagesController />

          {service === 'youtube' && <YoutubeController />}
          {service === 'netflix' && <NetflixController />}
          {service === 'coursera' && <CourseraController />}

      </LanguageContextProvider>
    </Provider>,
    anchor
  )
}

initApp()
