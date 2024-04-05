import { initializeApp } from "firebase/app"
import { getAuth, signInWithCustomToken, getIdToken, User, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue } from 'firebase/database'
import './eventListeners'
import store from './store/store'
import { setPaidSubscription, setPaidSubscriptionData, signOutStore, updateUserInfo } from './store/actions/authActions'
import {
  HistoryObj,
  setOffExtensionFromStorage,
  setPracticeTranslateHistory,
  setTranslateHistory,
  setWayToOpenTextTranslation,
  updateSettingsAccount,
  setRandomAB,
} from './store/actions/settingsActions'
// import 'firebase/analytics'
import { environment, isProdEnv } from '../../utils/environment'
// import ga from '../../utils/ga'
import {
  IAnalyticsCustomeEvent,
  IAnalyticsEvent,
  IPaymentData,
  PhrasesObj,
  PhraseVocabularyElement,
  PracticeInfo,
  WordsObj,
  WordVocabularyElement,
  notificationType,
} from '../../constants/types'
import manifest from '../../manifest.json'
import { observerDB } from './helpers/firebase'
import { firebaseConfigDev, firebaseConfigProd } from '../../utils/firebaseConfigs'
import { generateGeneralWordArray } from '../../utils/normalizeTerm'
import {
  getPhrasesFromDictionary,
  getWordsFromDictionary,
  setCountOfPracticedWords,
  setLastPracticed,
  setStreak,
} from './store/actions/vocabularyActions'
import { setExtensionVersion } from './helpers/request'
import { checkAB } from '../../utils/getVersion'
import { getLinkToWebsite } from './helpers/websiteLink'

// import * as amplitude from '@amplitude/analytics-browser'

// amplitude.init('03602e197f28af072db56f511fcbd984')

let firebaseConfig = firebaseConfigDev

if (isProdEnv()) {
  firebaseConfig = firebaseConfigProd
}

store.dispatch(setRandomAB(Math.floor(Math.random() * 2)))

export const app = initializeApp(firebaseConfig)

const getTranslateHistory = async (data: HistoryObj) => {
  store.dispatch(setPracticeTranslateHistory(data))
  store.dispatch(setTranslateHistory(data))
}

const getVocabulary = async (data: WordsObj) => {
  let vocabularyWords: Array<WordVocabularyElement>

  if (data) {
    vocabularyWords = generateGeneralWordArray(data) as Array<WordVocabularyElement>
    vocabularyWords.forEach((item) => {
      if (item.memoryScale === undefined) {
        item.memoryScale = 0;
      }
    })
  } else {
    vocabularyWords = []
  }

  store.dispatch(getWordsFromDictionary({ vocabularyWords }))
}

const getPhrases = async (data: PhrasesObj) => {
  let phrases: Array<PhraseVocabularyElement>

  if (data) {
    phrases = generateGeneralWordArray(data) as PhraseVocabularyElement[]
  } else {
    phrases = []
  }

  store.dispatch(getPhrasesFromDictionary({ phrases }))
}

const getPaymentData = async (paymentData: IPaymentData) => {
  store.dispatch(setPaidSubscriptionData(paymentData))
}

const getSignOutFromWeb = async (isSignOutFromWeb: boolean) => {
  if (isSignOutFromWeb) {
    store.dispatch(signOutStore(isSignOutFromWeb))
  }
}

const getSettings = () => {
  store.dispatch(updateSettingsAccount())
}

const getPracticeInfo = (practiceInfo: PracticeInfo) => {
  store.dispatch(setCountOfPracticedWords(practiceInfo.termsCountDaily ? practiceInfo.termsCountDaily : 0))
  store.dispatch(setLastPracticed(practiceInfo.lastPracticed ? practiceInfo.lastPracticed : 0))
  store.dispatch(setStreak(practiceInfo.streak ? practiceInfo.streak : 0))
}

const getDataFromDB = (user: User | null) => {
  let unsubscribeHistoryTranslate = null
  let unsubscribeVocabularyWords = null
  let unsubscribeVocabularyPhrases = null
  let unsubscribePaymentData = null
  let unsubscribeSettings = null
  let unsubscribeSignOutFromWeb = null
  let unsubscribePracticeInfo = null

  if (user) {
    unsubscribeHistoryTranslate = observerDB(getTranslateHistory, 'translateHistory')
    unsubscribeVocabularyWords = observerDB(getVocabulary, 'vocabulary')
    unsubscribeVocabularyPhrases = observerDB(getPhrases, 'phares/vocabulary')
    unsubscribePaymentData = observerDB(getPaymentData, 'paidSubscription')
    unsubscribeSettings = observerDB(getSettings, 'settings')
    unsubscribeSignOutFromWeb = observerDB(getSignOutFromWeb, 'popUpSync/isSignOutFromWeb')
    unsubscribePracticeInfo = observerDB(getPracticeInfo, 'practiceInfo')
  }

  if (!user) {
    chrome.storage.local.get(['translatedHistory'], (result) => {
      if (Object.keys(result).length) {
        store.dispatch(setPracticeTranslateHistory(result.translatedHistory))
      }
    })

    store.dispatch(setPaidSubscription(false))
  }
}

