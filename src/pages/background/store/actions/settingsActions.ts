import {
  SET_ALWAYS_SHOW_TRANSLATION_ON_YT,
  SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX,
  SET_AUTO_PAUSE,
  SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX,
  SET_EXTENSION_SHOWN,
  SET_LEARNING_LANG,
  SET_LOCAL_LANG,
  SET_SEARCH_WITH_SUBTITLES,
  SET_SUBTITLE_COLOR_ON_YT,
  SET_SUBTITLE_COLOR_ON_NETFLIX,
  SET_SUBTITLE_FONT_SIZE_ON_YT,
  SET_SUBTITLE_FONT_SIZE_ON_NETFLIX,
  SET_WAY_TO_OPEN_TEXT_TRANSLATION,
  SET_OFF_EXTENSION,
  SET_BACKGROUND_SUB_ON_YT,
  SET_BACKGROUND_SUB_ON_NETFLIX,
  SET_SUBS_SHOWN_0N_NETFLIX,
  SET_DARK_MODE_IN_YOUTUBE,
  SET_POSITION_ON_BOARDING,
  SET_NETFLIX_FOCUS,
  SET_FOCUS_YT,
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
  SET_TRANSLATE_HISTORY,
  SET_PRACTICE_TRANSLATE_HISTORY,
  SET_OPEN_PRACTISE,
  SET_RANDOM_AB,
} from '../../../../constants/constants'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { SubtitleColors, WayToOpenTextTranslation, SettingsAccountType, WordHistoryElement } from '../../../../constants/types'
import { getSettingsAccount } from '../../helpers/firebase'
import { generateGeneralWordArray, generateWordArr } from '../../../../utils/normalizeTerm'
import { getAuth, User } from 'firebase/auth'
import { getDatabase, ref, update } from 'firebase/database'
import { app } from '../../index'

export type actionsTypes =
  | setExtensionShownActionType
  | setExpandCaptionsWrapperOnNetflixActionType
  | setLearningLangActionType
  | setLocalLangActionType
  | setAutoPauseActionType
  | setSubtitleFontSizeOnYtType
  | setSubtitleFontSizeOnNetflixType
  | setSubtitleColorOnNetflixType
  | setSubtitleColorOnYtType
  | setWayToOpenTextTranslationType
  | setAlwaysShowTranslationOnYtType
  | setAlwaysShowTranslationOnNetflixType
  | setSearchWithSubtitlesType
  | setOffExtensionType
  | setBackgroundSubOnYtType
  | setBackgroundSubOnNetflixType
  | setSubsShowOnNetflixActionType
  | setDarkModeInYoutubeType
  | setPositionOnBoardingType
  | setIsNetflixVideoHasFocusType
  | setIsFocusOnYtType
  | showTargetLanguagesType
  | setTextLocalLangActionType
  | setSubsShowOnYtActionType
  | setFullScreenOnNetflixActionType
  | setInterfaceLangActionType
  | setGamePopupActionType
  | updateSettingsAccountType
  | checkMyWordsInstallAccountType
  | setSettingsYouTubeShownActionType
  | setExpandCaptionsWrapperOnYtActionType
  | setBackgroundSubOnCourseraType
  | setSubtitleFontSizeOnCoursoraType
  | setSubtitleColorOnCouseraType
  | setAlwaysShowTranslationOnCourseraType
  | setIsCourseraVideoHasFocusType
  | setSubsShowOnCourseraActionType
  | setLangErrorsActionType
  | setOpenPractiseActionType
  | setPracticeTranslateHistoryActionType
  | setTranslateHistoryActionType
  | setRandomABType
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, actionsTypes>

// Set extension shown
type setExtensionShownParameters = {
  extensionShown: boolean
}

type setExtensionShownActionType = {
  type: typeof SET_EXTENSION_SHOWN
  payload: { extensionShown: boolean }
}

export const setExtensionShown = ({ extensionShown }: setExtensionShownParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_EXTENSION_SHOWN, payload: { extensionShown } })
  }
}

// Set subs and voc show
type setSubsShowOnNetflixParameters = {
  subsShowOnNetflix: boolean
}

