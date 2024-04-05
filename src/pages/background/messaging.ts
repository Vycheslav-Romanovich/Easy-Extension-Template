export default {
  send: function(message:any) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    const args = [...arguments];
    const responseCallback = chrome.tabs ? args[2] : args[1];
    const tabId = chrome.tabs && args[1];

    if (tabId) {
      chrome.tabs.sendMessage(tabId, message, responseCallback);
    } else {
      chrome.runtime.sendMessage(message, responseCallback);
    }
  },
  onMessage: function(callback:any) {
    const func = (msg:any, msgSender:any, response:any) => {
      return callback(msg, msgSender, response);
    };
    chrome.runtime.onMessage.addListener(func);

    return func;
  },
  removeListener(func:any) {
    chrome.runtime.onMessage.removeListener(func);
  }
};
