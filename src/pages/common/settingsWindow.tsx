import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLangErrors, setOffExtension } from './store/settingsActions'
import {
  setAlwaysShowTranslationOnYt,
  setAlwaysShowTranslationOnNetflix,
  setAlwaysShowTranslationOnCoursera,
  setSettingsYouTubeShown,
  setBackgroundSubOnYt,
  setBackgroundSubOnNetflix,
  setAutoPause,
  setShowTargetLanguages,
  setBackgroundSubOnCoursera,
} from './store/settingsActions'
import { getLanguageName } from '../../constants/supportedLanguages'
import { RootState } from '../background/store/reducers'
import { getService } from '../../utils/url'
import { SubsLinksType } from '../content/services/netflix'
import { useTranslation } from '../../locales/localisation'
import { setCheckListDate } from '../background/helpers/checkListSetUp'

import PopupTooltip from '../common/components/popupTooltip'

import FontSizeSelector from '../options/components/settings/fontSizeSelector'
import ColorPicker from '../options/components/settings/colorPicker'
import SettingOptionYouTube from '../options/components/settings/settingOptionYouTube'
import ListTargetLanguages from '../options/components/settings/listTargetLanguages'

import PlayerLogoOn from '../../assets/icons/extensionToggle/playerLogoOn.svg'
import ELang from '../../assets/images/settings/eLang.svg'
import Cross from '../../assets/images/settings/cross.svg'
import Download from '../../assets/icons/settings/download.svg'
import ArrowRight from '../../assets/icons/settings/arrowRight.svg'
import ArrowLeft from '../../assets/icons/settings/arrowLeft.svg'
import Toggle from './components/toggle/toggle'
import { useEffect } from 'react'
import { useState } from 'react'
import { subsStore } from '../content/store'
import { useStore } from 'effector-react'
import { useLanguageContext } from '../../context/LanguageContext'
import LanguageError from './components/languageError'
import clsx from 'clsx'
import { useFullScreenContex } from '../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../utils/amplitude'

