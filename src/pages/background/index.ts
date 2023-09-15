import { store } from './store/store'
import { setUninstallURL } from '../../utils/uninstallUrl'

setUninstallURL()

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
