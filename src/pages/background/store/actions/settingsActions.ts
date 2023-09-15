import {
  SET_DARK_MODE,
  SET_LANGUAGE,
} from '../../../../constants/constants'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { DarkModeType } from '../../../../constants/types'

type ThunkType = ThunkAction<Promise<void>, RootState, unknown, actionsTypes>

export type actionsTypes =
  setLanguageActionType
  | setDarkModeType

// Set language
type setLanguageParameters = {
  language: string
}

type setLanguageActionType = {
  type: typeof SET_LANGUAGE
  payload: { language: string }
}

export const setLanguage = ({ language }: setLanguageParameters): ThunkType => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_LANGUAGE, payload: { language } })
  }
}

// Set setDarkMode
type setDarkMode = {
  darkMode: DarkModeType
}

type setDarkModeType = {
  type: typeof SET_DARK_MODE
  payload: { darkMode: DarkModeType }
}

export const setDarkMode = ({ darkMode }: setDarkMode): ThunkType => {
  return async (dispatch, getState) => {
    dispatch({ type: SET_DARK_MODE, payload: { darkMode } })
  }
}