type setSubsShowOnNetflixActionType = {
  type: typeof SET_SUBS_SHOWN_0N_NETFLIX
  payload: { subsShowOnNetflix: boolean }
}

export const setSubsShowOnNetflix = ({ subsShowOnNetflix }: setSubsShowOnNetflixParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBS_SHOWN_0N_NETFLIX, payload: { subsShowOnNetflix } })
  }
}

// Set subs and voc show at youtube
type setSubsShowOnYtParameters = {
  subsShowOnYt: boolean
}

type setSubsShowOnYtActionType = {
  type: typeof SET_SUBS_SHOWN_ON_YT
  payload: { subsShowOnYt: boolean }
}

export const setSubsShowOnYt = ({ subsShowOnYt }: setSubsShowOnYtParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBS_SHOWN_ON_YT, payload: { subsShowOnYt } })
  }
}

// Set captions wrapper longer or shorter version on Netflix
type setExpandCaptionsWrapperParametersOnNetflix = {
  expandCaptionsWrapperOnNetflix: boolean
}

type setExpandCaptionsWrapperOnNetflixActionType = {
  type: typeof SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX
  payload: { expandCaptionsWrapperOnNetflix: boolean }
}

export const setExpandCaptionsWrapperParametersOnNetflix = ({
  expandCaptionsWrapperOnNetflix,
}: setExpandCaptionsWrapperParametersOnNetflix): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX, payload: { expandCaptionsWrapperOnNetflix } })
  }
}

type setSettingsShownParameters = {
  settingsYouTubeShown: boolean
}

type setSettingsYouTubeShownActionType = {
  type: typeof SET_SETTINGS_YOUTUBE_SHOWN
  payload: { settingsYouTubeShown: boolean }
}

export const setSettingsShown = ({ settingsYouTubeShown }: setSettingsShownParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SETTINGS_YOUTUBE_SHOWN, payload: { settingsYouTubeShown } })
  }
}

// Set captions wrapper longer or shorter version on Yt
type setExpandCaptionsWrapperParametersOnYt = {
  expandCaptionsWrapperOnYt: boolean
}

type setExpandCaptionsWrapperOnYtActionType = {
  type: typeof SET_EXPAND_CAPTIONS_WRAPPER_ON_YT
  payload: { expandCaptionsWrapperOnYt: boolean }
}

export const setExpandCaptionsWrapperParametersOnYt = ({
  expandCaptionsWrapperOnYt,
}: setExpandCaptionsWrapperParametersOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_EXPAND_CAPTIONS_WRAPPER_ON_YT, payload: { expandCaptionsWrapperOnYt } })
  }
}

// Set learning lang
type setLearningLangParameters = {
  learningLang: string
}

type setLearningLangActionType = {
  type: typeof SET_LEARNING_LANG
  payload: { learningLang: string }
}

export const setLearningLang = ({ learningLang }: setLearningLangParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_LEARNING_LANG, payload: { learningLang } })

    const user = getAuth(app).currentUser as User
    if (user) {
      const database = getDatabase();
      update(ref(database, `users/${user.uid}/settings`),{ learningLang: learningLang })
    }
  }
}

// Set local lang
type setLocalLangParameters = {
  localLang: string
}

type setLocalLangActionType = {
  type: typeof SET_LOCAL_LANG
  payload: { localLang: string }
}

export const setLocalLang = ({ localLang }: setLocalLangParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_LOCAL_LANG, payload: { localLang } })

    const user = getAuth(app).currentUser as User
    if (user) {
      const database = getDatabase();
      update(ref(database, `users/${user.uid}/settings`),{ localLang: localLang })
    }
  }
}

// Set interface lang
type setInterfaceLangParameters = {
  interfaceLang: string
}

type setInterfaceLangActionType = {
  type: typeof SET_INTERFACE_LANG
  payload: { interfaceLang: string }
}

export const setInterfaceLang = ({ interfaceLang }: setInterfaceLangParameters): ThunkType => {
  return async (dispatch) => {
    const user = getAuth(app).currentUser as User
    if (user) {
      const database = getDatabase();
      update(ref(database, `users/${user.uid}/settings`),{ interfaceLang: interfaceLang })

      dispatch({ type: SET_INTERFACE_LANG, payload: { interfaceLang } })
    }
  }
}

