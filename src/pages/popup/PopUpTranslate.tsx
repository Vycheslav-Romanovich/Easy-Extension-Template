import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../background/store/reducers'
import { setCountOfNewWordsAtVocabulary } from '../common/store/vocabularyActions'
import { deletePhraseFromVacabulary, deleteWordFromVacabulary } from '../background/store/actions/vocabularyActions'
import { setPracticeTranslateHistory, setSubsShowOnCoursera, setSubsShowOnNetflix, setSubsShowOnYt } from '../common/store/settingsActions'
import { IHistoryTranslatedWords, IPaymentData, notificationType, PartOfSpeech, PhraseVocabularyElement, PopupData, WayToOpenTextTranslation, WordHistoryElement, WordVocabularyElement } from '../../constants/types'
import { getService } from '../../utils/url'
import { useTranslation } from '../../locales/localisation'
import LinkDictionary from './components/linkDictionary'
import SelectLangTool from './components/selectLangTool'
import PopupButtons from './components/popupButtons'
import SettingsIcon from '../../assets/icons/menu/settings.svg'
import SpeakIcon from '../../assets/icons/menu/SpeakIcon.svg'
import LimitsWords from './components/limitsWords'
import { Link } from '../options/router'
import { getLanguageName } from '../../constants/supportedLanguages'
import { partsOfSpeech } from '../../constants/partOfSpeech'
import firebase from 'firebase/auth'
import { getPharesDescription, getWordDescription, saveWordTranslationHistory } from '../background/helpers/request'
import { useLanguageContext } from '../../context/LanguageContext'
import { setFreeTranslated } from '../common/store/authActions'
import { setCheckListDate } from '../background/helpers/checkListSetUp'
import { getLinkToWebsite } from '../background/helpers/websiteLink'
import { setActiveServiceTab } from '../common/store/videoActions'
import { generateStringArray } from '../../utils/normalizeTerm'
import { sendAmplitudeEvent } from '../../utils/amplitude'
import { getSelectVoice } from '../../utils/getSelectVoice'
import { SpeechSynthesisSettings } from '../../models/interfaces'
import { setSettingsSpeech } from '../../utils/setSettingsSpeech'
import { showNotification } from '../../utils/notification'

type PropsType = {
  className?: string
  selectedPhrase: string | undefined
  isPhrase: boolean
  item: string
  translate: string
  uid: string | null
  link: string
  position: boolean | undefined
  selectionWidth?: number | undefined
  selectionHeight?: number | undefined
  requestProps: PopupData | undefined
  domRectWidth?: number | undefined
  transcription?: string
}

