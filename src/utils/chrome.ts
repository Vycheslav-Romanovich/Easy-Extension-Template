export const openOptionsOnPage = (
  page: 'settings' | 'account' | 'dictionary' | 'premium' | 'signup' | 'signin' | 'phrasesVocabulary' | 'wordItem'
) => {
  chrome.runtime.openOptionsPage()
  sendMessage(page)
}

const sendMessage = (page: string) => {
  chrome.runtime.sendMessage({ type: 'bg/options-tab', tab: page }, function (response) {
    console.log(response)
  })
}
