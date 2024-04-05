// @ts-ignore
import { createUIStore } from 'redux-webext'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app'
// import ga from '../../utils/ga'
import { LanguageContextProvider } from '../../context/LanguageContext'
import { isProdEnv } from '../../utils/environment'
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase, ref, onValue } from 'firebase/database'
import { firebaseConfigDev, firebaseConfigProd } from '../../utils/firebaseConfigs'
// import * as amplitude from '@amplitude/analytics-browser'
import { checkAB } from '../../utils/getVersion'
import { app } from '../background'

async function initApp() {
  const store = await createUIStore()
  // ga('create', 'UA-4027447-18', 'auto', 'elangExtension')

  let firebaseConfig = firebaseConfigDev

  if (isProdEnv()) {
    firebaseConfig = firebaseConfigProd
  }


  if (!getApps().length) {
   initializeApp(firebaseConfig)
 }
 const auth = getAuth(app)
  // auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

  //analytics
  auth.onAuthStateChanged((user) => {
    if (user) {
      // amplitude.setUserId(user.uid)
      const database = getDatabase();
      const dbRef = ref(database, `users/${user.uid}${'/paidSubscription'}`)
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        if (data){
          // const checkPaid = data.isSubscriptionFinished ? 0 : 1
          // const identify = new amplitude.Identify().add('Beta', checkAB()).add('paidSubscription', checkPaid).add('A/B', store.getState().settings.randomAB ?? 0)
          // amplitude.identify(identify)
        }
        else{ 
          // const identify = new amplitude.Identify().add('Beta', checkAB()).add('paidSubscription', 0).add('A/B', store.getState().settings.randomAB ?? 0)
          // amplitude.identify(identify)
        }
      })
    } 
    else{
      // const identify = new amplitude.Identify().add('Beta', checkAB()).add('A/B', store.getState().settings.randomAB ?? 0)
      // amplitude.identify(identify)
    }
  })
  
  ReactDOM.render(
    <Provider store={store}>
      <LanguageContextProvider>
        <App />
      </LanguageContextProvider>
    </Provider>,
    document.getElementById('root')
  )
}

initApp()
