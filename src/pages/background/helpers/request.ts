import { PopupData } from '../../../constants/types'
import { cryptPaymentData } from '../../../utils/cryptData'
import { environment } from '../../../utils/environment'
import { getService } from '../../../utils/url'
import { app } from '../index'
import axios from 'axios'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

export const saveWordTranslationHistory = (
  subs: string,
  word: string | undefined,
  uid: string,
  link: string,
  requestProps: PopupData | undefined,
  translate: string,
  transcription: string | undefined,
  learningLanguageCode: string
): void => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  const resultWord = word?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()

  translate && requestProps && resultWord &&
    app
      .database()
      .ref(`users/${uid}/translateHistory/${resultWord}`)
      .set({
        word,
        historyPhrases: subs,
        translate,
        transcription: transcription ? transcription : requestProps.transcription,
        partOfSpeech: requestProps.partOfSpeech,
        synonyms: requestProps.synoyms || [],
        example: requestProps.example,
        allPartOfSpeech: requestProps.allPartOfSpeech,
        timestamp: Date.now(),
        link,
        learningLanguageCode,
      })
}

const updateCounterOfNewWords = (uid: string) => {
  app
    .database()
    .ref(`users/${uid}/utils/counterNewWords`)
    .once('value')
    .then((res) => {
      if (res.val() || res.val() === 0) {
        return res.val() + 1
      } else {
        return 0
      }
    })
    .then((counterNewWords) => {
      app.database().ref(`users/${uid}/utils`).update({ counterNewWords })
    })
}

export const getPharesDescription = (
  phrase: string,
  uid: string | undefined,
  link: string,
  updateVoc: () => void,
  translate: string,
  courseraVideoId: string,
  langCode: string
): void => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  const resultPhrases = phrase?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()

  resultPhrases &&
    app
      .database()
      .ref(`users/${uid}/phares/vocabulary/${resultPhrases}`)
      .set({
        phrase: phrase,
        translate,
        link: link,
        timestamp: Date.now(),
        learningLanguageCode: langCode
      })
      .then(() => updateVoc())
      .then(() => uid && updateCounterOfNewWords(uid))

  if (getService() === 'youtube' || getService() === 'netflix' || getService() === 'coursera') {
    sendAmplitudeEvent('add_to_vocabulary', { resource: `${getService()}`, type: 'phrase' })
  } else {
    sendAmplitudeEvent('add_to_vocabulary', { resource: `web_page`, type: 'phrase' })
  }
}

export const getWordDescription = (
  word: string,
  uid: string,
  link: string,
  updateVoc: () => void,
  requestProps: PopupData | undefined,
  translate: string,
  transcription: string | undefined,
  courseraVideoId: string,
  langCode?: string
): void => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  const resultWord = word?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()

  requestProps && resultWord &&
    app
      .database()
      .ref(`users/${uid}/vocabulary/${resultWord}`)
      .set({
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
        memoryScale: 0,
        learningLanguageCode: langCode
      })
      .then(() => updateVoc())
      .then(() => uid && updateCounterOfNewWords(uid))

  if (getService() === 'youtube' || getService() === 'netflix' || getService() === 'coursera') {
    sendAmplitudeEvent('add_to_vocabulary', { resource: `${getService()}`, type: 'word' })
  } else {
    sendAmplitudeEvent('add_to_vocabulary', { resource: `web_page`, type: 'word' })
  }
}

export const getSingleWord = (word: string | undefined, from: string, to: string) => {
  const translatedWord = axios
    .post(
      `${environment.url}/api/translation/translate-extension-text`,
      {
        from: from,
        to: to,
        text: word,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'translate-app-id': cryptPaymentData(),
        },
      }
    )
    .then((res) => res.data.result)
    .catch((e) => e.err)

  return translatedWord
}

export const dataFromGoogleApi = (word: string, from: string, to: string) => {
  const data = axios
    .get(
      `${environment.url}/api/vocabulary-translate/word` +
        `?` +
        `text=${encodeURIComponent(word?.toLocaleLowerCase())}` +
        `&from=${from}` +
        `&to=${to}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
    .then((res) => res.data)

  return data
}

export const translatePartOfText = (phrases: string, from: string, to: string) => {
  const data = axios
    .post(
      `${environment.url}/api/vocabulary-translate/translate-phases`,
      {
        from: from,
        to: to,
        text: phrases,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((res) => {
      return res.data.translation
    })

  return data
}

export const setExtensionVersion = (version: string, uid: string) => {
  axios.post(
    `${environment.url}/api/firebase-auth/setExtensionVersion`,
    {
      version,
      uid,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export const dataAudioWordLink = (word: string) => {
  const data = axios
    .get(
      `https://easy4learn.com/api/admin/media/audio/` +
        `?` +
        `text=${encodeURIComponent(word?.toLocaleLowerCase())}`,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
    .then((res) => res.data)

  return data
}