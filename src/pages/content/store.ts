import { createStore } from 'effector'
import { Subtitle } from '../../constants/types'

export const autoPauseStore = createStore(false)
export const subsStore = createStore<Subtitle>({
  url: '',
  synchronized: false,
  videoId: null,
  languageCode: null,
  languageName: null,
  autogenerated: null,
  text: null,
  isAutoGenerated: false,
})

export const translatedSubsStore = createStore<Subtitle>({
  url: '',
  synchronized: false,
  videoId: null,
  languageCode: null,
  languageName: null,
  autogenerated: null,
  text: null,
  isAutoGenerated: false,
})