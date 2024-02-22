import { store } from './store/store'
import { setUninstallURL } from '../../utils/uninstallUrl'
import { initializeApp } from "firebase/app"
import { getAuth, signInWithCustomToken, getIdToken } from "firebase/auth"
import { isProdEnv } from '../../utils/environment'
import { updateUserInfo } from './store/slices/authSlice'
// TODOO: replace these with your actual firebase config values
// need create new app in firebase console
import { firebaseConfigDev, firebaseConfigProd } from "../../utils/firebaseConfigs"

setUninstallURL()
//init firebase
let firebaseConfig = firebaseConfigDev
if (isProdEnv()) {
  firebaseConfig = firebaseConfigProd
}

const config = {
	projectId: firebaseConfig.projectId,
	apiKey: firebaseConfig.apiKey,
	storageBucket: firebaseConfig.storageBucket
}

//init firebase
const app = initializeApp(config)
console.log("Initialized Firebase!", app)

// NOTE: For some reason that is necessary
const log = async () => {
  console.log('process.env: ', process.env.NODE_ENV)
  await console.log(store)
}

log()

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['isUpdate'], (result) => {
    if (result.isUpdate !== true && process.env.NODE_ENV !== 'development') {
      chrome.storage.sync.set({ isUpdate: true }, () => {
        // Perform some action on install not on update
        // Example open onboarding page
      })
    }
  })
})

//signIn with custome token use website for signUp save token localStorage and 
//use page(content) read localStorage this token for extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.component) {
    case 'updateUserInfo':
      const auth = getAuth();
        signInWithCustomToken(auth,message.token)
        .then((userCredential) => {
          const user = userCredential.user
          const tokenUser = getIdToken(user)
          // store.dispatch(updateUserInfo(user))
        })
      break
    default:
      break
  }
})