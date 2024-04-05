type eventType = {
  name: string
  payload?: {[key: string]: string}
}

export const sendAmplitudeEvent = (name: string, payload?: {[key: string]: string}): void => {
  const event: eventType = { name }
  if (payload) {
    event.payload = payload
  }
  chrome.runtime.sendMessage({ component: 'sendAmplitudeEvent', event })
}