// Set autoPause lang
type setAutoPauseParameters = {
  autoPauseOnHover: boolean
}

type setAutoPauseActionType = {
  type: typeof SET_AUTO_PAUSE
  payload: { autoPauseOnHover: boolean }
}

export const setAutoPause = ({ autoPauseOnHover }: setAutoPauseParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_AUTO_PAUSE, payload: { autoPauseOnHover } })
  }
}

// Set search with subtitles
type setSearchWithSubtitles = {
  searchWithSubtitles: boolean
}

type setSearchWithSubtitlesType = {
  type: typeof SET_SEARCH_WITH_SUBTITLES
  payload: { searchWithSubtitles: boolean }
}

export const setSearchWithSubtitles = ({ searchWithSubtitles }: setSearchWithSubtitles): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SEARCH_WITH_SUBTITLES, payload: { searchWithSubtitles } })
  }
}

// Set setSubtitleFontSize on Yt
type setSubtitleFontSizeOnYt = {
  subtitleFontSizeOnYt: number
}

type setSubtitleFontSizeOnYtType = {
  type: typeof SET_SUBTITLE_FONT_SIZE_ON_YT
  payload: { subtitleFontSizeOnYt: number }
}

export const setSubtitleFontSizeOnYt = ({ subtitleFontSizeOnYt }: setSubtitleFontSizeOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_FONT_SIZE_ON_YT, payload: { subtitleFontSizeOnYt } })
  }
}

// Set setSubtitleFontSize on Netflix
type setSubtitleFontSizeOnNetflix = {
  subtitleFontSizeOnNetflix: number
}

type setSubtitleFontSizeOnNetflixType = {
  type: typeof SET_SUBTITLE_FONT_SIZE_ON_NETFLIX
  payload: { subtitleFontSizeOnNetflix: number }
}

export const setSubtitleFontSizeOnNetflix = ({ subtitleFontSizeOnNetflix }: setSubtitleFontSizeOnNetflix): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_FONT_SIZE_ON_NETFLIX, payload: { subtitleFontSizeOnNetflix } })
  }
}

// Set subtitleColor on Yt
type setSubtitleColorOnYt = {
  subtitleColorOnYt: SubtitleColors
}

type setSubtitleColorOnYtType = {
  type: typeof SET_SUBTITLE_COLOR_ON_YT
  payload: { subtitleColorOnYt: SubtitleColors }
}

export const setSubtitleColorOnYt = ({ subtitleColorOnYt }: setSubtitleColorOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_COLOR_ON_YT, payload: { subtitleColorOnYt } })
  }
}

// Set subtitleColor on Netflix
type setSubtitleColorOnNetflix = {
  subtitleColorOnNetflix: SubtitleColors
}

type setSubtitleColorOnNetflixType = {
  type: typeof SET_SUBTITLE_COLOR_ON_NETFLIX
  payload: { subtitleColorOnNetflix: SubtitleColors }
}

export const setSubtitleColorOnNetflix = ({ subtitleColorOnNetflix }: setSubtitleColorOnNetflix): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_COLOR_ON_NETFLIX, payload: { subtitleColorOnNetflix } })
  }
}

// Off Extension
type setOffExtension = {
  offExtension: boolean
}

type setOffExtensionType = {
  type: typeof SET_OFF_EXTENSION
  payload: { offExtension: boolean }
}

export const setOffExtension = ({ offExtension }: setOffExtension): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_OFF_EXTENSION, payload: { offExtension } })
  }
}

export const setOffExtensionFromStorage = (): ThunkType => {
  return async (dispatch) => {
    chrome.storage.sync.get(['offExtension'], (setting) => {
      if (setting.offExtension === undefined) {
        dispatch({ type: SET_OFF_EXTENSION, payload: { offExtension: true } })
      } else {
        dispatch({ type: SET_OFF_EXTENSION, payload: { offExtension: setting.offExtension } })
      }
    })
  }
}

// Set subtitleColor
type setWayToOpenTextTranslation = {
  wayToOpenTextTranslation: WayToOpenTextTranslation
}

type setWayToOpenTextTranslationType = {
  type: typeof SET_WAY_TO_OPEN_TEXT_TRANSLATION
  payload: { wayToOpenTextTranslation: WayToOpenTextTranslation }
}

