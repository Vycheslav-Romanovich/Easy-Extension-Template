import React, { useCallback, useEffect, useState } from 'react'
import { useForceUpdate } from 'react-custom-hook-use-force-update'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useStore } from 'effector-react'

import { Subtitle } from '../../../constants/types'
import { subsStore } from '../store'
import { RootState } from '../../background/store/reducers'
import { updateSubs } from '../events'
import { getService } from '../../../utils/url'
import Subs from '../subs'
import YouTube from '../services/youtube'

import SearchWithSubtitlesToggle from '../components/searchWithSubtitlesToggle'
import ShowTranslationToggle from '../components/showTranslationToggle'
import Navigation from '../components/navigation'

import VideoServiceSubWindow from '../../common/video-services-content/videoServiceSubWindow'
import Captions from '../components/captions/captions/captions'

import { setVideoWordsTranslate, setYoutubeLangKeys } from '../../common/store/videoActions'
import {
  setIsFocusOnYt,
  setSubtitleFontSizeOnYt,
  setSubtitleColorOnYt,
  setExpandCaptionsWrapperOnYt,
  setBackgroundSubOnYt,
  setLearningLang,
  setAlwaysShowTranslationOnYt,
  setLocalLang,
  setSubsShowOnYt,
  setPositionOnBoarding,
  setDarkModeInYoutube,
} from '../../common/store/settingsActions'
import ExtensionToggle from '../components/extensionToggle'
import SettingsWindow from '../../common/settingsWindow'
import { useLanguageContext } from '../../../context/LanguageContext'
import firebase from 'firebase/auth'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

let customNavigationContainer: Element | null,
  customSwitchContainer: Element | null,
  customSubsContainer: Element | null,
  subsListButtonParent: Element | null,
  ytCustomCaption: Element | null,
  showTranslationParent: Element | null,
  settingsButton: Element | null,
  settingPanel: Element | null

const addExtensionElement = (className: string): HTMLElement => {
  const container = document.createElement('div')
  container.classList.add(className)
  container.id = 'elangExtension'
  return container
}

export const checkWideScreenValue = (): boolean => {
  const wideScreenChild = document.querySelector('#player-container.style-scope.ytd-watch-flexy');
  return !!document.getElementById('player-theater-container')?.contains(wideScreenChild);
}

const youTube = new YouTube()

