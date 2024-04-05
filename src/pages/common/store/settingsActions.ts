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
  SET_BACKGROUND_SUB_ON_YT,
  SET_BACKGROUND_SUB_ON_NETFLIX,
  SET_OFF_EXTENSION,
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
  SET_SETTINGS_YOUTUBE_SHOWN,
  SET_EXPAND_CAPTIONS_WRAPPER_ON_YT,
  SET_BACKGROUND_SUB_ON_COURSERA,
  SET_SUBTITLE_FONT_SIZE_ON_COURSERA,
  SET_SUBTITLE_COLOR_ON_CURSORA,
  SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA,
  SET_COURSERA_FOCUS,
  SET_SUBS_SHOWN_0N_COURSERA,
  SET_LANGUAGES_ERROR,
  SET_PRACTICE_TRANSLATE_HISTORY,
  SET_OPEN_PRACTISE,
  SET_RANDOM_AB,
} from '../../../constants/constants'
import { SubtitleColors, WayToOpenTextTranslation, WordHistoryElement } from '../../../constants/types'

export function setBackgroundSubOnYt(backgroundSubOnYt: boolean) {
  return {
    type: SET_BACKGROUND_SUB_ON_YT,
    backgroundSubOnYt,
  }
}

export function setExpandCaptionsWrapperOnYt(expandCaptionsWrapperOnYt: boolean) {
  return {
    type: SET_EXPAND_CAPTIONS_WRAPPER_ON_YT,
    expandCaptionsWrapperOnYt,
  }
}

export function setBackgroundSubOnNetflix(backgroundSubOnNetflix: boolean) {
  return {
    type: SET_BACKGROUND_SUB_ON_NETFLIX,
    backgroundSubOnNetflix,
  }
}

export function setExtensionShown(extensionShown: boolean) {
  return {
    type: SET_EXTENSION_SHOWN,
    extensionShown,
  }
}

export function setSubsShowOnNetflix(subsShowOnNetflix: boolean) {
  return {
    type: SET_SUBS_SHOWN_0N_NETFLIX,
    subsShowOnNetflix,
  }
}

export function setSubsShowOnYt(subsShowOnYt: boolean) {
  return {
    type: SET_SUBS_SHOWN_ON_YT,
    subsShowOnYt,
  }
}

export function setFullScreenOnNetflix(isFullScreenOnNetflix: boolean) {
  return {
    type: SET_FULLSCREEN_ON_NETFLIX,
    isFullScreenOnNetflix,
  }
}

export function setExpandCaptionsWrapperOnNetflix(expandCaptionsWrapperOnNetflix: boolean) {
  return {
    type: SET_EXPAND_CAPTIONS_WRAPPER_ON_NETFLIX,
    expandCaptionsWrapperOnNetflix,
  }
}

export function setLearningLang(learningLang: string) {
  return {
    type: SET_LEARNING_LANG,
    learningLang,
  }
}

export function setLocalLang(localLang: string) {
  return {
    type: SET_LOCAL_LANG,
    localLang,
  }
}

export function setInterfaceLang(interfaceLang: string) {
  return {
    type: SET_INTERFACE_LANG,
    interfaceLang,
  }
}

export function setTextLocalLang(textLocalLang: string) {
  return {
    type: SET_TEXT_LOCAL_LANG,
    textLocalLang,
  }
}

export function setAutoPause(autoPauseOnHover: boolean) {
  return {
    type: SET_AUTO_PAUSE,
    autoPauseOnHover,
  }
}

export function setSearchWithSubtitles(searchWithSubtitles: boolean) {
  return {
    type: SET_SEARCH_WITH_SUBTITLES,
    searchWithSubtitles,
  }
}

export function setSubtitleFontSizeOnYt(subtitleFontSizeOnYt: number) {
  return {
    type: SET_SUBTITLE_FONT_SIZE_ON_YT,
    subtitleFontSizeOnYt,
  }
}

export function setSubtitleFontSizeOnNetflix(subtitleFontSizeOnNetflix: number) {
  return {
    type: SET_SUBTITLE_FONT_SIZE_ON_NETFLIX,
    subtitleFontSizeOnNetflix,
  }
}

export function setSubtitleColorOnYt(subtitleColorOnYt: SubtitleColors) {
  return {
    type: SET_SUBTITLE_COLOR_ON_YT,
    subtitleColorOnYt,
  }
}

export function setSubtitleColorOnNetflix(subtitleColorOnNetflix: SubtitleColors) {
  return {
    type: SET_SUBTITLE_COLOR_ON_NETFLIX,
    subtitleColorOnNetflix,
  }
}

