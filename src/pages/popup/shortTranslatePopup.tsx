import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../background/store/reducers'
import { setCountOfNewWordsAtVocabulary } from '../common/store/vocabularyActions'
import { deleteWordFromVacabulary } from '../background/store/actions/vocabularyActions'
import { IHistoryTranslatedWords, notificationType, PhraseVocabularyElement, PopupData, WordHistoryElement, WordVocabularyElement } from '../../constants/types'
import { getService } from '../../utils/url'
import { useTranslation } from '../../locales/localisation'
import PopupButtons from './components/popupButtons'

import LimitsWords from './components/limitsWords'
import { getLanguageName } from '../../constants/supportedLanguages'

import firebase from 'firebase/auth'
import { getWordDescription, saveWordTranslationHistory } from '../background/helpers/request'
import { useLanguageContext } from '../../context/LanguageContext'
import { setFreeTranslated } from '../common/store/authActions'
import { setCheckListDate } from '../background/helpers/checkListSetUp'
import { getLinkToWebsite } from '../background/helpers/websiteLink'
import { setPracticeTranslateHistory, setSubsShowOnCoursera, setSubsShowOnNetflix, setSubsShowOnYt } from '../common/store/settingsActions'
import { setActiveServiceTab } from '../common/store/videoActions'
import { generateStringArray } from '../../utils/normalizeTerm'
import { sendAmplitudeEvent } from '../../utils/amplitude'
import { showNotification } from '../../utils/notification'

type PropsType = {
  className?: string
  selectedPhrase: string | undefined
  item: string
  translate: string
  uid: string | null
  link: string
  position: boolean | undefined
  selectionWidth?: number | undefined
  selectionHeight?: number | undefined
  domRectWidth?: number | undefined
  requestPropsForData: PopupData | undefined
}

