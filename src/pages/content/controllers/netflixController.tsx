import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactDOM from 'react-dom'
import { useForceUpdate } from 'react-custom-hook-use-force-update'

import { RootState } from '../../background/store/reducers'

import Netflix, { SubsLinksType } from '../services/netflix'
import { setNetflixSubsLinks, setVideoWordsTranslate } from '../../common/store/videoActions'

import Navigation from '../components/navigation'
import VideoServiceSubWindow from '../../common/video-services-content/videoServiceSubWindow'
import Captions from '../components/captions/captions/captions'
import ExtensionToggle from '../components/extensionToggle'
import ShowTranslationToggle from '../components/showTranslationToggle'
import SettingsWindow from '../../common/settingsWindow'

import { subsStore, translatedSubsStore } from '../store'
import { updateSubs, updateTranslatedSubs } from '../events'
import { Subtitle } from '../../../constants/types'

import {
  setAlwaysShowTranslationOnNetflix,
  setBackgroundSubOnNetflix,
  setExpandCaptionsWrapperOnNetflix,
  setIsNetflixVideoHasFocus,
  setSubtitleColorOnNetflix,
  setSubtitleFontSizeOnNetflix,
  setLearningLang,
  setLocalLang,
  setFullScreenOnNetflix,
  setPositionOnBoarding,
} from '../../common/store/settingsActions'
import Subs from '../subs'
import { getService } from '../../../utils/url'
import { useLanguageContext } from '../../../context/LanguageContext'
import firebase from 'firebase/auth'
import { getLanguageName } from '../../../constants/supportedLanguages'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

let customNavigationContainer: Element | null,
  subtitlePanel: Element | null,
  subtitleButton: Element | null,
  customCaptionsContainer: Element | null,
  settingsButton: Element | null,
  settingPanel: Element | null,
  showDoubleSubsBtn: Element | null

const netflix = new Netflix()

