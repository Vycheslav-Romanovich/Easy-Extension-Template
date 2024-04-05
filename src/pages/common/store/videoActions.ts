import {
  ActiveServiceTab,
  AllVideoWords,
  SubsLinksType,
  WordVocabularyElement,
} from '../../../constants/types'
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
} from '../../../constants/constants'
import { supportedLanguages } from '../../../constants/supportedLanguages'

export function setNetflixSubsLinks(netflixSubs: Array<SubsLinksType> | undefined) {
  const netflixSubsLinks = netflixSubs?.sort((item1, item2) => {
    if (item1.langName.toLowerCase() < item2.langName.toLowerCase()) return -1
    if (item1.langName.toLowerCase() > item2.langName.toLowerCase()) return 1
    return 0
  })
  return {
    type: SET_NETFLIX_SUBS_LINKS,
    netflixSubsLinks,
  }
}

export function setCourseraSubsLinks(courseraSubs: Array<SubsLinksType> | undefined) {
  const courseraSubsLinks = courseraSubs?.sort((item1, item2) => {
    if (item1.langName.toLowerCase() < item2.langName.toLowerCase()) return -1
    if (item1.langName.toLowerCase() > item2.langName.toLowerCase()) return 1
    return 0
  })
  return {
    type: SET_COURSERA_SUBS_LINKS,
    courseraSubsLinks,
  }
}

export function setVideoWasPaused(videoWasPaused: boolean) {
  return {
    type: SET_VIDEO_WAS_PAUSED,
    videoWasPaused,
  }
}

export function setTranlateSubsLangName(translateSubsLangName: string) {
  return {
    type: SET_TRANSLATE_LANG_NAME,
    translateSubsLangName,
  }
}

export function setYoutubeLangKeys(interfaceLang: string) {
  const youTubeLangKeys: Array<SubsLinksType> | undefined = Object.keys(supportedLanguages)
    .map((el: any) => {
      if (interfaceLang === 'ru') {
        return {
          langCode: supportedLanguages[el].code,
          langName: supportedLanguages[el].nameRu,
        }
      } else {
        return {
          langCode: supportedLanguages[el].code,
          langName: supportedLanguages[el].name,
        }
      }
    })
    .sort((item1, item2) => {
      if (item1.langName.toLowerCase() < item2.langName.toLowerCase()) return -1
      if (item1.langName.toLowerCase() > item2.langName.toLowerCase()) return 1
      return 0
    })

  return {
    type: SET_YOUTUBE_LANG_KEYS,
    youTubeLangKeys: youTubeLangKeys,
  }
}

export function setClosePopupState(isPopupShowed: boolean) {
  return {
    type: SET_CLOSE_POPUP_STATE,
    isPopupShowed,
  }
}

export function setCourseraVideoId(courseraVideoId: string) {
  return {
    type: SET_COURSERA_VIDEO_ID,
    courseraVideoId,
  }
}

export function setVideoWordsTranslate(videoWords: AllVideoWords) {
  return {
    type: SET_TRANSALTE_FROM_VIDEO,
    videoWords,
  }
}

export function setPracticeRound(practiceRound: number) {
  return {
    type: SET_PRACTICE_ROUND,
    practiceRound,
  }
}

export function setIsFinishedPractice(isFinishedPractice: boolean) {
  return {
    type: SET_IS_FINISHED_PRACTICE,
    isFinishedPractice,
  }
}

export function setPracticeGameWords(practiceGameWords: Array<WordVocabularyElement>) {
  return {
    type: SET_PRACTICE_GAME_WORDS,
    practiceGameWords,
  }
}

export function setActiveServiceTab(activeTab: ActiveServiceTab) {
  return {
    type: SET_SERVICE_ACTIVE_TAB,
    activeTab,
  }
}