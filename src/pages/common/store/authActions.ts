import {
  DELETE_ACCOUNT,
  SIGN_OUT,
  SET_FREE_DOUBLE_SUBS,
  SET_FREE_TRANSLATED,
  SET_LAST_TRANSLATED_WORD,
} from '../../../constants/constants'

export function signOutStore(isSignOutFromWeb?: boolean) {
  return {
    type: SIGN_OUT,
    isSignOutFromWeb
  }
}

export function deleteAccount() {
  return {
    type: DELETE_ACCOUNT,
  }
}

export function setFreeDoubleSubs(freeDoubleSubs: boolean) {
  return {
    type: SET_FREE_DOUBLE_SUBS,
    freeDoubleSubs,
  }
}

export function setFreeTranslated(freeTranslated: boolean) {
  return {
    type: SET_FREE_TRANSLATED,
    freeTranslated,
  }
}

export function setLastTranslatedWord(lastTranslatedWord: string) {
  return {
    type: SET_LAST_TRANSLATED_WORD,
    lastTranslatedWord,
  }
}
