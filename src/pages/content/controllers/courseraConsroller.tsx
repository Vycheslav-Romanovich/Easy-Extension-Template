import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useForceUpdate } from 'react-custom-hook-use-force-update'
import { useDispatch, useSelector } from 'react-redux'
import Coursera from '../services/coursera'

import { RootState } from '../../background/store/reducers'
import { useStore } from 'effector-react'

import { subsStore, translatedSubsStore } from '../store'
import { updateSubs, updateTranslatedSubs } from '../events'
import { Subtitle } from '../../../constants/types'
import Captions from '../components/captions/captions/captions'
import { getService } from '../../../utils/url'
import { useLanguageContext } from '../../../context/LanguageContext'
import firebase from 'firebase'
import {
  setAlwaysShowTranslationOnCoursera,
  setBackgroundSubOnCoursera,
  setIsCourseraVideoHasFocus,
  setLearningLang,
  setLocalLang,
  setPositionOnBoarding,
  setSubtitleColorOnCousera,
  setSubtitleFontSizeOnCoursera,
} from '../../common/store/settingsActions'
import Navigation from '../components/navigation'
import VideoServiceSubWindow from '../../common/video-services-content/videoServiceSubWindow'
import ShowTranslationToggle from '../components/showTranslationToggle'
import SettingsWindow from '../../common/settingsWindow'
import ExtensionToggle from '../components/extensionToggle'
import { setCourseraSubsLinks, setCourseraVideoId, setVideoWordsTranslate } from '../../common/store/videoActions'
import { FullScreenContext } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

let customNavigationContainer: Element | null,
  subtitlePanel: Element | null,
  subtitleButton: Element | null,
  customCaptionsContainer: Element | null,
  settingsButton: Element | null,
  settingPanel: Element | null,
  showDoubleSubsBtn: Element | null

const coursera = new Coursera()