// export const auth = getAuth(app);

// auth.onAuthStateChanged((user) => {
//  //analytics
//   if (user) {
//     // amplitude.setUserId(user.uid)
//     const database = getDatabase();
//     const dbRef = ref(database, `users/${user.uid}${'/paidSubscription'}`)
//     onValue(dbRef, (snapshot) => {
//       const data = snapshot.val()
//       if (data){
//         // const checkPaid = data.isSubscriptionFinished ? 0 : 1
//         // const identify = new amplitude.Identify().add('Beta', checkAB()).add('paidSubscription', checkPaid).add('A/B', store.getState().settings.randomAB ?? 0)
//         // amplitude.identify(identify)
//       }
//       else{ 
//         // const identify = new amplitude.Identify().add('Beta', checkAB()).add('paidSubscription', 0).add('A/B', store.getState().settings.randomAB ?? 0)
//         // amplitude.identify(identify)
//       }
//     })
    
//   } 
//   else {
//     // const identify = new amplitude.Identify().add('Beta', checkAB()).add('A/B', store.getState().settings.randomAB ?? 0)
//     // amplitude.identify(identify)
//   }

  

//   store.dispatch(updateUserInfo()).then(() => {
//     store.dispatch(setOffExtensionFromStorage())
//     store.dispatch(setWayToOpenTextTranslation({ wayToOpenTextTranslation: 'withButton' }))
//   })
//   getDataFromDB(user)
// })

const getUrlUninstail = () => {
  return `${environment.website}/${store.getState().settings.interfaceLang}/feedback?version=${manifest.version}`
}

if (typeof chrome.runtime.onInstalled !== 'undefined') {
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install') {
      chrome.tabs.create({ url: `${environment.website}/${store.getState().settings.interfaceLang}/welcome/first-step` }, function () {
        console.log('Opening elang.app after extension was installed!')
      })
      // ga('elangExtension.send', 'event', 'Extention', 'Install')
    }
  })
}

// ga('create', 'UA-4027447-18', 'auto', 'elangExtension')

//need refactor
// const updateToken = ()=> {
//   onAuthStateChanged(auth, (user)=>{
//     if(user){
//       getIdToken(user).then(() => {
//         store.dispatch(updateUserInfo()).then(() => {
//           store.dispatch(setOffExtensionFromStorage())
//           store.dispatch(setWayToOpenTextTranslation({ wayToOpenTextTranslation: 'withButton' }))
//         })
//       })
//     }
//   })}

// const keepAliveToken = () => setInterval(updateToken, 6e5);
// const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
// chrome.runtime.onStartup.addListener(keepAlive);
// keepAlive();
// keepAliveToken();

// app.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

if (chrome.runtime.setUninstallURL) {
  // chrome.storage.sync.clear()
  // chrome.storage.local.clear()
  chrome.runtime.setUninstallURL(getUrlUninstail())
}

const sendAnalyticsEvent = (event: IAnalyticsEvent): void => {
  // event.label
  //   ? ga('elangExtension.send', 'event', event.category, event.action, event.label)
  //   : ga('elangExtension.send', 'event', event.category, event.action)
}

const sendAnalyticsCustomeEvent = (event: IAnalyticsCustomeEvent) => {
  // ga('elangExtension.set', event.dimension, event.value)
}

const createNotification = (data: notificationType) => {
  chrome.notifications.create(data.notificationId, data.options)
  chrome.notifications.onClicked.addListener((notificationId)=>{
    // amplitude.track('go_to_companion', {resource: `Click_${notificationId}`})
    getLinkToWebsite(store.getState().settings.interfaceLang, '/extensionTrain')
    })
  setTimeout(()=>{
    chrome.notifications.clear(data.notificationId)
  },15000)
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.component) {
    case 'updateUserInfo':
      // const auth = getAuth(app);
      //   signInWithCustomToken(auth, message.token)
      //   .then((userCredential) => {
      //     const user = userCredential.user
      //     const uid = user?.uid || ''
      //     if (user?.metadata.creationTime && Date.parse(new Date().toString()) - Date.parse(user?.metadata.creationTime) < 10800000) {
      //       setExtensionVersion(manifest.version, uid)
      //     }
      //   })
      break
    case 'sendAnalyticsEvent':
      sendAnalyticsEvent(message.event)
      break
    case 'sendAmplitudeEvent':
      // amplitude.track(message.event.name, message.event.payload)
      break
    case 'sendAnalyticsCustomeEvent':
      sendAnalyticsCustomeEvent(message.event)
      break
    case 'notificationEvent':
      createNotification(message)
      break
    case 'newTab':
      chrome.tabs.create({url: message.url})
      break
    default:
      break
  }
  if (message.getuserid) {
    // sendResponse(auth.currentUser?.uid)
  }
})
