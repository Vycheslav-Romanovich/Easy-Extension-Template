import {
  GET_PHRASES_FROM_DICTIONARY,
  GET_WORDS_FROM_DICTIONARY,
  SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY,
  SET_COUNT_OF_PRACTICED_WORDS, SET_LAST_PRACTICED,
  SET_SERVICE_VOCABULARY_LENGTH, SET_STREAK,
  SET_WORDS_TO_PRACTICE,
  REMOVE_WORDS_TO_PRACTICE,
  CLEAR_WORDS_TO_PRACTICE,
} from '../../../../constants/constants'

import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { PhraseVocabularyElement, WordVocabularyElement } from '../../../../constants/types'
import { getDatabase, ref, set, remove } from "firebase/database";

export type actionsTypes =
  | setCountOfNewWordsAtVocabulary
  | setServiceVocLengthShow
  | getWordsFromDictionary
  | getPhrasesFromDictionary
  | setCountOfPracticedWords
  | setLastPracticed
  | setStreak
  | setWordsToPractice
  | removeWordsToPractice
  | clearWordsToPractice

type ThunkType = ThunkAction<Promise<void>, RootState, unknown, actionsTypes>

//Set count of NEW words at vocabulary
type setCountOfNewWordsAtVocabularyParameters = {
  countOfNewWords: number
}

type setCountOfNewWordsAtVocabulary = {
  type: typeof SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY
  payload: { countOfNewWords: number }
}

export const setCountOfNewWordsAtVocabulary = ({ countOfNewWords }: setCountOfNewWordsAtVocabularyParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY, payload: { countOfNewWords } })
  }
}

export const deleteWordFromVacabulary = (word: string, uid: string, courseraVideoId: string, updateVoc?: () => void): void => {
  const vocabularyPath = `vocabulary/${word
    ?.replace(/[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g, '')
    .replace(/\s/g, '')
    .toLocaleLowerCase()}`

  const db = getDatabase();
  remove(ref(db,`users/${uid}/${vocabularyPath}`))
  .then(() => updateVoc && updateVoc())
}

export const deletePhraseFromVacabulary = (word: string, uid: string, courseraVideoId: string, updateVoc?: () => void): void => {
  const phrasePath = `phares/vocabulary/${word
    ?.replace(/[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g, '')
    .replace(/\s/g, '')
    .toLocaleLowerCase()}`

    const db = getDatabase();
    remove(ref(db,`users/${uid}/${phrasePath}`))
    .then(() => updateVoc && updateVoc())
}


//Set service vocabulary length
type setServiceVocLengthParameters = {
  serviceVocLength: number
}

type setServiceVocLengthShow = {
  type: typeof SET_SERVICE_VOCABULARY_LENGTH
  payload: { serviceVocLength: number }
}

export const setServiceVocabylaryLength = ({ serviceVocLength }: setServiceVocLengthParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SERVICE_VOCABULARY_LENGTH, payload: { serviceVocLength } })
  }
}

//Get words from vocabulary
type getWordsFromDictionaryParam = {
  vocabularyWords: Array<WordVocabularyElement>
}

type getWordsFromDictionary = {
  type: typeof GET_WORDS_FROM_DICTIONARY
  payload: { vocabularyWords: Array<WordVocabularyElement> }
}

export const getWordsFromDictionary = ({ vocabularyWords }: getWordsFromDictionaryParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: GET_WORDS_FROM_DICTIONARY, payload: { vocabularyWords } })
  }
}

//Get words from vocabulary
type getPhrasesFromDictionaryParam = {
  phrases: Array<PhraseVocabularyElement>
}

type getPhrasesFromDictionary = {
  type: typeof GET_PHRASES_FROM_DICTIONARY
  payload: { phrases: Array<PhraseVocabularyElement> }
}

export const getPhrasesFromDictionary = ({ phrases }: getPhrasesFromDictionaryParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: GET_PHRASES_FROM_DICTIONARY, payload: { phrases } })
  }
};

// Set count of practiced words
type setCountOfPracticedWords = {
  type: typeof SET_COUNT_OF_PRACTICED_WORDS
  payload: { countOfPracticedWords: number }
}

export const setCountOfPracticedWords = (countOfPracticedWords: number): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_COUNT_OF_PRACTICED_WORDS, payload: { countOfPracticedWords } })
  }
};

// Set last practiced
type setLastPracticed = {
  type: typeof SET_LAST_PRACTICED
  payload: { lastPracticed: number }
}

export const setLastPracticed = (lastPracticed: number): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_LAST_PRACTICED, payload: { lastPracticed } })
  }
};

// Set streak
type setStreak = {
  type: typeof SET_STREAK
  payload: { streak: number }
}

export const setStreak = (streak: number): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_STREAK, payload: { streak } })
  }
};

type setWordsToPractice = {
  type: typeof SET_WORDS_TO_PRACTICE
  payload: WordVocabularyElement 
}

export const setWordsToPractice = ( practiceWords: WordVocabularyElement): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_WORDS_TO_PRACTICE, payload:  practiceWords  })
  }
}

type removeWordsToPractice = {
  type: typeof REMOVE_WORDS_TO_PRACTICE
  payload: WordVocabularyElement 
}

export const removeWordsToPractice = ( practiceWords: WordVocabularyElement): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: REMOVE_WORDS_TO_PRACTICE, payload:  practiceWords  })
  }
}

type clearWordsToPractice = {
  type: typeof CLEAR_WORDS_TO_PRACTICE
  payload: { practiceWords: Array<WordVocabularyElement> }
}

export const clearWordsToPractice = () =>{
  return { type: CLEAR_WORDS_TO_PRACTICE }
}