import LocalizedStrings from 'react-localization'
// @ts-ignore
import { createUIStore } from 'redux-webext'
import { RootState } from '../pages/background/store/reducers'

import { ru } from './languages/ru/ru'
import { en } from './languages/en/en'

const strings = new LocalizedStrings({
  en,
  ru,
})

const availableLanguages = strings.getAvailableLanguages()
const interfaceLanguage = strings.getInterfaceLanguage()

if (availableLanguages.indexOf(interfaceLanguage) > -1) {
  strings.setLanguage(interfaceLanguage)
} else {
  strings.setLanguage('en')
}

const syncLanguageWithSettings = async () => {
  const store = await createUIStore()
  let state: RootState = store.getState()
  if (state) {
    strings.setLanguage(state.settings.language)
  }
}

// Listen for ui language change from bg
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'language_update') {
    strings.setLanguage(request.data.language)
  }
})

syncLanguageWithSettings()

export default strings