const NetflixController: React.FC = () => {
  const dispatch = useDispatch()
  const service = getService()
  const isNetflix = service === 'netflix'

  const [currentLanguage, setCurrentLanguage] = useState<string>('')
  const [subLinksLocalState, setSubLinksLocalState] = useState<Array<SubsLinksType> | undefined>(undefined)
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)

  const [focusObserver, setFocusObserver] = useState<MutationObserver | null>(null)
  const [originalSubsObserver, setOriginalSubsObserver] = useState<MutationObserver | null>(null)
  const [arabicSubsObserver, setArabicSubsObserver] = useState<MutationObserver | null>(null)
  const [settingsPanelObserver, setSettingsPanelObserver] = useState<MutationObserver | null>(null)
  const [doubleSubsObserver, setDoubleSubsObserver] = useState<MutationObserver | null>(null)
  const [videoId, setVideoId] = useState<string>('')
  const [loadSubs, setLoadSubs] = useState<boolean>(false)
  //settings
  const subtitleFontSize = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnNetflix)
  const subtitleColor = useSelector<RootState, string>((state) => state.settings.subtitleColorOnNetflix)
  const subtitleExpand = useSelector<RootState, boolean>((state) => state.settings.expandCaptionsWrapperOnNetflix)
  const subtitleBackground = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnNetflix)
  const isDoubleSubtitle = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const videoTargetWidth: any = document.querySelector('video')?.offsetWidth

  const { locale } = useLanguageContext()

  const UseForceUpdateFn = useForceUpdate()

  const nullthrows = (v: HTMLElement) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function injectCode(src: string) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      console.log('Inject srcipt Netflix');
      //@ts-ignore
        this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

  const timerHandler = () => {
    setVideoId(netflix.getMoveId())

    dispatch(setFullScreenOnNetflix(document.fullscreen))
  }

  //func for get sublinks a
  // eslint-disable-next-line
  const addElements = (event: any) => {
    setCurrentLanguage(event.detail)

    if (!document.querySelector('.elang_captions')) {
      const captionsContainer = document.querySelector('[data-uia="video-canvas"]')?.parentElement
      customCaptionsContainer = document.createElement('div')
      customCaptionsContainer.classList.add('elang_captions')
      customCaptionsContainer.id = 'elangExtension'
      captionsContainer && captionsContainer.insertBefore(customCaptionsContainer, captionsContainer.children[0])
      if (captionsContainer && captionsContainer.children) {
        //@ts-ignore
        const arrHtmlCollectionVideoContainer = [...captionsContainer.children]
        arrHtmlCollectionVideoContainer.forEach((el) => {
          if (el.className === 'image-based-subtitles') {
            el.children[0].style = 'display: none'
          }
        })
      }
    }

    if (!document.querySelector('.elang_navigation_wrapper')) {
      const videoContainer = document.querySelector('[data-uia="video-canvas"]')?.parentElement
      customNavigationContainer = document.createElement('div')
      customNavigationContainer.classList.add('elang_navigation_wrapper')

      videoContainer && videoContainer.append(customNavigationContainer)
    }

    if (!document.querySelector('.elang_subtitles_panel')) {
      const captionsContainer = document.querySelector('[data-uia="video-canvas"]')?.parentElement
      subtitlePanel = document.createElement('div')
      subtitlePanel.classList.add('elang_subtitles_panel')
      //@ts-ignore
      subtitlePanel.style = `position: absolute; right: 0; z-index: 60;`
      subtitlePanel.id = 'elangExtension'
      captionsContainer && captionsContainer.insertBefore(subtitlePanel, captionsContainer.children[0])
    }

    if (!document.querySelector('.elang_subtitles_buttton')) {
      const captionsContainer = document.querySelector('[data-uia="video-canvas"]')?.parentElement
      subtitleButton = document.createElement('div')
      subtitleButton.classList.add('elang_subtitles_buttton')
      subtitleButton.id = 'elangExtension'
      captionsContainer && captionsContainer.insertBefore(subtitleButton, captionsContainer.children[0])
    }

    if (!document.querySelector('.elang_toggle_window_wrapper')) {
      const settingsButtonContainer = document.querySelector('[data-uia="control-audio-subtitle"]')?.parentElement?.parentElement
      settingsButton = document.createElement('div')
      settingsButton.classList.add('elang_subtitles_buttton')
      settingsButton.id = 'elangExtension'
      settingsButtonContainer && settingsButtonContainer.insertBefore(settingsButton, settingsButtonContainer.children[0])
    }

    if (!document.querySelector('.elang_menu_wrapper')) {
      const captionsContainer = document.querySelector('[data-uia="video-canvas"]')?.parentElement
      settingPanel = document.createElement('div')
      settingPanel.classList.add('elang_menu_wrapper')
      captionsContainer && captionsContainer.insertBefore(settingPanel, captionsContainer.children[0])
    }

    UseForceUpdateFn()
  }


  if (document.querySelector('[data-uia="control-audio-subtitle"]') && !loadSubs) {
    setLoadSubs(true)
  }

  useEffect(() => {
    if (videoTargetWidth <= 640) {
      dispatch(setSubtitleFontSizeOnNetflix(14))
    }
    if (videoTargetWidth <= 800 && videoTargetWidth >= 641) {
      dispatch(setSubtitleFontSizeOnNetflix(18))
    }
    if (videoTargetWidth <= 940 && videoTargetWidth >= 801) {
      dispatch(setSubtitleFontSizeOnNetflix(20))
    }
    if (videoTargetWidth <= 1200 && videoTargetWidth >= 941) {
      dispatch(setSubtitleFontSizeOnNetflix(26))
    }
    if (videoTargetWidth < 1440 && videoTargetWidth >= 1201) {
      dispatch(setSubtitleFontSizeOnNetflix(30))
    }
    if (videoTargetWidth >= 1440) {
      dispatch(setSubtitleFontSizeOnNetflix(32))
    }
  }, [videoTargetWidth])

  //add event in window for get subtitles
  useEffect(() => {
    //injectScriptPlayer
    injectCode(chrome.runtime.getURL('/netflixScript.js'));
    document.querySelector('html')?.setAttribute('id', 'netflix')

    window.addEventListener('elangSubsSubtitlesChanged', addElements)
    const timerForVideoId = setInterval(timerHandler, 500)

    chrome.storage.sync.get(['elangSettingsOnNetflix'], (settings) => {
      if (Object.keys(settings).length !== 0) {
        const param = settings.elangSettingsOnNetflix
        dispatch(setSubtitleFontSizeOnNetflix(param['fontSizeForNetflix']))
        dispatch(setSubtitleColorOnNetflix(param['subtitleColorForNetflix']))
        dispatch(setExpandCaptionsWrapperOnNetflix(param['expandForNetflix']))
        dispatch(setBackgroundSubOnNetflix(param['subtitleBackgroundForNetflix']))
        dispatch(setAlwaysShowTranslationOnNetflix(param['isDoubleSubtitleOnNetflix']))
      }
    })

    if (!user) {
      chrome.storage.sync.get(['elangLaguagesPair'], (settings) => {
        if (Object.keys(settings).length !== 0) {
          const params = settings.elangLaguagesPair
          dispatch(setLocalLang(params.localLang))
          dispatch(setLearningLang(params.learningLang))

          chrome.runtime.sendMessage({
            component: 'sendAnalyticsCustomeEvent',
            event: { dimension: 'dimension4', value: `${learnLanguageCode}/${localLanguageCode}` },
          })
        }
      })
    }

    // netflix.init()

    setFocusObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          const target = mutation.target as HTMLElement
          if (target.classList[0]) {
            if (mutation.type === 'attributes' && target.classList[0].match(/^active/)) {
              dispatch(setIsNetflixVideoHasFocus(true))
            } else {
              dispatch(setIsNetflixVideoHasFocus(false))
            }
          }
        })
      })
    )

    setOriginalSubsObserver(
      new MutationObserver((mutationsList: MutationRecord[]): void => {
        mutationsList.forEach((mutation: MutationRecord) => {
          const containerOriginalSubs = mutation.target as HTMLElement
          if (containerOriginalSubs) {
            //@ts-ignore
            containerOriginalSubs.style = 'display: none'
          }
        })
      })
    )
    setArabicSubsObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          const target = mutation.target as HTMLElement
          if (target) {
            //@ts-ignore
            const arrHtmlCollection = [...target.children]
            arrHtmlCollection.forEach((el) => {
              if (el.className === 'image-based-subtitles') {
                el.children[0].style = 'display: none'
              }
            })
          }
        })
      })
    )

    setSettingsPanelObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          if (mutation.addedNodes[0]) {
            const settingsButtonContainer = document.querySelector('[data-uia="control-audio-subtitle"]')?.parentElement?.parentElement
            settingsButtonContainer &&
              settingsButton &&
              settingsButtonContainer.insertBefore(settingsButton, settingsButtonContainer.children[0])
          }
        })
      })
    )

    setDoubleSubsObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          if (mutation.addedNodes[0]) {
            const settingsButtonContainer = document.querySelector('[data-uia="control-forward10"]')?.parentElement?.parentElement
            showDoubleSubsBtn &&
              settingsButtonContainer &&
              settingsButtonContainer.insertBefore(showDoubleSubsBtn, settingsButtonContainer.children[8])
          }
        })
      })
    )

    return () => {
      window.removeEventListener('elangSubsSubtitlesChanged', addElements)
      clearInterval(timerForVideoId)
    }
  }, [])

  useEffect(() => {
    setLoadSubs(false)
    if (videoId) {
      if (!localStorage.getItem('watchingOnBoarding') && positionOnboarding !== 1) {
        dispatch(setPositionOnBoarding(1))
      }
    }
    if (videoId && currentLanguage) {
      Subs.clearSubs()
      window.dispatchEvent(new CustomEvent('elangSubsSubtitlesChanged', { detail: currentLanguage }))
    }
  }, [videoId])

  useEffect(() => {
    const videoContainer = document.querySelector('[data-videoid]')
    const containerOriginalSubs = document.querySelector('.player-timedtext')

    if (videoId || offExtension) {

      if (videoContainer) {
        focusObserver?.observe(videoContainer, {
          attributes: true,
        })
        settingsPanelObserver?.observe(videoContainer, {
          childList: true,
        })
        doubleSubsObserver?.observe(videoContainer, {
          childList: true,
        })
        arabicSubsObserver?.observe(videoContainer, {
          childList: true,
        })
      }

      containerOriginalSubs &&
        originalSubsObserver?.observe(containerOriginalSubs, {
          childList: true,
        })

      // fullScreenButton &&
      //   fullScreenNetflixObserver?.observe(fullScreenButton, {
      //     attributes: true,
      //   })
    }
    if (!videoId || !offExtension) {
      focusObserver?.disconnect()
      originalSubsObserver?.disconnect()
      arabicSubsObserver?.disconnect()
      doubleSubsObserver?.disconnect()
      // fullScreenNetflixObserver?.disconnect()
    }
    if (!offExtension && videoContainer) {
      //@ts-ignore
      const arrHtmlCollectionVideoContainer = [...videoContainer.children]
      arrHtmlCollectionVideoContainer.forEach((el) => {
        if (el.className === 'image-based-subtitles') {
          el.children[0].style = 'display: block'
        }
      })
    }
  }, [videoId, offExtension])

  useEffect(() => {
    if (subLinksLocalState && localLanguageCode) {
      netflix.getTranslatedSubs(subLinksLocalState, localLanguageCode)
    }
  }, [subLinksLocalState, localLanguageCode, netflix.isUpdateSubsCache])

  useEffect(() => {
    if (currentLanguage) {
      netflix.getSubs(learnLanguageCode, locale).then((subs) => {
        setSubLinksLocalState(subs)
        dispatch(setNetflixSubsLinks(subs))
      })
    }
  }, [currentLanguage, learnLanguageCode, videoId, netflix.isUpdateSubsCache, locale])

  //for analytic
  useEffect(() => {
    if (learnLanguageCode && netflix.getMoveId()) {
      if (offExtension) {
        dispatch(setVideoWordsTranslate({}))

        sendAmplitudeEvent('video_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: 'Netflix' })
      }
    }
  }, [netflix.getMoveId()])

  useEffect(() => {
    const obj = {
      fontSizeForNetflix: subtitleFontSize,
      subtitleColorForNetflix: subtitleColor,
      expandForNetflix: subtitleExpand,
      subtitleBackgroundForNetflix: subtitleBackground,
      isDoubleSubtitleOnNetflix: isDoubleSubtitle,
    }

    chrome.storage.sync.set({ elangSettingsOnNetflix: obj })
  }, [subtitleFontSize, subtitleColor, subtitleExpand, subtitleBackground, isDoubleSubtitle])

  useEffect(() => {
    if (isNetflix) {
      const obj = {
        localLang: localLanguageCode,
        learningLang: learnLanguageCode,
      }
      chrome.storage.sync.set({ elangLaguagesPair: obj })
    }
  }, [localLanguageCode, learnLanguageCode])

  return (
    <div className={'text-name flex justify-center items-center'}>
      {offExtension && customNavigationContainer && ReactDOM.createPortal(<Navigation />, customNavigationContainer)}
      {offExtension && subtitlePanel && ReactDOM.createPortal(<VideoServiceSubWindow />, subtitlePanel)}
      {offExtension &&
        customCaptionsContainer &&
        ReactDOM.createPortal(<Captions />, customCaptionsContainer)}
      {offExtension && showDoubleSubsBtn && ReactDOM.createPortal(<ShowTranslationToggle isNetflixDouble={true} />, showDoubleSubsBtn)}
      {offExtension && settingPanel && ReactDOM.createPortal(<SettingsWindow />, settingPanel)}
      {settingsButton && ReactDOM.createPortal(<ExtensionToggle />, settingsButton)}
    </div>
  )
}

// eslint-disable-next-line
;(subsStore as any).on(updateSubs, (state: Subtitle, subs: Subtitle) => {
  return subs
})

// eslint-disable-next-line
;(translatedSubsStore as any).on(updateTranslatedSubs, (state: Subtitle, subs: Subtitle) => {
  return subs
})

export default NetflixController