const SettingsWindow: React.FC<{ isFullscreenModeYt?: boolean }> = ({ isFullscreenModeYt }) => {
  const dispatch = useDispatch()
  const service = getService()
  const subs = useStore(subsStore)
  const alwaysShowTranslationOnYt = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const alwaysShowTranslationOnNetflix = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const alwaysShowTranslationOnCoursera = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learningLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const settingsShown = useSelector<RootState, boolean>((state) => state.settings.settingsYouTubeShown)
  const backgroundSubOnYt = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnYt)
  const backgroundSubOnNetflix = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnNetflix)
  const backgroundSubOnCoursera = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnCoursera)
  const netflixSubsLinks = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.netflixSubsLinks)
  const youTubeLangKeys = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.youTubeLangKeys)
  const courseraSubsLinks = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.courseraSubsLinks)
  const autoPauseOnHover = useSelector<RootState, boolean>((state) => state.settings.autoPauseOnHover)
  const showTargetLanguages = useSelector<RootState, boolean>((state) => state.settings.showTargetLanguages)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const isFullScreenOnNetflix = useSelector<RootState, boolean>((state) => state.settings.isFullScreenOnNetflix)
  const [isShowHighlightTooltip, setIsShowHighlightTooltip] = useState<boolean>(false)
  const [languageNativeError, setLanguageNativeError] = useState<string>('')
  const [languageTranslateError, setLanguageTranslateError] = useState<string>('')
  const [subLinks, setSubLinks] = useState<Array<SubsLinksType> | undefined>()

  const [currentLocalLanguageName, setCurrentLocalLanguageName] = useState<string>('')
  const [currentLearningLanguageName, setCurrentLearningLanguageName] = useState<string>('')
  const [netflixSubsLinksLoad, setNetflixSubsLinksLoad] = useState<boolean>(false)
  const [subLinksLoad, setSubLinksLoad] = useState<boolean>(false)

  const strings = useTranslation()
  const { locale } = useLanguageContext()
  const { isFullScreen } = useFullScreenContex()

  const { card2 } = strings.options.settings.cards
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const [langType, setLangType] = useState<string>('')

  if (!netflixSubsLinksLoad && netflixSubsLinks) {
    setNetflixSubsLinksLoad(true)
  }

  if (!subLinksLoad && subLinks) {
    setSubLinksLoad(true)
  }

  const loadNetflixSubs = (langCode: string) => {
    const languageDescription = netflixSubsLinks?.find((item) => item.langCode === langCode)?.languageDescription

    const controlSettings = document.querySelector('[data-uia="control-audio-subtitle"]')
    controlSettings?.setAttribute('hidden', 'true')
    // @ts-ignore
    controlSettings?.click()
    const subs = document.querySelector('[data-uia="selector-audio-subtitle"]')
    const subList = subs?.children[1].children[1].children

    if (subList) {
      for (let i=0; i < subList.length; i++) {
        // @ts-ignore
        if (subList[i]?.innerText.includes(languageDescription)) {
          // @ts-ignore
          subList[i].click()
        }
      }
    }
    controlSettings?.removeAttribute('hidden')
  }

  const updateNetflixSubsUrls = (langCode: string) => {
    if (!netflixSubsLinks) return

    const netflixWindow = document.querySelector('[data-uia="player"]')
    if (netflixWindow?.classList[0] === 'active') {
      loadNetflixSubs(langCode)
      return
    }
    // @ts-ignore
    netflixWindow?.click()

    let isActivated = false
    const setActiveTimeout = setInterval(() => {
      if (netflixWindow?.classList[0] === 'active') {
        isActivated = true
      }
      if (isActivated) {
        loadNetflixSubs(langCode)
        clearInterval(setActiveTimeout)
      }
    }, 100)
  }

  useEffect(() => {
    if (localLanguageCode && netflixSubsLinksLoad) {
      updateNetflixSubsUrls(localLanguageCode)
    }
  }, [localLanguageCode, netflixSubsLinksLoad])

  useEffect(() => {
    if (learningLanguageCode && netflixSubsLinksLoad) {
      updateNetflixSubsUrls(learningLanguageCode)
    }
  }, [learningLanguageCode, netflixSubsLinksLoad])

  useEffect(() => {
    const lang =
      isYoutube
      ? subs.isAutoGenerated
        ? `${getLanguageName(localLanguageCode, locale)} ${card2.items.item11.title}`
        : getLanguageName(localLanguageCode, locale)
      : isNetflix
          ? subLinks?.find((item) => item.langCode === localLanguageCode)?.langName
          : getLanguageName(localLanguageCode, locale)

    setCurrentLocalLanguageName(lang || getLanguageName(localLanguageCode, locale))
  }, [localLanguageCode, locale, subLinksLoad])

  useEffect(() => {
    const lang =
      isYoutube
        ? subs.isAutoGenerated
          ? `${getLanguageName(learningLanguageCode, locale)} ${card2.items.item11.title}`
          : getLanguageName(learningLanguageCode, locale)
        : isNetflix
          ? subLinks?.find((item) => item.langCode === learningLanguageCode)?.langName
          : getLanguageName(learningLanguageCode, locale)

    setCurrentLearningLanguageName(lang || getLanguageName(learningLanguageCode, locale))
  }, [learningLanguageCode, locale, subLinksLoad])

  const resetHandler = (event: MouseEvent) => {
    //@ts-ignore
    const elangSettingsButton = event.target.closest('#eLangSettingsButton')
    //@ts-ignore
    const eLangSubListButton = event.target.closest('#eLangSubListButton')
    if (!elangSettingsButton && !eLangSubListButton) {
      event.stopPropagation()
    }
  }

  const mouseUpEventHandler = (event: MouseEvent) => {
    //@ts-ignore
    const elangSettings = event.target.closest('[data-elangsettings]')

    if ((isNetflix || isYoutube || isCoursera) && settingsShown && !elangSettings) {
      document.addEventListener('click', resetHandler, true)

      dispatch(setSettingsYouTubeShown(false))

      const event = {
        category: 'Settings',
        action: 'CloseSettings',
        label: `OtherPlace, ${service}`,
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', mouseUpEventHandler)
    return () => {
      document.removeEventListener('click', resetHandler, true)
      window.removeEventListener('mouseup', mouseUpEventHandler)
    }
  }, [settingsShown])

  useEffect(() => {
    if (isNetflix && netflixSubsLinks) {
      setSubLinks(netflixSubsLinks)
    }
    if (isYoutube && youTubeLangKeys) {
      setSubLinks(youTubeLangKeys)
    }
    if (isCoursera && courseraSubsLinks) {
      setSubLinks(courseraSubsLinks)
    }
  }, [youTubeLangKeys, netflixSubsLinks, courseraSubsLinks])

  useEffect(() => {
    if (subLinks) {
      const langsKey = subLinks.map((item) => item.langCode.slice(0, 2))
      learningLanguageCode && !langsKey.includes(learningLanguageCode.slice(0, 2))
        ? setLanguageNativeError(card2.errors.missingError)
        : setLanguageNativeError('')

      localLanguageCode && !langsKey.includes(localLanguageCode.slice(0, 2))
        ? setLanguageTranslateError(card2.errors.missingError)
        : setLanguageTranslateError('')

      if (learningLanguageCode === localLanguageCode) {
        setLanguageTranslateError(card2.errors.sameLangError)
      }
    }
  }, [learningLanguageCode, localLanguageCode, subLinks?.length])

  useEffect(() => {
    if(languageNativeError || languageTranslateError) {
      dispatch(setLangErrors(true))
    } else {
      dispatch(setLangErrors(false))
    }
  }, [languageNativeError, languageTranslateError])

  const showHighlightWords = () => {
    dispatch(setAutoPause(!autoPauseOnHover))
  }

  const useHighlighWordsMethod = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation()
    if (e.target.id === 'toogleA') {
      if (isPaidSubscription) {
        showHighlightWords()
        autoPauseOnHover
          ? sendAmplitudeEvent('subs_highlight', { action: 'off', prem_user: 'yes' })
          : sendAmplitudeEvent('subs_highlight', { action: 'on', prem_user: 'yes' })
      } else {
        setIsShowHighlightTooltip(true)
        sendAmplitudeEvent('subs_highlight', { prem_user: 'no' })
      }
    }
  }

  const changeShowTargetLanguagesHandler = (langType: string) => {
    dispatch(setShowTargetLanguages(!showTargetLanguages))
    setLangType(langType)
  }

  const sendAnalyticsEvent = (action: string, label: string) => {
    const event = {
      category: 'Settings',
      action,
      label,
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const setBackgroundState = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    if (isNetflix) {
      dispatch(setBackgroundSubOnNetflix(!backgroundSubOnNetflix))
      !backgroundSubOnNetflix
        ? sendAmplitudeEvent('subs_background_change', { action: 'on' })
        : sendAmplitudeEvent('subs_background_change', { action: 'off' })
    }

    if (isYoutube) {
      dispatch(setBackgroundSubOnYt(!backgroundSubOnYt))
      !backgroundSubOnYt
        ? sendAmplitudeEvent('subs_background_change', { action: 'on' })
        : sendAmplitudeEvent('subs_background_change', { action: 'off' })
    }

    if (isCoursera) {
      dispatch(setBackgroundSubOnCoursera(!backgroundSubOnCoursera))
      !backgroundSubOnCoursera
        ? sendAmplitudeEvent('subs_background_change', { action: 'on' })
        : sendAmplitudeEvent('subs_background_change', { action: 'off' })
    }
  }

  const setShowTranslationState = (event: React.MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()

    if (isNetflix) {
      dispatch(setAlwaysShowTranslationOnNetflix(!alwaysShowTranslationOnNetflix))
      if (!alwaysShowTranslationOnNetflix) {
        setCheckListDate('subs')
        sendAmplitudeEvent('double_subs', { action: 'on', way: 'mouse', place: 'player_settings' })
      } else {
        sendAmplitudeEvent('double_subs', { action: 'off', way: 'mouse', place: 'player_settings' })
      }
    }
    if (isYoutube) {
      dispatch(setAlwaysShowTranslationOnYt(!alwaysShowTranslationOnYt))
      if (!alwaysShowTranslationOnYt) {
        setCheckListDate('subs')
        sendAmplitudeEvent('double_subs', { action: 'on', way: 'mouse', place: 'player_settings' })
      } else {
        sendAmplitudeEvent('double_subs', { action: 'off', way: 'mouse', place: 'player_settings' })
      }
    }

    if (isCoursera) {
      dispatch(setAlwaysShowTranslationOnCoursera(!alwaysShowTranslationOnCoursera))
      if (!alwaysShowTranslationOnCoursera) {
        setCheckListDate('subs')
        sendAmplitudeEvent('double_subs', { action: 'on', way: 'mouse', place: 'player_settings' })
      } else {
        sendAmplitudeEvent('double_subs', { action: 'off', way: 'mouse', place: 'player_settings' })
      }
    }
  }

  const classNameSettingWindow = clsx(`!absolute !w-[326px] !cursor-default
        ${settingsShown ? '!block' : '!hidden'}
        ${(isYoutube && !isNetflix && !isCoursera) && isFullscreenModeYt ? '!bottom-[70px] !right-[41px]' : ''}
        ${(isYoutube && !isNetflix && !isCoursera) && !isFullscreenModeYt ? '!bottom-[55px] !right-[100px]' : ''}
        ${(isNetflix && !isYoutube && !isCoursera) && isFullScreenOnNetflix ? '!bottom-[150px] !right-[20%]' : ''}
        ${(isNetflix && !isYoutube && !isCoursera) && !isFullScreenOnNetflix ? '!bottom-[130px] !right-[19%]' : ''}
        ${(isCoursera && !isYoutube && !isNetflix) && isFullScreen ? '!bottom-[70px] !right-[2%] !z-[10000]' : ''}
        ${(isCoursera && !isYoutube && !isNetflix) && !isFullScreen ? '!bottom-[55px] !right-[1%] !z-[10000]' : ''}
        ${isYoutube ? '!z-[100]' : '!z-[1200]'}
        ${isCoursera ? '!select-none' : ''}
      `)

  return (
    <div id="elangExtension">
      <div
        className={classNameSettingWindow}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        data-elangsettings
      >
        <div id="elangSettings" className="flex justify-between bg-gray-15 !h-[40px] rounded-t-lg" >
          {showTargetLanguages ? (
            <div className="flex items-center ml-[18px]">
              <div
                className="flex items-center cursor-pointer px-[3px]"
                onClick={() => changeShowTargetLanguagesHandler('')}
              >
                <ArrowLeft />
              </div>
              <span className="font-sans text-gray-100 text-[12px] ml-[3px]">
              {langType === 'localLang' ? card2.items.item1.title : card2.items.item0.title}
            </span>
            </div>
          ) : (
            <div className="flex items-center ml-[17px]" >
              <div className={`fill-current text-blue-400 ${isCoursera ? 'mb-[5px]' : ''}`}><PlayerLogoOn className="mr-[14px]" /></div>
              <div className="flex">
                <ELang className="mr-[14px]" />
                <Toggle
                  value={offExtension}
                  classNameOn="bg-blue-400"
                  textClassNameOn="text-8px text-blue-300"
                  textClassNameOff="text-8px text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (offExtension) {
                      dispatch(setOffExtension(!offExtension))
                    }
                    dispatch(setSettingsYouTubeShown(!settingsShown))
                    chrome.storage.sync.set({ offExtension: !offExtension })
                  }}
                />
              </div>
            </div>
          )}
          <div
            className="mr-[20px] mt-[13px] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              dispatch(setSettingsYouTubeShown(false))
              sendAnalyticsEvent('CloseSettings', `Cross, ${service}`)
            }}
          >
            <Cross />
          </div>
        </div>
        <div className="w-full h-full flex bg-gray-15" style={{ borderBottomRightRadius: '8px', borderBottomLeftRadius: '8px' }}>
          {showTargetLanguages && (netflixSubsLinks || youTubeLangKeys || courseraSubsLinks) ? (
            <ListTargetLanguages langType={langType} />
          ) : (
            <div className="w-full bg-gray-15 rounded-br-lg" style={{ backgroundColor: 'rgba(12, 13, 14, 0)' }}>
              <div className="flex items-start flex-col justify-center relative !h-[40px] mt-[6px]">
                <SettingOptionYouTube
                  className={'mb-0'}
                  sizeText={12}
                  text={card2.items.item0.title}
                  isHint={true}
                  tooltipText={card2.items.item0.tooltip}
                  options={
                    <div
                      className={`cursor-pointer flex items-center ${languageTranslateError || learningLanguageCode === localLanguageCode ? 'bg-red-600' : 'bg-gray-325'} rounded py-4px px-6px active:bg-gray-335 hover:bg-gray-330`}
                      onClick={() => changeShowTargetLanguagesHandler('learnLang')}
                    >
                      <div className="font-sans text-white	overflow-hidden whitespace-nowrap max-w-125 text-[12px] text-ellipsis">
                        {currentLearningLanguageName}
                      </div>
                      <ArrowRight className="ml-[6px]" />
                    </div>
                  }
                />
                {languageNativeError && <LanguageError text={languageNativeError} />}
              </div>
              <div className="flex items-start flex-col justify-center relative !h-[40px]">
                <SettingOptionYouTube
                  className={'mb-0'}
                  sizeText={12}
                  text={card2.items.item1.title}
                  isHint={true}
                  tooltipText={card2.items.item1.tooltip}
                  options={
                    <div
                      className={`cursor-pointer flex items-center ${languageTranslateError || learningLanguageCode === localLanguageCode ? 'bg-red-600' : 'bg-gray-325'} rounded py-4px px-6px active:bg-gray-335 hover:bg-gray-330`}
                      onClick={() => changeShowTargetLanguagesHandler('localLang')}
                    >
                      <div
                        className="font-sans text-white	overflow-hidden whitespace-nowrap max-w-125 text-[12px] text-ellipsis"
                      >
                        {currentLocalLanguageName}
                      </div>
                      <ArrowRight className="ml-[6px]" />
                    </div>
                  }
                />
                {languageTranslateError && <LanguageError text={card2.errors.sameLangError} />}
              </div>
              <div className="flex items-center !h-[40px]">
                <SettingOptionYouTube
                  className={'mb-10'}
                  sizeText={12}
                  text={card2.items.item8.title}
                  isHint={true}
                  tooltipText={card2.items.item8.tooltip}
                  options={
                    <Toggle
                      value={
                        isNetflix
                          ? alwaysShowTranslationOnNetflix
                          : isYoutube
                            ? alwaysShowTranslationOnYt
                            : isCoursera
                              ? alwaysShowTranslationOnCoursera
                              : false
                      }
                      classNameOn="bg-blue-400"
                      textClassNameOn="text-8px text-blue-300"
                      textClassNameOff="text-8px text-gray-400"
                      onClick={(e) => setShowTranslationState(e)}
                    />
                  }
                />
              </div>
              <div className="flex items-center !h-[40px]">
                <SettingOptionYouTube
                  className={'mb-10'}
                  sizeText={12}
                  text={card2.items.item9.title}
                  options={
                    <Toggle
                      value={
                        isNetflix ? backgroundSubOnNetflix : isYoutube ? backgroundSubOnYt : isCoursera ? backgroundSubOnCoursera : false
                      }
                      classNameOn="bg-blue-400"
                      textClassNameOn="text-8px text-blue-300"
                      textClassNameOff="text-8px text-gray-400"
                      onClick={(e) => setBackgroundState(e)}
                    />
                  }
                />
              </div>
              <div className="flex items-center !h-[40px]">
                <SettingOptionYouTube
                  className={'mb-10'}
                  sizeText={12}
                  text={card2.items.item3.title}
                  options={<FontSizeSelector settings="youtube" />}
                />
              </div>
              {/*Subtitle color*/}
              <div className="flex items-center !h-[40px]">
                <SettingOptionYouTube
                  className={'mb-10'}
                  sizeText={12}
                  text={card2.items.item4.title}
                  options={<ColorPicker settings="youTube" />}
                />
              </div>
              <div className="flex items-center relative !h-[40px]" onMouseLeave={() => setIsShowHighlightTooltip(false)}>
                {isShowHighlightTooltip && <PopupTooltip tooltipMessage="premium" isHighlightTooltip={true} />}
                <SettingOptionYouTube
                  className='mb-10'
                  sizeText={12}
                  text={card2.items.item10.title}
                  options={
                    <Toggle
                      value={isPaidSubscription ? autoPauseOnHover : false}
                      classNameOn="bg-blue-400"
                      textClassNameOn="text-8px text-blue-300"
                      textClassNameOff="text-8px text-gray-400"
                      onClick={(e) => useHighlighWordsMethod(e)}
                    />
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default React.memo(SettingsWindow)
