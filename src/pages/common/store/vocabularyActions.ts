import {
  SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY,
  SET_SERVICE_VOCABULARY_LENGTH,
  SET_WORDS_TO_PRACTICE,
  REMOVE_WORDS_TO_PRACTICE,
  CLEAR_WORDS_TO_PRACTICE,
} from '../../../constants/constants'
import { WordVocabularyElement } from '../../../constants/types'

export function setCountOfNewWordsAtVocabulary(countOfNewWords: number) {
  return {
    type: SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY,
    countOfNewWords,
  }
}

export function setServiceVocabylaryLength(serviceVocLength: number) {
  return {
    type: SET_SERVICE_VOCABULARY_LENGTH,
    serviceVocLength,
  }
}

export function setWordsToPractice(practiceWords: WordVocabularyElement) {
  return {
    type: SET_WORDS_TO_PRACTICE,
    practiceWords
  }
}

export function removeWordsToPractice(practiceWords: WordVocabularyElement) {
  return {
    type: REMOVE_WORDS_TO_PRACTICE,
    practiceWords,
  }
}

export function clearWordsToPractice() {
  return {
    type: CLEAR_WORDS_TO_PRACTICE,
  }
}