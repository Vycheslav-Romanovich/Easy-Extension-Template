import {
  SET_NETFLIX_SUBS_LINKS,
  SET_VIDEO_WAS_PAUSED,
  SET_YOUTUBE_LANG_KEYS,
  SET_TRANSLATE_LANG_NAME,
  SET_CLOSE_POPUP_STATE,
  SET_COURSERA_SUBS_LINKS,
  SET_COURSERA_VIDEO_ID,
  SET_TRANSALTE_FROM_VIDEO,
  SET_PRACTICE_ROUND,
  SET_IS_FINISHED_PRACTICE,
  SET_PRACTICE_GAME_WORDS,
  SET_SERVICE_ACTIVE_TAB
} from '../../../../constants/constants'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'

import { SubsLinksType } from '../../../content/services/netflix'
import { ActiveServiceTab, AllVideoWords, WordVocabularyElement } from '../../../../constants/types'

export type actionsTypes =
  | netflixSubsLinksType
  | youtubeLangKeysType
  | videoWasPausedType
  | translateSubsLangNameType
  | closePopupStateType
  | courseraSubsLinksType
  | courseraVideoIdType
  | setVideoWordsTranslateType
  | setPracticeRoundType
  | setIsPracticeFinishedType
  | setPracticeGameWordsType
  | setActiveServiceTabType

type ThunkType = ThunkAction<Promise<void>, RootState, unknown, actionsTypes>

type netflixSubsLinks = {
  netflixSubsLinks: Array<SubsLinksType> | undefined
}

type netflixSubsLinksType = {
  type: typeof SET_NETFLIX_SUBS_LINKS
  payload: { netflixSubsLinks: Array<SubsLinksType> | undefined }
}

export const setNetflixSubsLinks = ({ netflixSubsLinks }: netflixSubsLinks): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_NETFLIX_SUBS_LINKS, payload: { netflixSubsLinks } })
  }
}

type courseraSubsLinksParam = {
  courseraSubsLinks: Array<SubsLinksType> | undefined
}

type courseraSubsLinksType = {
  type: typeof SET_COURSERA_SUBS_LINKS
  payload: { courseraSubsLinks: Array<SubsLinksType> | undefined }
}

export const setCourseraSubsLinks = ({ courseraSubsLinks }: courseraSubsLinksParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_COURSERA_SUBS_LINKS, payload: { courseraSubsLinks } })
  }
}

type youtubeLangKeys = {
  youTubeLangKeys: Array<SubsLinksType> | undefined
}

type youtubeLangKeysType = {
  type: typeof SET_YOUTUBE_LANG_KEYS
  payload: { youTubeLangKeys: Array<SubsLinksType> | undefined }
}

export const setYoutubeLangKeys = ({ youTubeLangKeys }: youtubeLangKeys): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_YOUTUBE_LANG_KEYS, payload: { youTubeLangKeys } })
  }
}

type videoWasPaused = {
  videoWasPaused: boolean
}

type videoWasPausedType = {
  type: typeof SET_VIDEO_WAS_PAUSED
  payload: { videoWasPaused: boolean }
}

export const setVideoWasPaused = ({ videoWasPaused }: videoWasPaused): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_VIDEO_WAS_PAUSED, payload: { videoWasPaused } })
  }
}

//translate subs lang name
type translateSubsLangNameParam = {
  translateSubsLangName: string
}

type translateSubsLangNameType = {
  type: typeof SET_TRANSLATE_LANG_NAME
  payload: { translateSubsLangName: string }
}

export const setTranlateSubsLangName = ({ translateSubsLangName }: translateSubsLangNameParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_TRANSLATE_LANG_NAME, payload: { translateSubsLangName } })
  }
}

//closePopupState
type closePopupStateParam = {
  isPopupShowed: boolean
}

type closePopupStateType = {
  type: typeof SET_CLOSE_POPUP_STATE
  payload: { isPopupShowed: boolean }
}

export const setClosePopupState = ({ isPopupShowed }: closePopupStateParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_CLOSE_POPUP_STATE, payload: { isPopupShowed } })
  }
}

//closePopupState
type courseraVideoIdParam = {
  courseraVideoId: string
}

type courseraVideoIdType = {
  type: typeof SET_COURSERA_VIDEO_ID
  payload: { courseraVideoId: string }
}

export const setCourseraVideoId = ({ courseraVideoId }: courseraVideoIdParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_COURSERA_VIDEO_ID, payload: { courseraVideoId } })
  }
}

//translate words from video
type setVideoWordsTranslateParam = {
  videoWords: AllVideoWords
}

type setVideoWordsTranslateType = {
  type: typeof SET_TRANSALTE_FROM_VIDEO
  payload: { videoWords: AllVideoWords }
}

export const setVideoWordsTranslate = ({ videoWords }: setVideoWordsTranslateParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_TRANSALTE_FROM_VIDEO, payload: { videoWords } })
  }
}

//round of practice
type setPracticeRoundParam = {
  practiceRound: number;
}

type setPracticeRoundType = {
  type: typeof SET_PRACTICE_ROUND
  payload: { practiceRound: number }
}

export const setPracticeRound = ({ practiceRound }: setPracticeRoundParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_PRACTICE_ROUND, payload: { practiceRound } })
  }
}

//is finished practice
type setIsPracticeFinishedParam = {
  isFinishedPractice: boolean;
}

type setIsPracticeFinishedType = {
  type: typeof SET_IS_FINISHED_PRACTICE
  payload: { isFinishedPractice: boolean }
}

export const setIsFinishedPractice = ({ isFinishedPractice }: setIsPracticeFinishedParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_IS_FINISHED_PRACTICE, payload: { isFinishedPractice } })
  }
}

// copy of words in Game practice
type setPracticeGameWordsParam = {
  practiceGameWords: Array<WordVocabularyElement>;
}

type setPracticeGameWordsType = {
  type: typeof SET_PRACTICE_GAME_WORDS
  payload: { practiceGameWords:  Array<WordVocabularyElement> }
}

export const setPracticeGameWords = ({ practiceGameWords }: setPracticeGameWordsParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_PRACTICE_GAME_WORDS, payload: { practiceGameWords } })
  }
}

// copy of words in Game practice
type setActiveServiceTabParam = {
  activeTab: ActiveServiceTab;
}

type setActiveServiceTabType = {
  type: typeof SET_SERVICE_ACTIVE_TAB
  payload: { activeTab:  ActiveServiceTab }
}

export const setActiveServiceTab = ({ activeTab }: setActiveServiceTabParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SERVICE_ACTIVE_TAB, payload: { activeTab } })
  }
}