const YoutubeController: React.FC = () => {
  const dispatch = useDispatch()
  const service = getService()
  const subs = useStore(subsStore)
  const isYoutube = service === 'youtube'

  const { locale } = useLanguageContext()

  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const localLanguage = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguage = useSelector<RootState, string>((state) => state.settings.learningLang)
  const isFocusOnYt = useSelector<RootState, boolean>((state) => state.settings.isYtVideoHasFocus)
  //settings
  const subtitleFontSize = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnYt)
  const subtitleColor = useSelector<RootState, string>((state) => state.settings.subtitleColorOnYt)
  const subtitleExpand = useSelector<RootState, boolean>((state) => state.settings.expandCaptionsWrapperOnYt)
  const subtitleBackground = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnYt)
  const isDoubleSubtitle = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  const [videoId, setVideoId] = useState<string>('')
  const [subsShowed, setSubsShowed] = useState<boolean>(false)
  const [subsUrlObject, setSubsUrlObject] = useState<URL | undefined>(undefined)
  const [readyNavigationSubsContainer, setReadyNavigationSubsContainer] = useState<Element | null>(null)
  const [readyNavigationSubsContainerParent, setReadyNavigationSubsContainerParent] = useState<Element | null>(null)

  const [miniPlayerObserver, setMiniPlayerObserver] = useState<MutationObserver | null>(null)
  const [subShowObserver, setSubShowObserver] = useState<MutationObserver | null>(null)
  const [focusObserver, setFocusObserver] = useState<MutationObserver | null>(null)
  const [originalSubsObserver, setOriginalSubsObserver] = useState<MutationObserver | null>(null)
  const [clickSubsObserver, setClickSubsObserver] = useState<MutationObserver | null>(null)
  const [commentDisableObserver, setCommentDisableObserver] = useState<MutationObserver | null>(null)
  const [recomendationDisableObserver, setRecomendationDisableObserver] = useState<MutationObserver | null>(null)
  const [originSubsTextObserver, setOriginSubsTextObserver] = useState<MutationObserver | null>(null)
  const [isWatchOnBoardingSearchSubtitleBtn, setIsWatchOnBoardingSearchSubtitleBtn] = useState<boolean | null>(false)
  const subsShowOnYt = useSelector<RootState, boolean>((state) => state.settings.subsShowOnYt)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const [isFullscreenModeYt, setIsFullscreenModeYt] = useState<boolean>(false)
  const [isWidescreenModeYt, setIsWidescreenModeYt] = useState<boolean>(false)

  const [isNoSubs, setIsNoSubs] = useState<boolean>(false)
  const [showTooltipNoSubs, setShowTooltipNoSubs] = useState<boolean>(false)
  const [showSubs, setShowSubs] = useState<boolean>(false)
  const [miniPlayerAttrLength, setMiniPlayerAttrLength] = useState<number>(4)
  const [loadSubtitlesWindow, setLoadSubtitlesWindow] = useState<boolean>(false)
  const [loadSubtitles, setLoadSubtitles] = useState<boolean>(false)

  const videoTargetWidth: any = document.querySelector('video')?.offsetWidth

  const useForceUpdateFn = useForceUpdate()

  const nullthrows = (v: HTMLElement) => {
    if (v == null) throw new Error("it's a null");
    return v;
}