export const setWayToOpenTextTranslation = ({ wayToOpenTextTranslation }: setWayToOpenTextTranslation): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_WAY_TO_OPEN_TEXT_TRANSLATION, payload: { wayToOpenTextTranslation } })
  }
}

// Set DoubleSubtitle On YT
type setAlwaysShowTranslationOnYt = {
  alwaysShowTranslationOnYt: boolean
}

type setAlwaysShowTranslationOnYtType = {
  type: typeof SET_ALWAYS_SHOW_TRANSLATION_ON_YT
  payload: { alwaysShowTranslationOnYt: boolean }
}

export const setAlwaysShowTranslationOnYt = ({ alwaysShowTranslationOnYt }: setAlwaysShowTranslationOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_ALWAYS_SHOW_TRANSLATION_ON_YT, payload: { alwaysShowTranslationOnYt } })
  }
}

// Set DoubleSubtitle On Netflix
type setAlwaysShowTranslationOnNetflix = {
  alwaysShowTranslationOnNetflix: boolean
}

type setAlwaysShowTranslationOnNetflixType = {
  type: typeof SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX
  payload: { alwaysShowTranslationOnNetflix: boolean }
}

export const setAlwaysShowTranslationOnNetflix = ({ alwaysShowTranslationOnNetflix }: setAlwaysShowTranslationOnNetflix): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX, payload: { alwaysShowTranslationOnNetflix } })
  }
}

//background sub on Yt
type setBackgroundSubOnYt = {
  backgroundSubOnYt: boolean
}

type setBackgroundSubOnYtType = {
  type: typeof SET_BACKGROUND_SUB_ON_YT
  payload: { backgroundSubOnYt: boolean }
}

export const setBackgroundSubOnYt = ({ backgroundSubOnYt }: setBackgroundSubOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_BACKGROUND_SUB_ON_YT, payload: { backgroundSubOnYt } })
  }
}

//background sub on Netflix
type setBackgroundSubOnNetflix = {
  backgroundSubOnNetflix: boolean
}

type setBackgroundSubOnNetflixType = {
  type: typeof SET_BACKGROUND_SUB_ON_NETFLIX
  payload: { backgroundSubOnNetflix: boolean }
}

export const setBackgroundSubOnNetflix = ({ backgroundSubOnNetflix }: setBackgroundSubOnNetflix): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_BACKGROUND_SUB_ON_NETFLIX, payload: { backgroundSubOnNetflix } })
  }
}

// darkMode in Youtube
type setDarkModeInYoutube = {
  isDarkModeInYoutube: boolean
}

type setDarkModeInYoutubeType = {
  type: typeof SET_DARK_MODE_IN_YOUTUBE
  payload: { isDarkModeInYoutube: boolean }
}

export const setDarkModeInYoutube = ({ isDarkModeInYoutube }: setDarkModeInYoutube): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_DARK_MODE_IN_YOUTUBE, payload: { isDarkModeInYoutube } })
  }
}

// position OnBoarding
type setPositionOnBoarding = {
  positionOnBoarding: number
}

type setPositionOnBoardingType = {
  type: typeof SET_POSITION_ON_BOARDING
  payload: { positionOnBoarding: number }
}

export const setPositionOnBoarding = ({ positionOnBoarding }: setPositionOnBoarding): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_POSITION_ON_BOARDING, payload: { positionOnBoarding } })
  }
}

// netflix has focus
type setIsNetflixVideoHasFocus = {
  isNetflixVideoHasFocus: boolean
}

type setIsNetflixVideoHasFocusType = {
  type: typeof SET_NETFLIX_FOCUS
  payload: { isNetflixVideoHasFocus: boolean }
}
export const setIsNetflixVideoHasFocus = ({ isNetflixVideoHasFocus }: setIsNetflixVideoHasFocus): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_NETFLIX_FOCUS, payload: { isNetflixVideoHasFocus } })
  }
}

// yt has focus
type setIsFocusOnYt = {
  isYtVideoHasFocus: boolean
}