export function setWayToOpenTextTranslation(wayToOpenTextTranslation: WayToOpenTextTranslation) {
  return {
    type: SET_WAY_TO_OPEN_TEXT_TRANSLATION,
    wayToOpenTextTranslation,
  }
}

export function setAlwaysShowTranslationOnYt(alwaysShowTranslationOnYt: boolean) {
  return {
    type: SET_ALWAYS_SHOW_TRANSLATION_ON_YT,
    alwaysShowTranslationOnYt,
  }
}

export function setAlwaysShowTranslationOnNetflix(alwaysShowTranslationOnNetflix: boolean) {
  return {
    type: SET_ALWAYS_SHOW_TRANSLATION_ON_NETFLIX,
    alwaysShowTranslationOnNetflix,
  }
}

export function setOffExtension(offExtension: boolean) {
  return {
    type: SET_OFF_EXTENSION,
    offExtension,
  }
}

export function setDarkModeInYoutube(isDarkModeInYoutube: boolean) {
  return {
    type: SET_DARK_MODE_IN_YOUTUBE,
    isDarkModeInYoutube,
  }
}

export function setPositionOnBoarding(positionOnBoarding: number) {
  return {
    type: SET_POSITION_ON_BOARDING,
    positionOnBoarding,
  }
}

export function setIsNetflixVideoHasFocus(isNetflixVideoHasFocus: boolean) {
  return {
    type: SET_NETFLIX_FOCUS,
    isNetflixVideoHasFocus,
  }
}

export function setIsFocusOnYt(isYtVideoHasFocus: boolean) {
  return {
    type: SET_FOCUS_YT,
    isYtVideoHasFocus,
  }
}

export function setShowTargetLanguages(showTargetLanguages: boolean) {
  return {
    type: SHOW_TARGET_LANUAGES,
    showTargetLanguages,
  }
}

export function setGamePopupShowed(gamePopupShowLink: string) {
  return {
    type: SET_MYWORDS_POPUP_STATE,
    gamePopupShowLink,
  }
}

export function setSettingsYouTubeShown(settingsYouTubeShown: boolean) {
  return {
    type: SET_SETTINGS_YOUTUBE_SHOWN,
    settingsYouTubeShown,
  }
}

export const updateSettingsAccount = () => {
  return {
    type: UPDATE_SETTINGS_ACCOUNT
  }
};

export const setBackgroundSubOnCoursera = (backgroundSubOnCoursera: boolean) => {
  return {
    type: SET_BACKGROUND_SUB_ON_COURSERA,
    backgroundSubOnCoursera,
  }
}

export const setSubtitleFontSizeOnCoursera = (subtitleFontSizeOnCoursera: number) => {
  return {
    type: SET_SUBTITLE_FONT_SIZE_ON_COURSERA,
    subtitleFontSizeOnCoursera,
  }
}

export const setSubtitleColorOnCousera = (subtitleColorOnCoursera: SubtitleColors) => {
  return {
    type: SET_SUBTITLE_COLOR_ON_CURSORA,
    subtitleColorOnCoursera,
  }
}

export const setAlwaysShowTranslationOnCoursera = (alwaysShowTranslationOnCoursera: boolean) => {
  return {
    type: SET_ALWAYS_SHOW_TRANSLATION_ON_COURSERA,
    alwaysShowTranslationOnCoursera,
  }
}

export const setIsCourseraVideoHasFocus = (isCourseraVideoHasFocus: boolean) => {
  return {
    type: SET_COURSERA_FOCUS,
    isCourseraVideoHasFocus,
  }
}

export const setSubsShowOnCoursera = (subsShowOnCoursera: boolean) => {
  return {
    type: SET_SUBS_SHOWN_0N_COURSERA,
    subsShowOnCoursera,
  }
}

export const setLangErrors = (langErrors: boolean) => {
  return {
    type: SET_LANGUAGES_ERROR,
    langErrors,
  }
}

export const setOpenPractise = (isOpenPractise: boolean) => {
  return {
    type: SET_OPEN_PRACTISE,
    isOpenPractise,
  }
}

export const setPracticeTranslateHistory = (data: WordHistoryElement[]) => {
  return {
    type: SET_PRACTICE_TRANSLATE_HISTORY,
    data
  }
}

export function setRandomAB(randomAB: number) {
  return {
    type: SET_RANDOM_AB,
    randomAB,
  }
}