function injectCode(src: string) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      //@ts-ignore
        this.remove();
    };

    // This script runs before the <head> element is created,
    // so we add the script to <html> instead.
    nullthrows(document.head || document.documentElement).appendChild(script);
}

  /*if (!loadSubtitlesWindow) {
    const youTubeSubtitlesWindow = document.querySelector('[target-id="engagement-panel-searchable-transcript"]')
    if (youTubeSubtitlesWindow) {
      setLoadSubtitlesWindow(true)
    }
  }

  if (!loadSubtitles) {
    const subsList = document.querySelector('#segments-container')
    if (subsList) {
      setLoadSubtitles(true)
      const subsList = document.querySelectorAll('[target-id="engagement-panel-searchable-transcript"] .ytd-transcript-segment-renderer')
      const panelTarget = document.querySelector('[panel-target-id="engagement-panel-searchable-transcript"].ytd-engagement-panel-section-list-renderer')
      panelTarget?.setAttribute('panel-content-visible' , '')
      subsList && subsList.forEach((item) => {
        item.setAttribute('style', 'font-size:16px;');
      })
    }
  }

  useEffect(() => {
    const youTubeSubtitlesWindow = document.querySelector('[target-id="engagement-panel-searchable-transcript"]')
    const panelTarget = document.querySelector('[panel-target-id="engagement-panel-searchable-transcript"].ytd-engagement-panel-section-list-renderer')

    if (subsShowOnYt) {
      youTubeSubtitlesWindow && youTubeSubtitlesWindow.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPENTED')
      panelTarget?.setAttribute('panel-content-visible' , '')
    } else {
      youTubeSubtitlesWindow && youTubeSubtitlesWindow.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN')
    }
  }, [subsShowOnYt, loadSubtitlesWindow])*/


  const configForFindDarkMode = {
    attributes: true,
    childList: false,
    subtree: false,
  }

  // eslint-disable-next-line
  const checkOnDarkMode = function (mutationsList: any) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        // eslint-disable-next-line
        if (document.querySelector('html')!.hasAttribute('dark') && getService() === 'youtube') {
          dispatch(setDarkModeInYoutube(true))
        } else {
          dispatch(setDarkModeInYoutube(false))
        }
      }
    }
  }

  const createDisabledElement = (domElement: Element | null) => {
    const divElement = document.createElement('div');
    divElement.setAttribute('style', 'position:absolute; inset:0; z-index:2026;');
    divElement.setAttribute('class', 'onBoardingDisable');

    domElement?.appendChild(divElement)
  }

  useEffect(() => {
    // eslint-disable-next-line
    const documentHtml = document.querySelector('html')!
    documentHtml && getService() === 'youtube' && dispatch(setDarkModeInYoutube(documentHtml.hasAttribute('dark')))
    const observer = new MutationObserver(checkOnDarkMode)
    observer.observe(documentHtml, configForFindDarkMode)
    return () => {
      observer.disconnect()
    }
  }, [])

  const handleClickForTooltipNoSubs = useCallback(() => {
    setShowTooltipNoSubs(true)
  }, [showTooltipNoSubs])

  const handleClickForShowSubsOnYt = useCallback(() => {
    dispatch(setSubsShowOnYt(!subsShowOnYt))

    const event = {
      category: 'SubButton',
      action: 'ShowSubsList',
      label: `${!subsShowOnYt}, ${subs.languageName}, ${getService()}`,
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }, [subs.text, subsShowOnYt])

  const configForMutation = {
    attributes: true,
  }

  const timerHandler = () => {
    const btnSub = document.querySelector('.ytp-subtitles-button.ytp-button')
    const btnSvg = document.querySelector('.ytp-subtitles-button-icon')
    setVideoId(youTube.getVideoId())
    setIsFullscreenModeYt(document.fullscreen)
    setIsWidescreenModeYt(checkWideScreenValue())
    setReadyNavigationSubsContainerParent(document.querySelector('#secondary-inner'))
    //@ts-ignore
    if (btnSub && btnSub?.getAttribute('aria-pressed') === 'true') {
      setIsNoSubs(false)
    } else if (btnSvg && btnSvg.getAttribute('fill-opacity') === '1') {
      setIsNoSubs(false)
    } else if (btnSvg && btnSvg.getAttribute('fill-opacity') === '0.3') {
      setIsNoSubs(true)
    }
    if (btnSub?.getAttribute('aria-pressed') === 'true') {
      setShowSubs(true)
    } else {
      setShowSubs(false)
    }
  }

  //  таймер хендлер прячет тултип с надписью - нет субтитров
  const timerHandlerForTooltipNoSubs = () => {
    setShowTooltipNoSubs(false)
  }

  //This func add subs and elements on page
  // eslint-disable-next-line
  const eventHandler = (event: any) => {
    if (event.type === 'eLangSubsChanged' && event.detail) {
      youTube.getSubs(event.detail, learnLanguage, locale).then((urlObject) => {
        setSubsUrlObject(urlObject)
        //@ts-ignore
        youTube.getTranslatedSubs(urlObject, localLanguage, 'local', locale).then(() => offSubstitles())
      })
    }
    setVideoId(youTube.getVideoId())

    const originalFormContainer = document.querySelector('#search.style-scope.ytd-masthead')
    const originalSearchBtn = document.querySelector('#search-icon-legacy')

    const originRecomendContainer = document.querySelector('#secondary-inner')

    const videoContainer = document.querySelector('#movie_player')
    const videoCont = document.querySelector('#movie_player')
    const btnYoutubeSubs = document.querySelector('.ytp-subtitles-button.ytp-button')
    const captionOriginalContainer = document.querySelector('#movie_player')
    const youtubeControlsRight = document.querySelector('.ytp-right-controls')

    if (!document.querySelector('.elang_navigation_wrapper')) {
      customNavigationContainer = addExtensionElement('elang_navigation_wrapper')
      videoCont && videoCont.insertBefore(customNavigationContainer, videoCont.children[0])
      //включает субтитры при первом запуске ютуба
      //@ts-ignore
      if (btnYoutubeSubs) {
        //@ts-ignore
        btnYoutubeSubs.click()
        setSubsShowed(true)
      }
    }

    if (!document.querySelector('.elang_search_with_subtitle_toggle_wrapper')) {
      customSwitchContainer = addExtensionElement('elang_search_with_subtitle_toggle_wrapper')
      originalFormContainer && originalFormContainer.insertBefore(customSwitchContainer, originalSearchBtn)
    }

    if (!document.querySelector('.elang_toggle_window_wrapper')) {
      settingsButton = addExtensionElement('elang_toggle_window_wrapper')
      if (youtubeControlsRight) {
        //@ts-ignore
        youtubeControlsRight.style.display = 'flex'
      }

      youtubeControlsRight && youtubeControlsRight.insertBefore(settingsButton, youtubeControlsRight.children[2])
    }

    if (!document.querySelector('.elang_youtube_window_wrapper')) {
      customSubsContainer = addExtensionElement('elang_youtube_window_wrapper')

      originRecomendContainer && originRecomendContainer.insertBefore(customSubsContainer, originRecomendContainer.children[0])
      setReadyNavigationSubsContainer(customSubsContainer)
    }

    if (!document.querySelector('.elang_subs_list_button_wrapper')) {
      subsListButtonParent = addExtensionElement('elang_subs_list_button_wrapper')
      videoContainer && videoContainer.append(subsListButtonParent)
    }

    if (!document.querySelector('.elang_captions_wrapper')) {
      ytCustomCaption = addExtensionElement('elang_captions_wrapper')
      captionOriginalContainer && captionOriginalContainer.append(ytCustomCaption)
      captionOriginalContainer && captionOriginalContainer.classList.add('elang_captions_wrapper')
    }

    if (!document.querySelector('.elang_menu_wrapper')) {
      settingPanel = addExtensionElement('elang_menu_wrapper')
      videoCont && videoCont.insertBefore(settingPanel, videoCont.children[0])
    }

    useForceUpdateFn()
  }

  const hanleClickBtnSubs = (e: any) => {
    if (e.isTrusted) {
      if (e.target?.getAttribute('aria-pressed') === 'false') {
        localStorage.setItem('isSubsOff', `isSubsOff-${e.isTrusted}`)
      } else {
        localStorage.setItem('isSubsOff', `isSubsOn-${e.isTrusted}`)
      }
    }
  }

  const offSubstitles = () => {
    if (localStorage.getItem('isSubsOff')?.includes('isSubsOff')) {
      const subsBtn = document.querySelector('.ytp-subtitles-button.ytp-button')
      if (subsBtn) {
        //@ts-ignore
        subsBtn.click()
      }
    }
  }

  useEffect(() => {
    if (
      showSubs &&
      (localStorage.getItem('isSubsOff') === null ||
        localStorage.getItem('isSubsOff') === 'isSubsOn-true' ||
        localStorage.getItem('isSubsOff') === 'isSubsOff-true')
    ) {
      document.querySelector('.ytp-subtitles-button.ytp-button')?.addEventListener('click', (e) => hanleClickBtnSubs(e))
    }

    return () => document.querySelector('.ytp-subtitles-button.ytp-button')?.removeEventListener('click', (e) => hanleClickBtnSubs(e))
  }, [showSubs])

  useEffect(() => {
    window.addEventListener('eLangSubsChanged', eventHandler)
    return () => {
      window.removeEventListener('eLangSubsChanged', eventHandler)
    }
  }, [learnLanguage, localLanguage])

  useEffect(() => {
    if (videoTargetWidth <= 640) {
      dispatch(setSubtitleFontSizeOnYt(14))
    }
    if (videoTargetWidth <= 800 && videoTargetWidth >= 641) {
      dispatch(setSubtitleFontSizeOnYt(18))
    }
    if (videoTargetWidth <= 940 && videoTargetWidth >= 801) {
      dispatch(setSubtitleFontSizeOnYt(20))
    }
    if (videoTargetWidth <= 1200 && videoTargetWidth >= 941) {
      dispatch(setSubtitleFontSizeOnYt(26))
    }
    if (videoTargetWidth < 1440 && videoTargetWidth >= 1201) {
      dispatch(setSubtitleFontSizeOnYt(30))
    }
    if (videoTargetWidth >= 1440) {
      dispatch(setSubtitleFontSizeOnYt(32))
    }
  }, [videoTargetWidth])

  //add event in window for get subtitles
  useEffect(() => {
    //injectScriptPlayer
    injectCode(chrome.runtime.getURL('/youtubeScript.js'));

    document.querySelector('html')?.setAttribute('id', 'youtube')
    window.addEventListener('eLangChangeWindowSize', eventHandler)
    const timerForVideoId = setInterval(timerHandler, 500)
    chrome.storage.sync.get(['elangSettingsOnYt'], (settings) => {
      if (Object.keys(settings).length !== 0) {
        const params = settings.elangSettingsOnYt
        dispatch(setSubtitleFontSizeOnYt(params.fontSizeForYt))
        dispatch(setSubtitleColorOnYt(params.subtitleColorForYt))
        dispatch(setExpandCaptionsWrapperOnYt(params.expandForYt))
        dispatch(setBackgroundSubOnYt(params.subtitleBackgroundForYt))
        dispatch(setAlwaysShowTranslationOnYt(params.isDoubleSubtitleOnYt))
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
            event: { dimension: 'dimension4', value: `${learnLanguage}/${localLanguage}` },
          })
        }
      })
    }

    // youTube.init()
    // injectScript()
    

    setSubShowObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          if (mutation.attributeName === 'aria-pressed') {
            //@ts-ignore
            if (mutation.target.getAttribute('aria-pressed') === 'false') {
              setSubsShowed(false)
              //@ts-ignore
              document.querySelector('.ytp-subtitles-button.ytp-button').click()

              //@ts-ignore
            } else if (mutation.target.getAttribute('aria-pressed') === 'true') {
              setSubsShowed(true)
            }
          }
        })
      })
    )

    setMiniPlayerObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          //@ts-ignore
          setMiniPlayerAttrLength(mutation.target.attributes.length)
        })
      })
    )

    setFocusObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          // @ts-ignore
          if (mutation.target.classList && mutation.target.classList.contains('ytp-autohide')) {
            window.dispatchEvent(new CustomEvent('focused', { detail: false }))
            dispatch(setIsFocusOnYt(false))
          } else {
            window.dispatchEvent(new CustomEvent('focused', { detail: true }))
            dispatch(setIsFocusOnYt(true))
          }
        })
      })
    )

    setOriginalSubsObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach((mutation: MutationRecord) => {
          //@ts-ignore
          if (mutation.type === 'childList' && mutation.target.classList.contains('ytp-caption-window-container')) {
            const originalCaptionsYtContainer = document.querySelector('.ytp-caption-window-container')
            if (originalCaptionsYtContainer) {
              //@ts-ignore
              originalCaptionsYtContainer.style.display = 'none'
            }
          }
        })
      })
    )

    setClickSubsObserver(
      new MutationObserver((mutationsList: MutationRecord[]) => {
        mutationsList.forEach(() => {
          const btn = document.querySelector('.ytp-ad-skip-button')
          const btnOverlay = document.querySelector('.ytp-ad-overlay-close-button')
          if (btn) {
            //@ts-ignore
            btn.click()
          } else if (btnOverlay) {
            //@ts-ignore
            btnOverlay.click()
          }
        })
      })
    )

    setCommentDisableObserver(
      new MutationObserver((_: MutationRecord[]) => {
        if (!localStorage.getItem('watchingOnBoarding')) {
          const belowElement = document.querySelector('#below');
          const relatedElement = document.querySelector('#related');
          const elangExtension = document.querySelector('#elangExtension.elang_youtube_window_wrapper');
          const below = document.querySelector('#below');

          relatedElement && relatedElement.setAttribute('style', 'filter: brightness(67%) saturate(100%)');
          elangExtension && elangExtension.setAttribute('style', 'filter: brightness(67%) saturate(100%)');
          below && below.setAttribute('style', 'filter: brightness(67%) saturate(100%)');

          if (!document.querySelector('.onBoardingDisable')) {
            createDisabledElement(belowElement);
            createDisabledElement(relatedElement);
            commentDisableObserver?.disconnect();
          }
        }
      })
    )

  /*  setOriginSubsTextObserver(
      new MutationObserver(() => {
        setLoadSubtitlesWindow(false)
        setLoadSubtitles(false)
    }))*/

    return () => {
      window.removeEventListener('eLangChangeWindowSize', eventHandler)
      clearInterval(timerForVideoId)
    }
  }, [])

  useEffect(() => {
    dispatch(setYoutubeLangKeys(locale))
  }, []) // locale

  useEffect(() => {
    if (subsUrlObject && videoId) {
      youTube.getTranslatedSubs(subsUrlObject, localLanguage, 'local', locale)
    }
  }, [localLanguage, videoId])

  useEffect(() => {
    if (subsUrlObject && videoId) {
      youTube.getTranslatedSubs(subsUrlObject, learnLanguage, 'learn', locale)
    }
  }, [learnLanguage])

  useEffect(() => {
    const contentContainer = document.querySelector('#contentContainer')
    if ((isWidescreenModeYt || isFullscreenModeYt) && !isFocusOnYt) {
      if (contentContainer) {
        //@ts-ignore
        contentContainer.style = 'transition-duration: 0ms;'
      }
    } else if ((isFullscreenModeYt || isWidescreenModeYt) && isFocusOnYt) {
      if (contentContainer) {
        //@ts-ignore
        contentContainer.style = 'left: -50px; transition-duration: 0ms;'
      }
    }
  }, [isFocusOnYt])

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('eLangChangeWindowSize', {
        detail: {
          isWScreen: isFullscreenModeYt,
          isFScreen: isWidescreenModeYt,
        },
      })
    )
  }, [isFullscreenModeYt, isWidescreenModeYt])

  useEffect(() => {
    if (readyNavigationSubsContainerParent) {
      if (isFullscreenModeYt || isWidescreenModeYt) {
        const videoCont = document.querySelector('#movie_player')
        if (customSubsContainer) {
          //@ts-ignore
          customSubsContainer.style = `position: absolute; top: 0; right: 0; z-index: ${positionOnboarding === 4 ? -1 : 60} `
          videoCont && videoCont.insertBefore(customSubsContainer, videoCont.children[0])
        }
      } else {
        const originRecomendContainer = document.querySelector('#secondary-inner')
        if (customSubsContainer) {
          //@ts-ignore
          customSubsContainer.style = ''
          originRecomendContainer && originRecomendContainer.insertBefore(customSubsContainer, originRecomendContainer.children[0])

          setReadyNavigationSubsContainer(customSubsContainer)
        }
      }
    }
  }, [isFullscreenModeYt, isWidescreenModeYt, readyNavigationSubsContainerParent, readyNavigationSubsContainer, positionOnboarding])

  useEffect(() => {
    if (videoId) {
      if (!localStorage.getItem('watchingOnBoarding') && positionOnboarding !== 1 && !isWatchOnBoardingSearchSubtitleBtn) {
        dispatch(setPositionOnBoarding(1))
      }

      Subs.clearSubs()

      if (offExtension) {
        sendAmplitudeEvent('video_count', { language: `${subs.languageName}`, resource: 'Youtube' })
      }

      dispatch(setVideoWordsTranslate({}))
    } else {
      if (!localStorage.getItem('watchOnBoardingSearchBtn') && !window.location.href.includes('watch')) {
        setIsWatchOnBoardingSearchSubtitleBtn(true)
      } else {
        setIsWatchOnBoardingSearchSubtitleBtn(false)
      }
    }

    return () => {
      Subs.clearSubs()
      setSubsShowed(false)
      dispatch(setIsNoSubs(false))
    }
  }, [videoId])

  useEffect(() => {
    const miniPlayer = document.getElementsByTagName('ytd-miniplayer')[0]
    const subBtn = document.querySelector('.ytp-subtitles-button.ytp-button')
    if (miniPlayer && miniPlayer.getAttributeNames().length === 4 && subBtn) {
      //@ts-ignore
      subBtn.click()
      //@ts-ignore
      subBtn.click()
    }
  }, [miniPlayerAttrLength])

  useEffect(() => {
    if (isYoutube) {
      const obj = {
        localLang: localLanguage,
        learningLang: learnLanguage,
      }
      chrome.storage.sync.set({ elangLaguagesPair: obj })
    }
  }, [localLanguage, learnLanguage])

  useEffect(() => {
    const btnYoutubeSubs = document.querySelector('.ytp-subtitles-button.ytp-button')
    const captionContainer = document.querySelector('.html5-video-player')
    const originalCaptionsYtContainer = document.querySelector('.ytp-caption-window-container')
    const captionOriginalContainer = document.querySelector('#movie_player')
    const adsContainer = document.querySelector('.video-ads')
    const chipsWrapper: HTMLElement | null = document.querySelector('#chips-wrapper')
    const miniPlayerWrapper = document.getElementsByTagName('ytd-miniplayer')[0]
    const watchActiveMetadata = document.querySelector('.watch-active-metadata')
    const youTubeSubtitlesWindow = document.querySelector('[target-id="engagement-panel-searchable-transcript"]')

    if (videoId && offExtension) {
      window.dispatchEvent(new CustomEvent('focused', { detail: true }))
      captionContainer && originalSubsObserver && originalSubsObserver.observe(captionContainer, { childList: true, subtree: true })

      if (!localStorage.getItem('watchingOnBoarding')) {
        watchActiveMetadata &&
          commentDisableObserver &&
          commentDisableObserver.observe(watchActiveMetadata, { attributes: true, subtree: true })
      }

      focusObserver && captionOriginalContainer && focusObserver.observe(captionOriginalContainer, { attributes: true, childList: true })
      adsContainer && clickSubsObserver && clickSubsObserver.observe(adsContainer, { childList: true, subtree: true })
      miniPlayerWrapper && miniPlayerObserver && miniPlayerObserver.observe(miniPlayerWrapper, { attributes: true, childList: true })

      originSubsTextObserver && youTubeSubtitlesWindow && originSubsTextObserver.observe(youTubeSubtitlesWindow, { childList: true, subtree: true  })

      if (!subsShowed) {
        btnYoutubeSubs && subShowObserver && subShowObserver.observe(btnYoutubeSubs, configForMutation)
      }
      if (subsShowed) {
        subShowObserver?.disconnect()
      }
      if (originalCaptionsYtContainer) {
        //@ts-ignore
        originalCaptionsYtContainer.style.display = 'none'
      }
      if (captionOriginalContainer) {
        //@ts-ignore
        captionOriginalContainer.style.overflow = 'hidden'
      }

      if (localStorage.getItem('watchingOnBoarding')) {
        commentDisableObserver?.disconnect()
      }
    }
    if (!videoId || !offExtension) {
      originalSubsObserver?.disconnect()
      focusObserver?.disconnect()
      commentDisableObserver?.disconnect()
      recomendationDisableObserver?.disconnect()
      clickSubsObserver?.disconnect()
      originSubsTextObserver?.disconnect()
      window.dispatchEvent(new CustomEvent('focused', { detail: false }))
      if (originalCaptionsYtContainer) {
        //@ts-ignore
        originalCaptionsYtContainer.style.display = 'block'
      }
    }
    if (chipsWrapper) {
      chipsWrapper.style.zIndex = '0'
    }
  }, [videoId, subsShowed, offExtension, readyNavigationSubsContainerParent])

  useEffect(() => {
    const contentContainer = document.querySelector('#contentContainer')
    if ((isFullscreenModeYt || isWidescreenModeYt) && !isFocusOnYt && !videoId) {
      if (contentContainer) {
        //@ts-ignore
        contentContainer!.style = 'transition-duration: 0ms;'
      }
    } else if ((isFullscreenModeYt || isWidescreenModeYt) && isFocusOnYt && videoId) {
      if (contentContainer) {
        //@ts-ignore
        contentContainer!.style = 'left: -50px; transition-duration: 0ms;'
      }
    }
  }, [isFocusOnYt])

  useEffect(() => {
    const obj = {
      fontSizeForYt: subtitleFontSize,
      subtitleColorForYt: subtitleColor,
      expandForYt: subtitleExpand,
      subtitleBackgroundForYt: subtitleBackground,
      isDoubleSubtitleOnYt: isDoubleSubtitle,
    }

    chrome.storage.sync.set({ elangSettingsOnYt: obj })
  }, [subtitleFontSize, subtitleColor, subtitleExpand, subtitleBackground, isDoubleSubtitle])

  // если нет субтитров включить показ тултипа
  useEffect(() => {
    let timer: any = undefined
    if (isNoSubs) {
      timer = setTimeout(() => {
        setShowTooltipNoSubs(true)
      }, 2000)
    }

    return () => {
      clearTimeout(timer)
      setShowTooltipNoSubs(false)
    }
  }, [isNoSubs])

  // запускает показ тултипа
  useEffect(() => {
    if (showTooltipNoSubs) {
      const timerForTooltipNoSubs = setTimeout(timerHandlerForTooltipNoSubs, 4000)
      return () => {
        clearTimeout(timerForTooltipNoSubs)
      }
    }
  }, [showTooltipNoSubs])

  return (
    <div>
      {offExtension &&
        customNavigationContainer &&
        ReactDOM.createPortal(<Navigation handleClickForTooltipNoSubs={handleClickForTooltipNoSubs} />, customNavigationContainer)}
      {offExtension &&
        customSwitchContainer &&
        ReactDOM.createPortal(
          <SearchWithSubtitlesToggle
            onBoarding={isWatchOnBoardingSearchSubtitleBtn}
            setOnBoarding={setIsWatchOnBoardingSearchSubtitleBtn}
          />,
          customSwitchContainer
        )}
      {offExtension &&
        customSubsContainer &&
        !isNoSubs &&
        ReactDOM.createPortal(
          <VideoServiceSubWindow
            isFullscreenModeOnYt={isFullscreenModeYt}
            isWidescreenModeYt={isWidescreenModeYt}
            handleClickForShowSubsOnYt={handleClickForShowSubsOnYt}
          />,
          customSubsContainer
        )}
      {offExtension &&
        showTranslationParent &&
        ReactDOM.createPortal(<ShowTranslationToggle handleClickForTooltipNoSubs={handleClickForTooltipNoSubs} />, showTranslationParent)}
      {offExtension &&
        ytCustomCaption &&
        showSubs &&
        ReactDOM.createPortal(
          <Captions isFullscreenModeOnYt={isFullscreenModeYt} isWidescreenModeYt={isWidescreenModeYt} showSubs={showSubs} />,
          ytCustomCaption
        )}
      {offExtension && settingPanel && ReactDOM.createPortal(<SettingsWindow isFullscreenModeYt={isFullscreenModeYt} />, settingPanel)}
      {settingsButton &&
        ReactDOM.createPortal(
          <ExtensionToggle
            showTooltipNoSubs={showTooltipNoSubs}
            isFullscreenModeOnYt={isFullscreenModeYt}
            isWidescreenModeYt={isWidescreenModeYt}
          />,
          settingsButton
        )}
    </div>
  )
}

// eslint-disable-next-line
;(subsStore as any).on(updateSubs, (state: Subtitle, subs: Subtitle) => {
  return subs
})

export default YoutubeController