type setIsFocusOnYtType = {
  type: typeof SET_FOCUS_YT
  payload: { isYtVideoHasFocus: boolean }
}
export const setIsFocusOnYt = ({ isYtVideoHasFocus }: setIsFocusOnYt): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_FOCUS_YT, payload: { isYtVideoHasFocus } })
  }
}

type showTargetLanguages = {
  showTargetLanguages: boolean
}

type showTargetLanguagesType = {
  type: typeof SHOW_TARGET_LANUAGES
  payload: { showTargetLanguages: boolean }
}

export const setShowTargetLanguages = ({ showTargetLanguages }: showTargetLanguages): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SHOW_TARGET_LANUAGES, payload: { showTargetLanguages } })
  }
}

// Set TEXT local lang
type setTextLocalLangParameters = {
  textLocalLang: string
}

type setTextLocalLangActionType = {
  type: typeof SET_TEXT_LOCAL_LANG
  payload: { textLocalLang: string }
}

export const setTextLocalLang = ({ textLocalLang }: setTextLocalLangParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_TEXT_LOCAL_LANG, payload: { textLocalLang } })
  }
}

// Set full screen on Netflix
type setFullScreenOnNetflixParameters = {
  isFullScreenOnNetflix: boolean
}

type setFullScreenOnNetflixActionType = {
  type: typeof SET_FULLSCREEN_ON_NETFLIX
  payload: { isFullScreenOnNetflix: boolean }
}

export const setFullScreenOnNetflix = ({ isFullScreenOnNetflix }: setFullScreenOnNetflixParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_FULLSCREEN_ON_NETFLIX, payload: { isFullScreenOnNetflix } })
  }
}


// Set MyWords popup State
type setGamePopupParameters = {
  gamePopupShowLink: string
}

type setGamePopupActionType = {
  type: typeof SET_MYWORDS_POPUP_STATE
  payload: { gamePopupShowLink: string }
}

export const setGamePopupShowed = ({ gamePopupShowLink }: setGamePopupParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_MYWORDS_POPUP_STATE, payload: { gamePopupShowLink } })
  }
}

type updateSettingsAccountType = {
  type: typeof UPDATE_SETTINGS_ACCOUNT
  payload: { settings: SettingsAccountType }
};

export const updateSettingsAccount = (): ThunkType => {
  return async (dispatch) => {
    const settings = await getSettingsAccount();

    dispatch({ type: UPDATE_SETTINGS_ACCOUNT, payload: { settings } });
  };
};

type checkMyWordsInstallAccountType = {
  type: typeof CHECK_MYWORDS_INSTALL
  payload: { isGameInstall: boolean }
};

export const checkMyWordsInstall = (isGameInstall: boolean): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: CHECK_MYWORDS_INSTALL, payload: { isGameInstall } });
  };
};


//background sub on Coursera
type setBackgroundSubOnCourseraParams = {
  backgroundSubOnCoursera: boolean
}

type setBackgroundSubOnCourseraType = {
  type: typeof SET_BACKGROUND_SUB_ON_COURSERA
  payload: { backgroundSubOnCoursera: boolean }
}

export const setBackgroundSubOnCoursera = ({ backgroundSubOnCoursera }: setBackgroundSubOnCourseraParams): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_BACKGROUND_SUB_ON_COURSERA, payload: { backgroundSubOnCoursera } })
  }
}

// Set setSubtitleFontSize on Coursora
type setSubtitleFontSizeOnCoursoraParams = {
  subtitleFontSizeOnCoursera: number
}

type setSubtitleFontSizeOnCoursoraType = {
  type: typeof SET_SUBTITLE_FONT_SIZE_ON_COURSERA
  payload: { subtitleFontSizeOnCoursera: number }
}

export const setSubtitleFontSizeOnCoursera = ({ subtitleFontSizeOnCoursera }: setSubtitleFontSizeOnCoursoraParams): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_FONT_SIZE_ON_COURSERA, payload: { subtitleFontSizeOnCoursera } })
  }
}

// Set subtitleColor on Coursera
type setSubtitleColorOnCouseraParam = {
  subtitleColorOnCoursera: SubtitleColors
}

type setSubtitleColorOnCouseraType = {
  type: typeof SET_SUBTITLE_COLOR_ON_CURSORA
  payload: { subtitleColorOnCoursera: SubtitleColors }
}