const CourseraController: React.FC = () => {
  const dispatch = useDispatch()
  const service = getService()
  const isCoursera = service === 'coursera'
  const subs = useStore(subsStore)
  const { locale } = useLanguageContext()

  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const localLanguage = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguage = useSelector<RootState, string>((state) => state.settings.learningLang)
  const subtitleFontSize = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnCoursera)
  const subtitleColor = useSelector<RootState, string>((state) => state.settings.subtitleColorOnCoursera)
  const subtitleBackground = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnCoursera)
  const isDoubleSubtitle = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  const [miniPlayerObserver, setMiniPlayerObserver] = useState<MutationObserver | null>(null)
  const [focusCourseraObserver, setFocusCourseraObserver] = useState<MutationObserver | null>(null)
  const [settingsMenuPopupObserver, setSettingsMenuPopupObserver] = useState<MutationObserver | null>(null)

  const [currentLanguage, setCurrentLanguage] = useState<string>('')
  const [isMiniPlayer, setIsMiniPlayer] = useState<boolean>(false)
  const [coursereVideoId, setCoursereVideoId] = useState<string>('')
  const [localeFullScreenCoursera, setLocaleFullScreenCoursera] = useState<boolean>(false)


  const videoTargetWidth = document.querySelector('video')?.clientWidth

  const UseForceUpdateFn = useForceUpdate()

  const timerHandler = () => {
    setLocaleFullScreenCoursera(document.fullscreen)
  }

  const addElements = (event: any) => {
    setCurrentLanguage(event.detail.lang)
    dispatch(setCourseraVideoId(event.detail.courseraVideoId))

    coursera
      .getSubs(learnLanguage, locale, event.detail.courseraVideoId)
      .then((subs) => {
        dispatch(setCourseraSubsLinks(subs))
      })
      .then(() => setCoursereVideoId(event.detail.courseraVideoId))

    if (!document.querySelector('.elang_captions_coursera')) {
      const captionsContainer = document.querySelector('.rc-VideoControlsContainer')
      customCaptionsContainer = document.createElement('div')
      customCaptionsContainer.classList.add('elang_captions_coursera')
      customCaptionsContainer.id = 'elangExtension'
      captionsContainer && captionsContainer.append(customCaptionsContainer)
    }

    if (!document.querySelector('.elang_navigation_wrapper')) {
      const videoContainer = document.querySelector('.rc-VideoControlsContainer')
      customNavigationContainer = document.createElement('div')
      customNavigationContainer.classList.add('elang_navigation_wrapper')

      videoContainer && videoContainer.append(customNavigationContainer)
    }

    if (!document.querySelector('.elang_subtitles_panel')) {
      const captionsContainer = document.querySelector('.rc-VideoControlsContainer')
      subtitlePanel = document.createElement('div')
      subtitlePanel.classList.add('elang_subtitles_panel')
      //@ts-ignore
      subtitlePanel.style = `position: absolute; right: 0; z-index: 60; ${isCoursera && 'top: 0;'}`
      subtitlePanel.id = 'elangExtension'
      captionsContainer && captionsContainer.insertBefore(subtitlePanel, captionsContainer.children[0])
    }

    if (!document.querySelector('.elang_subtitles_buttton')) {
      const captionsContainer = document.querySelector('.rc-VideoControlsContainer')
      subtitleButton = document.createElement('div')
      subtitleButton.classList.add('elang_subtitles_buttton')
      subtitleButton.id = 'elangExtension'
      captionsContainer && captionsContainer.insertBefore(subtitleButton, captionsContainer.children[0])
    }

    if (!document.querySelector('.elang_menu_wrapper')) {
      const captionsContainer = document.querySelector('.rc-VideoControlsContainer')
      settingPanel = document.createElement('div')
      settingPanel.classList.add('elang_menu_wrapper')
      captionsContainer && captionsContainer.insertBefore(settingPanel, captionsContainer.children[0])
    }

    if (!document.querySelector('.elang_toggle_window_wrapper')) {
      const settingsButtonContainer = document.querySelector('.rc-ControlBar')
      settingsButton = document.createElement('div')
      settingsButton.classList.add('elang_subtitles_buttton')
      settingsButton.id = 'elangExtension'
      settingsButtonContainer && settingsButtonContainer.insertBefore(settingsButton, settingsButtonContainer.children[5])
    }

    UseForceUpdateFn()
  }

  useEffect(() => {
    if (videoTargetWidth) {
      if (videoTargetWidth <= 640) {
        dispatch(setSubtitleFontSizeOnCoursera(14))
      }
      if (videoTargetWidth <= 800 && videoTargetWidth >= 641) {
        dispatch(setSubtitleFontSizeOnCoursera(18))
      }
      if (videoTargetWidth <= 940 && videoTargetWidth >= 801) {
        dispatch(setSubtitleFontSizeOnCoursera(20))
      }
      if (videoTargetWidth <= 1200 && videoTargetWidth >= 941) {
        dispatch(setSubtitleFontSizeOnCoursera(26))
      }
      if (videoTargetWidth < 1440 && videoTargetWidth >= 1201) {
        dispatch(setSubtitleFontSizeOnCoursera(30))
      }
      if (videoTargetWidth >= 1440) {
        dispatch(setSubtitleFontSizeOnCoursera(32))
      }
    }
  }, [videoTargetWidth])

  useEffect(() => {
    window.addEventListener('elangSubtitlesChanged', addElements)
    const timerForVideoId = setInterval(timerHandler, 500)
    coursera.init()

    chrome.storage.sync.get(['elangSettingsOnCoursera'], (settings) => {
      if (Object.keys(settings).length !== 0) {
        const param = settings.elangSettingsOnCoursera
        dispatch(setSubtitleFontSizeOnCoursera(param['fontSizeForCoursera']))
        dispatch(setSubtitleColorOnCousera(param['subtitleColorForCoursera']))
        dispatch(setBackgroundSubOnCoursera(param['subtitleBackgroundForCoursera']))
        dispatch(setAlwaysShowTranslationOnCoursera(param['isDoubleSubtitleOnCoursera']))
      }
    })

    if(!user) {
      chrome.storage.sync.get(['elangLaguagesPair'], (settings) => {
        if (Object.keys(settings).length !== 0) {
          const params = settings.elangLaguagesPair
          dispatch(setLocalLang(params.localLang))
          dispatch(setLearningLang(params.learningLang))

          chrome.runtime.sendMessage({
            component: 'sendAnalyticsCustomeEvent',
            event: { dimension: 'dimension4', value: `${learnLanguage}/${localLanguage}` },
          })
        }
      })
    }

    setMiniPlayerObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          //@ts-ignore
          if (mutation.target.classList[0] === 'rc-VideoMiniPlayer') {
            //@ts-ignore
            mutation.target.classList[1] === 'mini' ? setIsMiniPlayer(true) : setIsMiniPlayer(false)
          }
        })
      })
    )

    setFocusCourseraObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          const target = mutation.target as HTMLElement
          if (target.classList[target.classList.length - 1] === 'visible') {
            dispatch(setIsCourseraVideoHasFocus(true))
          } else {
            dispatch(setIsCourseraVideoHasFocus(false))
          }
        })
      })
    )

    setSettingsMenuPopupObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          const menuPopup = document.querySelector('.rc-SettingsMenuPopup')
          //@ts-ignore
          if(mutation.nextSibling?.classList[1] === 'visible') {
            //@ts-ignore
            menuPopup.style.zIndex = 100
          } else {
            //@ts-ignore
            menuPopup.style.zIndex = undefined
          }
        })
      })
    )

    return () => {
      window.removeEventListener('elangSubtitlesChanged', addElements)
      clearInterval(timerForVideoId)
    }
  }, [])

  const videoIsReady = () => {
    const miniPlayerContainer = document.querySelector('.rc-VideoMiniPlayer')
    const controlBarContainer = document.querySelector('.rc-ControlBar')
    const settingsMenuPopup = document.querySelector('.rc-VideoSettingsMenu')

    if (offExtension) {
      miniPlayerContainer && miniPlayerObserver && miniPlayerObserver.observe(miniPlayerContainer, { childList: true, subtree: true })
      controlBarContainer &&
        focusCourseraObserver &&
        focusCourseraObserver.observe(controlBarContainer, { childList: true, attributes: true })

      settingsMenuPopup &&
        settingsMenuPopupObserver &&
        settingsMenuPopupObserver.observe(settingsMenuPopup, { childList: true, subtree: true })

      if (!localStorage.getItem('watchingOnBoarding')) {
        document.querySelector('.ItemPageLayout_content_body')?.scrollTo(0, 100)
      }
    }
    if (!offExtension) {
      miniPlayerObserver?.disconnect()
      focusCourseraObserver?.disconnect()
      settingsMenuPopupObserver?.disconnect()
    }
  }

  useEffect(() => {
    window.addEventListener('elangSubsVideoReady', videoIsReady)
    return () => {
      window.removeEventListener('elangSubsVideoReady', videoIsReady)
    }
  })

  useEffect(() => {
    if (offExtension) {
      if (coursereVideoId) {
        if (!localStorage.getItem('watchingOnBoarding') && positionOnboarding !== 1) {
          dispatch(setPositionOnBoarding(1))
        }
        dispatch(setVideoWordsTranslate({}))

        sendAmplitudeEvent('video_count', { language: `${subs.languageName}`, resource: 'Coursera' })
      }
    }
  }, [coursereVideoId])

  useEffect(() => {
    if (localLanguage && coursereVideoId) {
      coursera.getTranslatedSubs(localLanguage, locale, coursereVideoId)
    }
  }, [localLanguage, coursereVideoId])

  useEffect(() => {
    if (currentLanguage && coursereVideoId) {
      coursera.getSubs(learnLanguage, locale, coursereVideoId).then((subs) => {
        dispatch(setCourseraSubsLinks(subs))
      })
    }
  }, [currentLanguage, learnLanguage, coursereVideoId])

  useEffect(() => {
    const obj = {
      fontSizeForCoursera: subtitleFontSize,
      subtitleColorForCoursera: subtitleColor,
      subtitleBackgroundForCoursera: subtitleBackground,
      isDoubleSubtitleOnCoursera: isDoubleSubtitle,
    }

    chrome.storage.sync.set({ elangSettingsOnCoursera: obj })
  }, [subtitleFontSize, subtitleColor, subtitleBackground, isDoubleSubtitle])

  useEffect(() => {
    if (isCoursera) {
      const obj = {
        localLang: localLanguage,
        learningLang: learnLanguage,
      }
      chrome.storage.sync.set({ elangLaguagesPair: obj })
    }
  }, [localLanguage, learnLanguage])


  return (
    <>
      {!isMiniPlayer && (
        <FullScreenContext.Provider value={{isFullScreen: localeFullScreenCoursera}}>
          {offExtension &&
            customCaptionsContainer &&
            // showSubs &&
            ReactDOM.createPortal(<Captions />, customCaptionsContainer)}
          {offExtension && customNavigationContainer && ReactDOM.createPortal(<Navigation />, customNavigationContainer)}
          {offExtension && localeFullScreenCoursera && subtitlePanel && ReactDOM.createPortal(<VideoServiceSubWindow />, subtitlePanel)}
          {offExtension && showDoubleSubsBtn && ReactDOM.createPortal(<ShowTranslationToggle isNetflixDouble={false} />, showDoubleSubsBtn)}
          {offExtension && settingPanel && ReactDOM.createPortal(<SettingsWindow />, settingPanel)}
          {settingsButton && ReactDOM.createPortal(<ExtensionToggle />, settingsButton)}
        </FullScreenContext.Provider>
      )}
    </>
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

export default CourseraController