const ShortTranslatePopup: React.FC<PropsType> = ({
  selectedPhrase,
  item,
  translate,
  uid,
  link,
  position,
  selectionWidth,
  requestPropsForData,
}) => {
  const dispatch = useDispatch()

  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'
  const isCoursera = getService() === 'coursera'

  const countOfNewWords = useSelector<RootState, number>((state) => state.vocabulary.countOfNewWords)
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learningLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const vocabularyPhrases = useSelector<RootState, Array<PhraseVocabularyElement>>((state) => state.vocabulary.phrases)
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const freeTranslated = useSelector<RootState, boolean>((state) => state.auth.freeTranslated)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const freeDoubleSubs = useSelector<RootState, boolean>((state) => state.auth.freeDoubleSubs)
  const courseraVideoId = useSelector<RootState, string>((state) => state.video.courseraVideoId)

  const [isAddedItem, setIsAddedItem] = useState<boolean>(false)
  const [disebled, setDisebled] = useState<boolean>(false)
  const [isExistingItem, setIsExistingItem] = useState<boolean>(false)
  const [isShowVocTooltip, setIsShowVocTooltip] = useState<boolean>(false)
  const [isShowPlusTooltip, setIsShowPlusTooltip] = useState<boolean>(false)
  const [tooltipMessage, setTooltipMessage] = useState<'premium' | 'account'>('account')

  const [requestProps, setRequestProps] = useState({
    synoyms: [],
    allPartOfSpeech: [],
    example: [],
    partOfSpeech: '',
    transcription: '',
    translation: translate,
    word: item,
  });

  const popupRef = useRef(null)

  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const { article } = strings.translatePopup

  useEffect(() => {
    setIsExistingItem(generateStringArray(vocabularyWords, vocabularyPhrases).includes(item))
  }, [])

  useEffect(() => {
    chrome.storage.sync.get(['isFirstTimeAtMonth'], (result) => {
      if (!isPaidSubscription && !freeTranslated && (result.isFirstTimeAtMonth || result.isFirstTimeAtMonth === undefined)) {
        chrome.runtime.sendMessage({
          component: 'sendAnalyticsCustomeEvent',
          event: { dimension: 'dimension1', value: 'Translation Limit' },
        })

        const event = {
          category: 'Plans',
          action: 'EndOfFreeTranslations',
          label: `${getLanguageName(learningLanguageCode, locale)}/${getLanguageName(localLanguageCode, locale)}, ${getService()}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

        sendAmplitudeEvent('limit_translations', { resource: `${getService() ? getService() : 'web_page'}` })

        if (!isPaidSubscription && !freeTranslated && !freeDoubleSubs) {
          chrome.runtime.sendMessage({ component: 'sendAnalyticsCustomeEvent', event: { dimension: 'dimension1', value: 'All Limits' } })
        }

        chrome.storage.sync.set({ isFirstTimeAtMonth: false })
      }
    })
  }, [])

  const updateVocAfterAdd = () => {
    !isExistingItem && dispatch(setCountOfNewWordsAtVocabulary(countOfNewWords + 1))
    setDisebled(false)
  }

  const updateVocAfterDelete = () => {
    if (countOfNewWords > 0) {
      dispatch(setCountOfNewWordsAtVocabulary(countOfNewWords - 1))
    }
    setDisebled(false)
  }

  const addItemToVocabulary = () => {
    setDisebled(true)

    setCheckListDate('vocabulary')

    setIsAddedItem(!isAddedItem)
    if (uid) {
      isAddedItem
        ? deleteWordFromVacabulary(item, uid, courseraVideoId, updateVocAfterDelete)
        : getWordDescription(item, uid, link, updateVocAfterAdd, requestPropsForData, translate, requestProps.transcription, courseraVideoId, learningLanguageCode)
    }
  }

  const showTooltip = () => {
    setIsShowVocTooltip(false)
    setIsShowPlusTooltip(false)
  }

  const clickPlusButton = () => {
    uid
      ? !freeTranslated && !isPaidSubscription
        ? closeTooltip(true, false, 'premium')
        : addItemToVocabulary()
      : closeTooltip(true, false, 'account')
  }

  const navigateToVocabulary = () => {
    if (isYoutube) {
      dispatch(setSubsShowOnYt(true));
      dispatch(setActiveServiceTab('vocabulary'));
      getLinkToWebsite(locale, 'account/vocabulary/words');
    }

    if (isNetflix) {
      dispatch(setSubsShowOnNetflix(true));
      dispatch(setActiveServiceTab('vocabulary'));
    }

    if (isCoursera) {
      dispatch(setSubsShowOnCoursera(true));
      dispatch(setActiveServiceTab('vocabulary'));
    }

    if (!(isNetflix || isYoutube || (isCoursera))) {
      getLinkToWebsite(locale, 'account/vocabulary/words')
    }

    dispatch(setCountOfNewWordsAtVocabulary(0))
  }

  const clickVocabularyButton = () => {
    uid ? navigateToVocabulary() : closeTooltip(false, true, 'account')
  }

  const closeTooltip = (isPlus: boolean, isVoc: boolean, message: 'premium' | 'account') => {
    setIsShowVocTooltip(isVoc)
    setIsShowPlusTooltip(isPlus)
    setTooltipMessage(message)
  }

  const goToPlanPage = () => {
    uid && sendAmplitudeEvent('go_to_Premium', { location: 'translation' })

    uid ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
  }

  const setWordPropsToHistory = (
    historyPhrases: string,
    timestamp: number,
    link: string,
    requestProps: PopupData
  ): IHistoryTranslatedWords => {
    return {
      word: requestProps.word,
      historyPhrases,
      translate: requestProps.translation,
      transcription: requestProps.transcription,
      partOfSpeech: requestProps.partOfSpeech,
      synonyms: requestProps.synoyms || [],
      example: requestProps.example,
      allPartOfSpeech: requestProps.allPartOfSpeech,
      timestamp,
      link,
      learningLanguageCode,
    }
  }

  const addPhraseValidState = (selectedPhrase: string) => {
    if (!(isNetflix || isYoutube || isCoursera)) {
      const arrSelectedPhrase = selectedPhrase?.split('. ').map((i: string) => {
        if (i.includes(item)) return i
      })
      const historyPhrase: string = arrSelectedPhrase.filter(Boolean).join()
      return historyPhrase
    } else {
      return selectedPhrase
    }
  }

  const textNotification = (): notificationType => {
    const random = Math.floor(1 + Math.random() * (3 + 1 - 1))
        switch (random) {
          case 1:
            return strings.notification[1]
          case 2: 
            return strings.notification[2]
          case 3: 
            return strings.notification[3]
          default: 
            return strings.notification[1]
        }
  }

  const addSelectedPhraseToChromeStorage = (selectedPhrase: string) => {
    chrome.storage.local.get(['translatedHistory'], (result) => {
      if (requestProps && !Object.keys(result).length) {
        const translatedHistory = [setWordPropsToHistory(selectedPhrase, Date.now(), link, requestProps)]
        chrome.storage.local.set({ translatedHistory: translatedHistory })
        dispatch(setPracticeTranslateHistory(result.translatedHistory));
      } else if (!isPaidSubscription && freeTranslated) {
        chrome.storage.local.get(['translatedHistory'], (result) => {
          if (requestProps) {
            if(!result.translatedHistory.some((item: WordHistoryElement) => item.word === requestProps.word)) {
              result.translatedHistory.push(setWordPropsToHistory(selectedPhrase, Date.now(), link, requestProps))
              chrome.storage.local.set({ translatedHistory: result.translatedHistory })
              dispatch(setPracticeTranslateHistory(result.translatedHistory))
            }
          }
        })
      }
    })
  }

  useEffect(() => {
    setCheckListDate('word')
  }, [])

  useEffect(() => {
    const popup: HTMLElement = document.querySelector('.elang_popup_window_wrapper') as HTMLElement
    const top = popup?.getBoundingClientRect().top + pageYOffset
    const left = popup?.getBoundingClientRect().left
    const popupHeight = document.getElementById('elangExtensionPopup')?.clientHeight
    const popupWidth = document.getElementById('elangExtensionPopup')?.offsetWidth

    if (popup) {
        popup.style.left = left - popupWidth! / 2 + 'px'
    }
    if (!position && popup) {
      // eslint-disable-next-line
      popup.style.top = top - popupHeight! - 20 + 'px'
    } else if (position && popup) {
        popup.style.top = top + 36 + 'px'
    }
  }, [])

  useEffect(() => {
    if (selectedPhrase) {
      if (((user && freeTranslated) || isPaidSubscription) && uid) {
        saveWordTranslationHistory(
          addPhraseValidState(selectedPhrase),
          item,
          uid,
          link,
          requestProps,
          translate,
          requestProps.transcription,
          learningLanguageCode
        )
      } else {
        addSelectedPhraseToChromeStorage(addPhraseValidState(selectedPhrase))
      }
    }
  }, [])

  useEffect(() => {
    const now = new Date()
    const currentDay = now.getDate()
    const currentTime = now.getHours()

    chrome.storage.sync.get(['translatedData'], (result) => {
      if (!Object.keys(result).length) {
        chrome.storage.sync.set({ translatedData: { count: 1, day: currentDay } })
        chrome.storage.sync.set({ showNotification: { count: 1, hour: currentTime, day: currentDay } })
      } else {
        chrome.storage.sync.get(['translatedData'], (result) => {
          if (result.translatedData.count < 10) {
            freeDoubleSubs &&
              chrome.runtime.sendMessage({ component: 'sendAnalyticsCustomeEvent', event: { dimension: 'dimension1', value: 'No limit' } })
            if(translate.length != 0) {  
            chrome.storage.sync.set({
              translatedData: { count: result.translatedData.count + 1, day: currentDay },
            })}
          }
          if (result.translatedData.count === 10) {
            dispatch(setFreeTranslated(false))
          }

          if((+result.translatedData.count + 1) % 5 === 0 ) {
            chrome.storage.sync.get(['showNotification'], (data) => {    
              if(+data.showNotification.count <= 1){
                showNotification(textNotification())
                sendAmplitudeEvent('companion_suggestion', {resource: `${getService() ? getService() : 'web_page'}`})
                chrome.storage.sync.set({ showNotification: { count: data.showNotification.count + 1, hour: currentTime, day: currentDay } })
              }
              
              if(+data.showNotification.count <= 3 && data.showNotification.hour != currentTime){
                showNotification(textNotification())
                sendAmplitudeEvent('companion_suggestion', {resource: `${getService() ? getService() : 'web_page'}`})
                chrome.storage.sync.set({ showNotification: { count: data.showNotification.count + 1, hour: currentTime, day: currentDay } })
              }
            })
          }
        })
      }
    })
  }, [translate])

  return (
    <>
      {!(translate === 'untranslatableArticle') ? (
        <div
          id="elangExtensionPopup"
          ref={popupRef}
          style={{
            minWidth: 214,
            boxSizing: 'border-box',
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
          }}
          onMouseLeave={showTooltip}
          className={`${
            isNetflix || (isDarkModeInYoutube && isYoutube) ? 'dark bg-gray-700' : 'bg-white'
          } flex absolute flex-col border-b-0 rounded shadow-tt select-none max-w-max  animate-fadePopup`}
        >
          <div
            className="flex items-center justify-between font-san text-gray-600 dark:text-gray-100 select-none text-left"
            style={{ paddingTop: 16, paddingBottom: 4, paddingLeft: 16, fontSize: '16px', minWidth: 'max-content' }}
          >
            {translate}
          </div>

          {!isPaidSubscription && !freeTranslated && (
            <div className={`absolute flex flex-col bg-white ${isNetflix || (isDarkModeInYoutube && isYoutube) ? 'mb-5' : 'pb-5'}`} style={{ width: '214px', bottom: 30 }}>
              <LimitsWords onClick={goToPlanPage} />
            </div>
          )}

          <PopupButtons
            clickPlusButton={clickPlusButton}
            clickVocabularyButton={clickVocabularyButton}
            disebled={disebled}
            isShowPlusTooltip={isShowPlusTooltip}
            isShowVocTooltip={isShowVocTooltip}
            uid={uid}
            isAddedItem={isAddedItem}
            tooltipMessage={tooltipMessage}
            localLanguageCode={''}
            learningLanguageCode={''}
          />
          <div
            className={`absolute`}
            style={{
              width: selectionWidth,
              height: 20,
              bottom: -20,
              minWidth: '100%',
            }}
          ></div>
        </div>
      ) : (
        <div
          id="elangExtensionPopup"
          ref={popupRef}
          className={`${
            isNetflix || isDarkModeInYoutube
              ? 'dark bg-gray-700 border-gray-700 text-white shadow-tt-dark'
              : 'bg-white border-gray-200 text-gray-900 shadow-tt'
          } border border-solid rounded`}
          style={{
            padding: '14px 30px',
            fontSize: '14px',
          }}
        >
          {article}
          <div className={`absolute`} style={{ width: '100%', height: 20, bottom: -20 }}></div>
        </div>
      )}
    </>
  )
}
export default ShortTranslatePopup
