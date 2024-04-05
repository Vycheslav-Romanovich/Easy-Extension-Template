import { PopupData, SendReqFinishedSubscriptionAxios } from '../../../constants/types'
import { getService } from '../../../utils/url'
import { getDatabase, ref, update, get, child, set } from 'firebase/database'
import { environment } from '../../../utils/environment'
import axios, { AxiosResponse } from 'axios'
import { processedString } from './firebase'

const updateCounterOfNewWords = (uid: string) => {
  const database = getDatabase();
  const dbRef = ref(database)
  get(child(dbRef, `users/${uid}/utils/counterNewWords`)).then((snapshot) => {
    if (snapshot.val() || snapshot.val() === 0) {
      return snapshot.val() + 1
    } else {
      return 0
    }
  })
    .then((counterNewWords) => {
      update(ref(database, `users/${uid}/utils`),{ counterNewWords: counterNewWords})
    })
}

export const getPharesDescriptionFromPopap = (
  phrase: string,
  uid: string | undefined,
  link: string,
  updateVoc: () => void,
  translate: string,
  courseraVideoId: string
): void => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  const resultPhrases = phrase?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()

  const database = getDatabase();
  set(ref(database, `users/${uid}/phares/vocabulary/${resultPhrases}`),{
      phrase: phrase,
      translate,
      link: link,
      timestamp: Date.now(),
  })
  .then(() => updateVoc())
  .then(() => uid && updateCounterOfNewWords(uid))

  if (getService() === 'youtube' || getService() === 'netflix' || getService() === 'coursera') {
    const event = {
      category: 'TextTranslation',
      action: 'AddSubsPhrase',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  } else {
    const event = {
      category: 'TextTranslation',
      action: 'AddTextPhrase',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }
}

export const getWordDescriptionFromPopap = (
  word: string,
  uid: string,
  link: string,
  updateVoc: () => void,
  requestProps: PopupData | undefined,
  translate: string,
  transcription: string | undefined,
  courseraVideoId: string
): void => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  const resultWord = word?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()

  const database = getDatabase();
  
  requestProps &&
  set(ref(database, `users/${uid}/vocabulary/${resultWord}`),{
      word: word,
      translate: translate,
      transcription: transcription ? transcription : requestProps.transcription,
      partOfSpeech: requestProps.partOfSpeech,
      cardWordShow: false,
      synonyms: requestProps.synoyms || [],
      example: requestProps.example,
      allPartOfSpeech: requestProps.allPartOfSpeech,
      timestamp: Date.now(),
      link: link,
    })
    .then(() => updateVoc())
    .then(() => uid && updateCounterOfNewWords(uid))

  if (getService() === 'youtube' || getService() === 'netflix' || getService() === 'coursera') {
    const event = {
      category: 'TextTranslation',
      action: 'AddSubsWord',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  } else {
    const event = {
      category: 'TextTranslation',
      action: 'AddTextWord',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }
}

export const dataFromGoogleApiFromPopup = (word: string, from: string, to: string) => {
  const data = axios.get(
    `${environment.url}/api/vocabulary-translate/word` +
    `?` +
    `text=${encodeURIComponent(word?.toLocaleLowerCase())}` +
    `&from=${from}` +
    `&to=${to}`,
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  )
    .then((res) => {
      return res.data
    })

  return data
}

export const sendReqFinishedSubscription = (
  { uid, subscriptionId, }: SendReqFinishedSubscriptionAxios
): Promise<AxiosResponse<any>> => {
  const body = {
    uid: uid,
    subscriptionId: subscriptionId,
    reasonText: 'finish subscription',
  };
  return axios.post(
    `${environment.url}/api/paypro-global/subscriptions-finish`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const updateMemoryScalePopup = (uid: string, resultWord: string, memoryScale: number) => {
  const database = getDatabase();
  return update(ref(database, `users/${uid}/vocabulary/${processedString(resultWord)}`),{ memoryScale: memoryScale})
}
