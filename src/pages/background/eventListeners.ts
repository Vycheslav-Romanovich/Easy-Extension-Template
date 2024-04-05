export default chrome.runtime.onMessage.addListener(function (message) {
  // receives message from popup and forwards it to options page if it opened
  if (message.type !== 'bg/options-tab') {
    return
  }

  chrome.windows.getAll({ populate: true }, function (windows) {
    let optionsPage = null
    windows.forEach((window) => {
      window.tabs?.forEach((tab) => {
        if (tab.url && tab.url.includes('chrome-extension') && tab.url.includes('options')) {
          optionsPage = tab
        }
      })
    })

    if (optionsPage) {
      chrome.runtime.sendMessage({ type: 'op/options-tab', tab: message.tab })
    } else {
      setTimeout(() => chrome.runtime.sendMessage({ type: 'op/options-tab', tab: message.tab }), 1000)
      setTimeout(() => chrome.runtime.sendMessage({ type: 'op/options-tab', tab: message.tab }), 1500)
    }
  })
})