export const setSubtitleColorOnCousera = ({ subtitleColorOnCoursera }: setSubtitleColorOnCouseraParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBTITLE_COLOR_ON_CURSORA, payload: { subtitleColorOnCoursera } })
  }
}

// Set DoubleSubtitle On Coursera
type setAlwaysShowTranslationOnCourseraParam = {
  alwaysShowTranslationOnCoursera: boolean
}

type setAlwaysShowTranslationOnCourseraType = {
  type: typeof SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA
  payload: { alwaysShowTranslationOnCoursera: boolean }
}

export const setAlwaysShowTranslationOnCoursera = ({ alwaysShowTranslationOnCoursera }: setAlwaysShowTranslationOnCourseraParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA, payload: { alwaysShowTranslationOnCoursera } })
  }
}

//coursera has focus
type setIsCourseraVideoHasFocusParam = {
  isCourseraVideoHasFocus: boolean
}

type setIsCourseraVideoHasFocusType = {
  type: typeof SET_COURSERA_FOCUS
  payload: { isCourseraVideoHasFocus: boolean }
}

export const setIsCourseraVideoHasFocus = ({ isCourseraVideoHasFocus }: setIsCourseraVideoHasFocusParam): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_COURSERA_FOCUS, payload: { isCourseraVideoHasFocus } })
  }
}

// Set subs and voc show coursera
type setSubsShowOnCourseraParameters = {
  subsShowOnCoursera: boolean
}

type setSubsShowOnCourseraActionType = {
  type: typeof SET_SUBS_SHOWN_0N_COURSERA
  payload: { subsShowOnCoursera: boolean }
}

export const setSubsShowOnCoursera = ({ subsShowOnCoursera }: setSubsShowOnCourseraParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_SUBS_SHOWN_0N_COURSERA, payload: { subsShowOnCoursera } })
  }
}

// Set languages error
type setLangErrorsParameters = {
  langErrors: boolean
}

type setLangErrorsActionType = {
  type: typeof SET_LANGUAGES_ERROR
  payload: { langErrors: boolean }
}

export const setLangErrors = ({ langErrors }: setLangErrorsParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_LANGUAGES_ERROR, payload: { langErrors } })
  }
}

type setOpenPractiseParameters = {
  isOpenPractise: boolean
}

type setOpenPractiseActionType = {
  type: typeof SET_OPEN_PRACTISE
  payload: { isOpenPractise: boolean }
}

export const setOpenPractise = ({ isOpenPractise }: setOpenPractiseParameters): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_OPEN_PRACTISE, payload: { isOpenPractise } })
  }
}

export type HistoryObj = { [key: string]: WordHistoryElement };

type setPracticeTranslateHistoryActionType = {
  type: typeof SET_PRACTICE_TRANSLATE_HISTORY
  payload: { practiceHistoryData: WordHistoryElement[] }
}

type setTranslateHistoryActionType = {
  type: typeof SET_TRANSLATE_HISTORY
  payload: { translateHistoryData: WordHistoryElement[] }
}

export const setPracticeTranslateHistory = (data: HistoryObj | {[key: string] : Array<WordHistoryElement>}): ThunkType => {
  return async (dispatch) => {
    let practiceHistoryData: WordHistoryElement[];
    if (data) {
      practiceHistoryData = generateWordArr(data) as WordHistoryElement[];
    } else {
      practiceHistoryData = [];
    }
    dispatch({ type: SET_PRACTICE_TRANSLATE_HISTORY, payload: { practiceHistoryData} })
  }
}

export const setTranslateHistory = (data: HistoryObj): ThunkType => {
  return async (dispatch) => {
    let translateHistoryData: WordHistoryElement[];
    if (data) {
      translateHistoryData = generateGeneralWordArray(data) as WordHistoryElement[];
    } else {
      translateHistoryData = [];
    }

    dispatch({ type: SET_TRANSLATE_HISTORY, payload: { translateHistoryData } })
  }
}

type setRandomABType = {
  type: typeof SET_RANDOM_AB
  payload: { randomAB: number }
}

export const setRandomAB = ( randomAB : number): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_RANDOM_AB, payload: { randomAB } })
  }
}
