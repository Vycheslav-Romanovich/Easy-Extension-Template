import { actionsTypes } from '../actions/settingsActions'
import {
  SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX,
  SET_ALWAYS_SHOW_TRANSLATION_ON_YT,
  SET_AUTO_PAUSE,
  SET_BACKGROUND_SUB_ON_NETFLIX,
  SET_BACKGROUND_SUB_ON_YT,
  SET_DARK_MODE_IN_YOUTUBE,
  SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX,
  SET_EXTENSION_SHOWN,
  SET_FOCUS_YT,
  SET_LEARNING_LANG,
  SET_LOCAL_LANG,
  SET_NETFLIX_FOCUS,
  SET_OFF_EXTENSION,
  SET_POSITION_ON_BOARDING,
  SET_SEARCH_WITH_SUBTITLES,
  SET_SUBS_SHOWN_0N_NETFLIX,
  SET_SUBTITLE_COLOR_ON_NETFLIX,
  SET_SUBTITLE_COLOR_ON_YT,
  SET_SUBTITLE_FONT_SIZE_ON_NETFLIX,
  SET_SUBTITLE_FONT_SIZE_ON_YT,
  SET_WAY_TO_OPEN_TEXT_TRANSLATION,
  SHOW_TARGET_LANUAGES,
  SET_TEXT_LOCAL_LANG,
  SET_SUBS_SHOWN_ON_YT,
  SET_FULLSCREEN_ON_NETFLIX,
  SET_INTERFACE_LANG,
  SET_MYWORDS_POPUP_STATE,
  UPDATE_SETTINGS_ACCOUNT,
  CHECK_MYWORDS_INSTALL,
  SET_SETTINGS_YOUTUBE_SHOWN,
  SET_EXPAND_CAPTIONS_WRAPPER_ON_YT,
  SET_BACKGROUND_SUB_ON_COURSERA,
  SET_SUBTITLE_FONT_SIZE_ON_COURSERA,
  SET_SUBTITLE_COLOR_ON_CURSORA,
  SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA,
  SET_COURSERA_FOCUS,
  SET_SUBS_SHOWN_0N_COURSERA,
  SET_LANGUAGES_ERROR,
  SET_OPEN_PRACTISE,
  SET_TRANSLATE_HISTORY,
  SET_PRACTICE_TRANSLATE_HISTORY,
  SET_RANDOM_AB
} from '../../../../constants/constants'
import { SubtitleColors, WayToOpenTextTranslation, WordHistoryElement } from '../../../../constants/types'

let localizationLanguage = chrome.i18n.getMessage('locale_code').toLowerCase() ?? 'en'
// localizationLanguage = localizationLanguage.substr(0, 2).toLowerCase()

const initialState = {
  extensionShown: true,
  subsShowOnNetflix: true,
  settingsYouTubeShown: false,
  subsShowOnYt: true,
  isFullScreenOnNetflix: false,
  alwaysShowTranslationOnYt: true,
  alwaysShowTranslationOnNetflix: true,
  expandCaptionsWrapperOnYt: false,
  expandCaptionsWrapperOnNetflix: false,
  wayToOpenTextTranslation: 'withButton' as WayToOpenTextTranslation,
  learningLang: 'en',
  localLang: 'en',
  searchWithSubtitles: false,
  subtitleFontSizeOnYt: 18,
  subtitleFontSizeOnNetflix: 18,
  subtitleColorOnYt: '#FFFFFF' as SubtitleColors,
  subtitleColorOnNetflix: '#FFFFFF' as SubtitleColors,
  autoPauseOnHover: false,
  offExtension: false,
  backgroundSubOnYt: true,
  backgroundSubOnNetflix: true,
  isDarkModeInYoutube: false,
  logoPopupShow: 'popup',
  positionOnBoarding: 0,
  randomAB: 0,
  isNetflixVideoHasFocus: true,
  isYtVideoHasFocus: false,
  showTargetLanguages: false,
  textLocalLang: localizationLanguage,
  interfaceLang: localizationLanguage,
  gamePopupShowLink: '',
  isGameInstall: false,
  backgroundSubOnCoursera: true,
  subtitleFontSizeOnCoursera: 18,
  subtitleColorOnCoursera: '#FFFFFF' as SubtitleColors,
  alwaysShowTranslationOnCoursera: true,
  isCourseraVideoHasFocus: false,
  subsShowOnCoursera: true,
  langErrors: false,
  isOpenPractise: true,
  practiceHistoryData: [] as WordHistoryElement[],
  translateHistoryData: [] as WordHistoryElement[],
}

export type SettingsStateType = typeof initialState