const PopUpTranslate: React.FC<PropsType> = ({
  isPhrase,
  selectedPhrase,
  item,
  translate,
  uid,
  link,
  position,
  selectionWidth,
  requestProps,
  domRectWidth,
  transcription,
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
  const wayToOpenTextTranslation = useSelector<RootState, WayToOpenTextTranslation>((state) => state.settings.wayToOpenTextTranslation)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const freeDoubleSubs = useSelector<RootState, boolean>((state) => state.auth.freeDoubleSubs)
  const paymentData = useSelector<RootState, IPaymentData>((state) => state.auth.paymentData)
  const courseraVideoId = useSelector<RootState, string>((state) => state.video.courseraVideoId)

  const [active, setActive] = useState<boolean>(false)
  const [synth, setSynth] = useState<SpeechSynthesis>(window.speechSynthesis);
  const [utterThis, setUtterThis] = useState<SpeechSynthesisUtterance>(useCallback(() => new SpeechSynthesisUtterance(),[]));
  const [popupMinWidth, setPopupMinWidth] = useState<string>('max-content')
  const [isAddedItem, setIsAddedItem] = useState<boolean>(false)
  const [disebled, setDisebled] = useState<boolean>(false)
  const [isExistingItem, setIsExistingItem] = useState<boolean>(false)
  const [isShowVocTooltip, setIsShowVocTooltip] = useState<boolean>(false)
  const [isShowPlusTooltip, setIsShowPlusTooltip] = useState<boolean>(false)
  const [tooltipMessage, setTooltipMessage] = useState<'premium' | 'account'>('account')
  const [isIconTranslate, setIsIconTranslate] = useState<boolean>(
    wayToOpenTextTranslation === 'withButton' && !isYoutube && !isNetflix && !isCoursera
  )
  const [checkTranscription, setChechTranscription] = useState<string | undefined>(
    learningLanguageCode === 'en' ? transcription : undefined
  )

  const popupRef = useRef(null)

  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const { article } = strings.translatePopup
  const { popupOption, popupFreeTrial } = strings.priceForPopup

  const classes = {
    settingBtn: 'fill-current text-gray-300 hover:text-blue-300 cursor-pointer',
  }
 useEffect(() => {
  setSynth(window.speechSynthesis);
  setUtterThis(new SpeechSynthesisUtterance(item));
  utterThis.lang = learningLanguageCode ?? 'en';
  const handlerUtter = () => setActive(false);
  utterThis.addEventListener('end', handlerUtter);
  
  return () => utterThis.removeEventListener('end', handlerUtter);
 }, [active]);
  
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

  const sound = () => {
    const event = {
      category: 'TextTranslation',
      action: 'ToVoiceWord',
      label: `${link}`,
    };
    const settingsForUtter: SpeechSynthesisSettings = {
      lang: learningLanguageCode,
      voice: undefined
  }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
    const voices = synth.getVoices();

    if (voices.length > 0) {
      settingsForUtter.voice = getSelectVoice(utterThis, voices);
      const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis, settingsForUtter);
      synth.speak(setedSettings);
    } else {
      synth.addEventListener("voiceschanged", () => {
        const voices: SpeechSynthesisVoice[] = synth.getVoices();
        settingsForUtter.voice = getSelectVoice(utterThis, voices);
        const setedSettings: SpeechSynthesisUtterance = setSettingsSpeech(utterThis, settingsForUtter);
      synth.speak(setedSettings);
      })
    }
    setActive(true)
  }

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
      if (isPhrase) {
        isAddedItem
          ? deletePhraseFromVacabulary(item, uid, courseraVideoId, updateVocAfterDelete)
          : getPharesDescription(item, uid, link, updateVocAfterAdd, translate, courseraVideoId, learningLanguageCode)
      } else {
        isAddedItem
          ? deleteWordFromVacabulary(item, uid, courseraVideoId, updateVocAfterDelete)
          : getWordDescription(item, uid, link, updateVocAfterAdd, requestProps, translate, checkTranscription, courseraVideoId, learningLanguageCode)
      }
    }
  }

  const showTooltip = () => {
    setIsShowVocTooltip(false)
    setIsShowPlusTooltip(false)
  }

  const clickSettingButton = () => {
    const event = {
      category: 'Listening',
      action: 'WordTranslationSettings',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

    getLinkToWebsite(locale, 'account/settings?type=settings')
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
      isPhrase ? getLinkToWebsite(locale, 'account/vocabulary/phares') : getLinkToWebsite(locale, 'account/vocabulary/words');
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
      isPhrase ? getLinkToWebsite(locale, 'account/vocabulary/phares') : getLinkToWebsite(locale, 'account/vocabulary/words')
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
      transcription: checkTranscription ? checkTranscription : requestProps.transcription,
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

  useEffect(() => {
    isPhrase ? setCheckListDate('phrase') : setCheckListDate('word')
  }, [])

  useEffect(() => {
    const popup: HTMLElement = document.querySelector('.elang_popup_window_wrapper') as HTMLElement
    const top = popup?.getBoundingClientRect().top + pageYOffset
    const left = popup?.getBoundingClientRect().left
    const popupHeight = document.getElementById('elangExtensionPopup')?.clientHeight
    const popupWidth = document.getElementById('elangExtensionPopup')?.offsetWidth

    if (popup && isPhrase) {
      // eslint-disable-next-line
      popup.style.left = isIconTranslate
        ? left - popupWidth! / 2 - (domRectWidth ? domRectWidth / 2 : 0) + 'px'
        : left - popupWidth! / 2 + 'px'
    } else if (popup && !isPhrase) {
      // eslint-disable-next-line
      popup.style.left = isIconTranslate
        ? left - popupWidth! / 2 - (domRectWidth ? domRectWidth / 2 : 0) + 'px'
        : left - popupWidth! / 2 + 'px'
    }
    if (!position && popup) {
      // eslint-disable-next-line
      popup.style.top = isIconTranslate ? top - popupHeight! - 20 + 32 + 'px' : top - popupHeight! - 20 + 'px'
    } else if (position && popup) {
      if (isPhrase) {
        // eslint-disable-next-line
        popup.style.top = top + popupHeight! / 2 + 'px'
      } else {
        // eslint-disable-next-line
        popup.style.top = isIconTranslate ? top + 68 + 'px' : top + 36 + 'px'
      }
    }
  }, [])

  useEffect(() => {
    //@ts-ignore
    if (popupRef.current && popupRef.current?.offsetWidth < 214) {
      setPopupMinWidth('214px')
    }
  }, [popupRef.current])

  // add word to translateHistory (db / chrome.storage)
  useEffect(() => {
    if (selectedPhrase && !isPhrase) {
      if (((user && freeTranslated) || isPaidSubscription) && uid) {
        saveWordTranslationHistory(
          addPhraseValidState(selectedPhrase),
          item,
          uid,
          link,
          requestProps,
          translate,
          checkTranscription,
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
            chrome.storage.sync.set({
              translatedData: { count: result.translatedData.count + 1, day: currentDay },
            })
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
  }, [])

  return (
    <>
      {!(translate === 'untranslatableArticle') ? (
        <div
          id="elangExtensionPopup"
          ref={popupRef}
          style={
            isPhrase
              ? {
                  width: '362px',
                  minWidth: 214,
                  boxSizing: 'border-box',
                }
              : {
                  minWidth: popupMinWidth,
                  boxSizing: 'border-box',
                }
          }
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
          {isPhrase ? (
            <div style={{ paddingTop: '12px', paddingRight: '12px', marginBottom: '12px', boxSizing: 'border-box' }}
            className='flex flex-row w-full justify-end items-start gap-[16px]'>
            <SelectLangTool localLanguageCode={localLanguageCode} learningLanguageCode={learningLanguageCode} />
            <div
              className={`${!uid && 'pointer-events-none opacity-60'}`}
              onClick={clickSettingButton}
            >
              <SettingsIcon className={classes.settingBtn} />
            </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-between"
              style={{ paddingTop: 10, paddingBottom: 3, paddingLeft: 16, paddingRight: 17 }}
            >
              <div className={`${!isPaidSubscription && !freeTranslated && 'blurSm opacity-70'} flex items-center`}>
                <div
                  style={{
                    fontSize: '18px',
                    minWidth: 'max-content',
                  }}
                  className="font-san font-bold text-gray-600 dark:text-gray-100 select-none text-left"
                >
                  {item}
                </div>
                <div
                  style={{
                    marginLeft: 8,
                    fontSize: '14px',
                    lineHeight: '20px',
                  }}
                  className="text-gray-300"
                >
                  {partsOfSpeech.map((part, index) => {
                    if (requestProps && requestProps.partOfSpeech && part.name === requestProps.partOfSpeech) {
                      return <span key={index}>{part.code}</span>
                    }
                  })}
                </div>
              </div>
              <SelectLangTool localLanguageCode={localLanguageCode} learningLanguageCode={learningLanguageCode} />
            </div>
          )}

          <div
            style={
              !isPhrase
                ? {
                    paddingLeft: 16,
                    paddingRight: 17,
                    borderTop: `${isNetflix || (isDarkModeInYoutube && isYoutube) ? '' : '1px solid #F1F1F1'}`,
                    maxHeight: 230,
                    minHeight:
                      !isPaidSubscription &&
                      !(
                        requestProps?.synoyms.length === 0 &&
                        requestProps?.example.length === 0 &&
                        requestProps?.allPartOfSpeech[0] === undefined
                      )
                        ? 178
                        : 65,
                  }
                : {}
            }
            className={`${
              !isPhrase && `text - left font-inter scrollbar scrollbar-width-smallPopup scrollbar-track-radius-full select-none`
            } ${
              isNetflix || (isDarkModeInYoutube && isYoutube)
                ? 'scrollbar-thumb-gray-400 scrollbar-track-gray-700'
                : 'scrollbar-thumb-gray-300 scrollbar-track-white'
            } ${!isPaidSubscription && !freeTranslated && !isPhrase && 'blurSm opacity-30 pointer-events-none'}`}
          >
            {!isPhrase ? (
              <>
                <div className={`flex justify-between`} style={{ marginBottom: '6px', marginTop: 7 }}>
                  <div
                    style={{
                      marginRight: '14px',
                      fontSize: '14px',
                    }}
                    className="font-sans font-normal text-gray-300 select-none"
                  >
                    {learningLanguageCode === 'en' && transcription
                      ? `/${transcription}/`
                      : requestProps && requestProps.transcription
                      ? `/${requestProps.transcription}/`
                      : null}
                  </div>
                  <div className="flex flex-row gap-[16px]">
                    <div onClick={sound} className={`${active ? 'pointer-events-none' : ''}`}>
                      <SpeakIcon
                       className={active ? `fill-current text-blue-300` : `fill-current text-gray-300 hover:text-blue-300 cursor-pointer`}
                      />
                    </div>
                    <div className={`${!uid && 'pointer-events-none opacity-60'} flex w-full justify-end`} onClick={clickSettingButton}>
                      <SettingsIcon className={classes.settingBtn} />
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-200" style={{ fontSize: 14, lineHeight: '20px' }}>
                  {item.charAt(0) === item.charAt(0).toUpperCase()
                    ? translate.charAt(0).toUpperCase() + translate.slice(1)
                    : translate.charAt(0).toLowerCase() + translate.slice(1)}
                </div>
              </>
            ) : null}
            {isPhrase ? (
              <>
                <div
                  style={{
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingBottom: '16px',
                    maxWidth: '362px',
                  }}
                  className="flex"
                >
                  {!isPaidSubscription && !freeTranslated ? (
                    <LimitsWords className="max-w-[240px]" onClick={goToPlanPage} />
                  ) : (
                    <p
                      style={{
                        paddingRight: '12px',
                        fontSize: '14px',
                        maxHeight: '208px',
                        lineHeight: '19px',
                        margin: 0,
                      }}
                      className={`text - left text-gray-900 dark:text-gray-100 font-inter text-base scrollbar scrollbar-width-popup scrollbar-thumb-gray-350 scrollbar-track-gray-200 scrollbar-track-radius-full select-none`}
                    >
                      {translate}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  {requestProps &&
                    Object.values(requestProps.allPartOfSpeech).map((el: Array<PartOfSpeech>, i: number) => {
                      return (
                        <div key={i} style={{ marginTop: 8, maxWidth: 248 }}>
                          <p className={`dark:text-white text-gray-600`} style={{ fontSize: 12, lineHeight: '16px', marginBottom: 0 }}>
                            <span
                              className={`${(!isPaidSubscription || !uid) && i === 0 && 'blurMl opacity-40'} ${
                                (!isPaidSubscription || !uid) && i !== 0 && 'blurSm opacity-30'
                              }`}
                            >
                              {Object.keys(requestProps.allPartOfSpeech)[i] === 'null' ? 'adj' : Object.keys(requestProps.allPartOfSpeech)[i]}: &nbsp;
                            </span>
                            {el.map((item: PartOfSpeech, index: number) => {
                              if (index !== el.length - 1) {
                                return (
                                  <span
                                    key={index}
                                    className={`dark:text-white ${
                                      !isPaidSubscription || !uid
                                        ? i === 0 && (index === 0 || index === 1)
                                          ? 'blurMl opacity-40'
                                          : 'blurSm opacity-30'
                                        : ''
                                    }`}
                                  >
                                    {item.translation},&ensp;
                                  </span>
                                )
                              } else {
                                return (
                                  <span
                                    key={index}
                                    className={`dark:text-white ${
                                      !isPaidSubscription || !uid
                                        ? i === 0 && (index === 0 || index === 1)
                                          ? 'blurMl opacity-40'
                                          : 'blurSm opacity-30'
                                        : ''
                                    } `}
                                  >
                                    {item.translation}
                                  </span>
                                )
                              }
                            })}
                          </p>
                          <p
                            className={`dark:text-gray-300 text-gray-300 first-letter:uppercase ${
                              (!isPaidSubscription || !uid) && 'blurSm opacity-30'
                            }`}
                            style={{ fontSize: 12, lineHeight: '16px', marginTop: 4, marginBottom: 0 }}
                          >
                            {requestProps.example ? requestProps.example[i] : null}
                          </p>
                        </div>
                      )
                    })}
                </div>
                {requestProps && requestProps.synoyms.length ? (
                  <div
                    className={`${(!isPaidSubscription || !uid) && 'blurSm opacity-30'} dark:text-white`}
                    style={{ marginTop: 8, maxWidth: 248, fontSize: 12, lineHeight: '16px' }}
                  >
                    synonyms:&nbsp;
                    {requestProps.synoyms.map((el: string, i: number) => {
                      return <span key={i}>{i !== requestProps.synoyms.length - 1 ? <span>{el},&ensp;</span> : <span>{el}</span>}</span>
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
          {!isPaidSubscription && freeTranslated && !isPhrase && (
            <div
              className="text-gray-300 absolute bg-white dark:bg-gray-700"
              style={{ bottom: 32, fontSize: 14, lineHeight: '18px', paddingLeft: 16, paddingRight: 16, paddingTop: 5, letterSpacing: '-0.3px' }}
            >
              {!(
                requestProps?.synoyms.length === 0 &&
                requestProps?.example.length === 0 &&
                requestProps?.allPartOfSpeech[0] === undefined
              ) && (
                <div className="text-[14px] leading-[18px] pb-[10px]">
                  {!paymentData?.isSubscriptionFinished ? popupFreeTrial.text : popupOption.text}
                  <br/>
                  <Link
                    className={`cursor-pointer no-underline text-brand-300 hover:underline`}
                    style={{ fontSize: 14 }}
                    onClick={() => {
                      goToPlanPage()
                      sendAmplitudeEvent('go_to_Premium', { location: 'transcriptions_synonyms' })
                    }}
                  >
                    {!paymentData?.isSubscriptionFinished ? popupFreeTrial.link : popupOption.link}
                  </Link>
                </div>
              )}
            </div>
          )}
          {!isPaidSubscription && !freeTranslated && !isPhrase && (
            <div className={`absolute flex flex-col bg-white ${isNetflix || (isDarkModeInYoutube && isYoutube) ? 'mb-5' : 'pb-5'}`} style={{ width: '100%', bottom: 30 }}>
              <LimitsWords onClick={goToPlanPage} />
            </div>
          )}
          {isPaidSubscription && !isPhrase &&
          (<LinkDictionary word={item} localLangCode={localLanguageCode} isDarkMode={isNetflix || (isDarkModeInYoutube && isYoutube)} />)}

          <PopupButtons
            clickPlusButton={clickPlusButton}
            clickVocabularyButton={clickVocabularyButton}
            disebled={disebled}
            isShowPlusTooltip={isShowPlusTooltip}
            isShowVocTooltip={isShowVocTooltip}
            uid={uid}
            isAddedItem={isAddedItem}
            tooltipMessage={tooltipMessage}
            isMarginOff 
            localLanguageCode={localLanguageCode} 
            learningLanguageCode={learningLanguageCode}          
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
export default PopUpTranslate
