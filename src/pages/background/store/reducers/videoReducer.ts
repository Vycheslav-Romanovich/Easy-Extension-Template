import { actionsTypes } from '../actions/videoActions'
import {
  ActiveServiceTab,
  AllVideoWords,
  Video,
  WordVocabularyElement,
} from '../../../../constants/types'
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
import { SubsLinksType } from '../../../content/services/netflix'

const initialState = {
  videos: [] as Array<Video>,
  pause: false,
  videoWasPaused: false as boolean,
  netflixSubsLinks: undefined as Array<SubsLinksType> | undefined,
  youTubeLangKeys: [] as Array<SubsLinksType> | undefined,
  translateSubsLangName: '',
  isPopupShowed: false,
  courseraSubsLinks: undefined as Array<SubsLinksType> | undefined,
  courseraVideoId: '',
  videoWords: {} as AllVideoWords,
  practiceRound: 0,
  isFinishedPractice: false,
  practiceGameWords: [] as Array<WordVocabularyElement>,
  activeTab: 'subtitles' as ActiveServiceTab
}

type InitialStateType = typeof initialState

export default (state = initialState, action: actionsTypes): InitialStateType => {
  switch (action.type) {
    case SET_NETFLIX_SUBS_LINKS:
      return {
        ...state,
        netflixSubsLinks: action.payload.netflixSubsLinks,
      }
    case SET_COURSERA_SUBS_LINKS:
      return {
        ...state,
        courseraSubsLinks: action.payload.courseraSubsLinks,
      }
    case SET_YOUTUBE_LANG_KEYS:
      return {
        ...state,
        youTubeLangKeys: action.payload.youTubeLangKeys,
      }
    case SET_VIDEO_WAS_PAUSED:
      return {
        ...state,
        videoWasPaused: action.payload.videoWasPaused,
      }
    case SET_TRANSLATE_LANG_NAME:
      return {
        ...state,
        translateSubsLangName: action.payload.translateSubsLangName,
      }
    case SET_CLOSE_POPUP_STATE:
      return {
        ...state,
        isPopupShowed: action.payload.isPopupShowed,
      }
    case SET_COURSERA_VIDEO_ID:
      return {
        ...state,
        courseraVideoId: action.payload.courseraVideoId,
      }
    case SET_TRANSALTE_FROM_VIDEO:
      return {
        ...state,
        videoWords: action.payload.videoWords,
      }
    case SET_PRACTICE_ROUND:
      return {
        ...state,
        practiceRound: action.payload.practiceRound,
      }
    case SET_IS_FINISHED_PRACTICE:
      return {
        ...state,
        isFinishedPractice: action.payload.isFinishedPractice,
      }
    case SET_PRACTICE_GAME_WORDS:
      return {
        ...state,
        practiceGameWords: action.payload.practiceGameWords
      }
    case SET_SERVICE_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload.activeTab
      }
    default:
      return state
  }
}
