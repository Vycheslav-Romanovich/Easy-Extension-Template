import {
  SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY,
  SET_SERVICE_VOCABULARY_LENGTH,
  GET_WORDS_FROM_DICTIONARY,
  GET_PHRASES_FROM_DICTIONARY,
  SET_COUNT_OF_PRACTICED_WORDS,
  SET_LAST_PRACTICED, SET_STREAK,
  SET_WORDS_TO_PRACTICE,
  REMOVE_WORDS_TO_PRACTICE,
  CLEAR_WORDS_TO_PRACTICE,
} from '../../../../constants/constants'
import { PhraseVocabularyElement, WordVocabularyElement } from '../../../../constants/types'

import { actionsTypes } from '../actions/vocabularyActions'

const initialState = {
  countOfNewWords: 0,
  serviceVocLength: 0,
  vocabularyWords: [] as Array<WordVocabularyElement>,
  practiceWords: [] as Array<WordVocabularyElement>,
  phrases: [] as Array<PhraseVocabularyElement>,
  countOfPracticedWords: 0,
  lastPracticed: 0,
  streak: 0,
}

export type VocabularyStateType = typeof initialState

export default (state = initialState, action: actionsTypes): VocabularyStateType => {
  switch (action.type) {
    case SET_COUNT_OF_NEW_WORDS_AT_VOCABULARY:
      return {
        ...state,
        countOfNewWords: action.payload.countOfNewWords,
      }
    case SET_SERVICE_VOCABULARY_LENGTH:
      return {
        ...state,
        serviceVocLength: action.payload.serviceVocLength,
      }
      case GET_WORDS_FROM_DICTIONARY:
        return {
          ...state,
          vocabularyWords: action.payload.vocabularyWords,
        }
      case GET_PHRASES_FROM_DICTIONARY:
        return {
          ...state,
          phrases: action.payload.phrases,
        }
      case SET_COUNT_OF_PRACTICED_WORDS:
        return {
          ...state,
          countOfPracticedWords: action.payload.countOfPracticedWords
        }
      case SET_LAST_PRACTICED:
        return {
          ...state,
          lastPracticed: action.payload.lastPracticed
        }
      case SET_STREAK:
        return {
          ...state,
          streak: action.payload.streak
        }
        case SET_WORDS_TO_PRACTICE:
        return {
          ...state,
          practiceWords: [...state.practiceWords, action.payload]
        }
        case REMOVE_WORDS_TO_PRACTICE:
        return {
          ...state,
          //@ts-ignore
          practiceWords: state.practiceWords.filter((item)=> item.practiceWords.word !== action.payload.practiceWords.word)
        }
        case CLEAR_WORDS_TO_PRACTICE:
          return {
            ...state,
            practiceWords: []
          } 
    default:
      return state
  }
}