export default (state = initialState, action: actionsTypes): SettingsStateType => {
  switch (action.type) {
    case SET_BACKGROUND_SUB_ON_YT:
      return {
        ...state,
        backgroundSubOnYt: action.payload.backgroundSubOnYt,
      }
    case SET_BACKGROUND_SUB_ON_NETFLIX:
      return {
        ...state,
        backgroundSubOnNetflix: action.payload.backgroundSubOnNetflix,
      }
    case SET_SETTINGS_YOUTUBE_SHOWN:
      return {
        ...state,
        settingsYouTubeShown: action.payload.settingsYouTubeShown,
      }
    case SET_EXPAND_CAPTIONS_WRAPPER_ON_YT:
      return {
        ...state,
        expandCaptionsWrapperOnYt: action.payload.expandCaptionsWrapperOnYt,
      }
    case SET_EXTENSION_SHOWN:
      return {
        ...state,
        extensionShown: action.payload.extensionShown,
      }
    case SET_ALWAYS_SHOW_TRANSLATION_ON_YT:
      return {
        ...state,
        alwaysShowTranslationOnYt: action.payload.alwaysShowTranslationOnYt,
      }
    case SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX:
      return {
        ...state,
        alwaysShowTranslationOnNetflix: action.payload.alwaysShowTranslationOnNetflix,
      }
    case SET_SUBS_SHOWN_0N_NETFLIX:
      return {
        ...state,
        subsShowOnNetflix: action.payload.subsShowOnNetflix,
      }
    case SET_SUBS_SHOWN_ON_YT:
      return {
        ...state,
        subsShowOnYt: action.payload.subsShowOnYt,
      }
    case SET_FULLSCREEN_ON_NETFLIX:
      return {
        ...state,
        isFullScreenOnNetflix: action.payload.isFullScreenOnNetflix,
      }
    case SET_DARK_MODE_IN_YOUTUBE:
      return {
        ...state,
        isDarkModeInYoutube: action.payload.isDarkModeInYoutube,
      }
    case SET_AUTO_PAUSE:
      return {
        ...state,
        autoPauseOnHover: action.payload.autoPauseOnHover,
      }
    case SET_SEARCH_WITH_SUBTITLES:
      return {
        ...state,
        searchWithSubtitles: action.payload.searchWithSubtitles,
      }
    case SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX:
      return {
        ...state,
        expandCaptionsWrapperOnNetflix: action.payload.expandCaptionsWrapperOnNetflix,
      }
    case SET_LEARNING_LANG:
      return {
        ...state,
        learningLang: action.payload.learningLang,
      }
    case SET_LOCAL_LANG:
      return {
        ...state,
        localLang: action.payload.localLang,
      }
    case SET_INTERFACE_LANG:
      return {
        ...state,
        interfaceLang: action.payload.interfaceLang,
      }
    case SET_SUBTITLE_FONT_SIZE_ON_YT:
      return {
        ...state,
        subtitleFontSizeOnYt: action.payload.subtitleFontSizeOnYt,
      }
    case SET_SUBTITLE_FONT_SIZE_ON_NETFLIX:
      return {
        ...state,
        subtitleFontSizeOnNetflix: action.payload.subtitleFontSizeOnNetflix,
      }
    case SET_SUBTITLE_COLOR_ON_YT:
      return {
        ...state,
        subtitleColorOnYt: action.payload.subtitleColorOnYt,
      }
    case SET_SUBTITLE_COLOR_ON_NETFLIX:
      return {
        ...state,
        subtitleColorOnNetflix: action.payload.subtitleColorOnNetflix,
      }
    case SET_WAY_TO_OPEN_TEXT_TRANSLATION:
      return {
        ...state,
        wayToOpenTextTranslation: action.payload.wayToOpenTextTranslation,
      }
    case SET_OFF_EXTENSION:
      return {
        ...state,
        offExtension: action.payload.offExtension,
      }
    case SET_POSITION_ON_BOARDING:
      return {
        ...state,
        positionOnBoarding: action.payload.positionOnBoarding,
      }
    case SET_RANDOM_AB:
      return {
        ...state,
        randomAB: action.payload.randomAB,
      }
    case SET_NETFLIX_FOCUS:
      return {
        ...state,
        isNetflixVideoHasFocus: action.payload.isNetflixVideoHasFocus,
      }
    case SET_FOCUS_YT:
      return {
        ...state,
        isYtVideoHasFocus: action.payload.isYtVideoHasFocus,
      }
    case SHOW_TARGET_LANUAGES:
      return {
        ...state,
        showTargetLanguages: action.payload.showTargetLanguages,
      }
    case SET_TEXT_LOCAL_LANG:
      return {
        ...state,
        textLocalLang: action.payload.textLocalLang,
      }
    case SET_MYWORDS_POPUP_STATE:
      return {
        ...state,
        gamePopupShowLink: action.payload.gamePopupShowLink,
      }
    case UPDATE_SETTINGS_ACCOUNT:
      return {
        ...state,
        ...action.payload.settings,
      }
    case CHECK_MYWORDS_INSTALL:
      return {
        ...state,
        isGameInstall: action.payload.isGameInstall,
      }
    case SET_BACKGROUND_SUB_ON_COURSERA:
      return {
        ...state,
        backgroundSubOnCoursera: action.payload.backgroundSubOnCoursera,
      }
    case SET_SUBTITLE_FONT_SIZE_ON_COURSERA:
      return {
        ...state,
        subtitleFontSizeOnCoursera: action.payload.subtitleFontSizeOnCoursera,
      }
    case SET_SUBTITLE_COLOR_ON_CURSORA:
      return {
        ...state,
        subtitleColorOnCoursera: action.payload.subtitleColorOnCoursera,
      }
    case SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA:
      return {
        ...state,
        alwaysShowTranslationOnCoursera: action.payload.alwaysShowTranslationOnCoursera,
      }
    case SET_COURSERA_FOCUS:
      return {
        ...state,
        isCourseraVideoHasFocus: action.payload.isCourseraVideoHasFocus,
      }
    case SET_SUBS_SHOWN_0N_COURSERA:
      return {
        ...state,
        subsShowOnCoursera: action.payload.subsShowOnCoursera,
      }
    case SET_LANGUAGES_ERROR:
      return {
        ...state,
        langErrors: action.payload.langErrors,
      }
    case SET_OPEN_PRACTISE:
      return {
        ...state,
        isOpenPractise: action.payload.isOpenPractise,
      }
    case SET_PRACTICE_TRANSLATE_HISTORY:
      return {
        ...state,
        practiceHistoryData: action.payload.practiceHistoryData,
      }
    case SET_TRANSLATE_HISTORY:
      return {
        ...state,
        translateHistoryData: action.payload.translateHistoryData,
      }
    default:
      return state
  }
}
