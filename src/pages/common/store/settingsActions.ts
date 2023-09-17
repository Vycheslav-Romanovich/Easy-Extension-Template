import { SET_DARK_MODE, SET_LANGUAGE } from '../../../constants/constants'
import { EDarkMode } from '../../../constants/types'

export function setLanguage(language: string) {
  return {
    type: SET_LANGUAGE,
    language,
  }
}

export function setDarkMode(darkMode: EDarkMode) {
  return {
    type: SET_DARK_MODE,
    darkMode,
  }
}
