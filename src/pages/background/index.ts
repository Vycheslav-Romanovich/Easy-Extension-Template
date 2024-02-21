import { store } from './store/store'
import { setUninstallURL } from '../../utils/uninstallUrl'

// TODOO: replace these with your actual firebase config values
// need create new app in firebase console
import { firebaseConfigDev, firebaseConfigProd } from "../../utils/firebaseConfigs"
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { isProdEnv } from '../../utils/environment'

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
};

const app = initializeApp(config);
console.log("Initialized Firebase!", app);

//signIn with custome token use website for signUp save token localStorage and 
// use page(content) read localStorage this token for extension
// const auth = getAuth();
// console.log('auth', auth);
// signInWithCustomToken(auth,'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTcwODQ0NzY3MSwiZXhwIjoxNzA4NDUxMjcxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay0ycGM4bkBlbGFuZy1leHRlbnNpb24tcHJvZC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLTJwYzhuQGVsYW5nLWV4dGVuc2lvbi1wcm9kLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoibm1qTHY3c0o5T1hvc0xvd1lFdHQwVWg3cEdCMyJ9.pL2oziizFAw3xTb6qfDYMrkvH36ioy_KvrYTutIYuxEotHPtEkxhoh8pradDGNTXzH38gCDvymNUEui2b71SG34SEQykkcE24k38g0XPGFs4MLnhIqfPgOE8JuwwpPRPWDzrsHY8tIg7GMNAwGwgf9PIFTA3iOhGhdWL9fwXlmX-Xi7pSyPAhBYFdBuFKPSLGIi7biI2SV7XSbEOKcBWvX6kPvtWmAkFHYCTCgRLldtuqXMcC47YvUgcmMg4EMfIzI3QulK3eEWpkyqvAgj6HnWDUmRqe23IfYs5Yb1sZ826pBI2ijyb9Kpx23RiCtaC9gFK1fL4Uvokv98K1ocfTQ')
//     .then((userCredential) => {      
//       const user = userCredential.user
//       const uid = user?.uid || ''
//       console.log('user', user);
//     }).catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//     });

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
