import { actionsTypes } from '../actions/settingsActions'
import { SET_DARK_MODE, SET_LANGUAGE } from '../../../../constants/constants'
import { DarkModeType } from '../../../../constants/types'

let initialState = {
  language: chrome.i18n.getMessage('locale_code') ?? 'en',
  darkMode: DarkModeType.asSystem as DarkModeType,
}

export default (state = initialState, action: actionsTypes): typeof initialState => {
  switch (action.type) {
    case SET_LANGUAGE: {
      chrome.runtime.sendMessage({
        msg: 'language_update',
        data: {
          language: action.payload.language,
        },
      })

      return {
        ...state,
        language: action.payload.language,
      }
    }

    case SET_DARK_MODE: {
      return {
        ...state,
        darkMode: action.payload.darkMode,
      }
    }

    default:
      return state
  }
}
