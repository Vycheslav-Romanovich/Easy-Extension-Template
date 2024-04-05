import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from 'effector-react'
import { Tooltip } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'

import { subsStore } from '../store'
import Subs from '../subs'

import { useTranslation } from '../../../locales/localisation'
import useStyles from '../../common/styles/tooltipSyle'
import { getService } from '../../../utils/url'
import { formatSubsTime } from '../../../utils/getTimeSub'

import DualSubs from '../../../assets/icons/navigation/dualSubs.svg'
import DualSubsOff from '../../../assets/icons/navigation/dualSubsOff.svg'
import SnailIcon from '../../../assets/icons/navigation/snailIcon.svg'

import SubsS from '../../../assets/icons/navigation/subsS.svg'
import SnailR from '../../../assets/icons/navigation/snailR.svg'
import DownS from '../../../assets/icons/navigation/downS.svg'
import RepeatD from '../../../assets/icons/navigation/repeatD.svg'
import clsx from 'clsx'
import {
  setAlwaysShowTranslationOnCoursera,
  setAlwaysShowTranslationOnNetflix,
  setAlwaysShowTranslationOnYt,
  setExtensionShown,
  setPositionOnBoarding,
  setSettingsYouTubeShown,
  setSubsShowOnCoursera,
  setSubsShowOnNetflix,
  setSubsShowOnYt,
} from '../../common/store/settingsActions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { setFreeDoubleSubs } from '../../common/store/authActions'
import { getLanguageName } from '../../../constants/supportedLanguages'
import { useLanguageContext } from '../../../context/LanguageContext'
import ShowSubsList from '../../../assets/icons/youtube/HideSubsList.svg'
import HideSubsList from '../../../assets/icons/youtube/ShowSubsList.svg'
import { setCheckListDate } from '../../background/helpers/checkListSetUp'
import OnBoarding from '../../common/components/onBoarding/onBoarding'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

let timer: any | undefined

type PropType = {
  handleClickForTooltipNoSubs?: () => void
}

const Navigation: React.FC<PropType> = ({ handleClickForTooltipNoSubs }) => {
  const dispatch = useDispatch()
  const subs = useStore(subsStore)
  const strings = useTranslation()
  const tooltip = strings.tooltip.youtube
  const classes = useStyles()
  const service = getService()

  const videoElement = document.querySelector('video')
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const [colorSlow, setColorSlow] = useState(false)
  const [colorRepeat, setColorRepeat] = useState(false)
  const [currentSubs, setCurrentSubs] = useState<string>('')
  const [currentLang, setCurrentLang] = useState<string | null>('')
  const [currentService, setCurrentService] = useState<string>('')
  const [isVideoPausedHelper, setIsVideoPausedHelper] = useState<boolean>(false)
  const [isVideoPaused, setIsVideoPaused] = useState<boolean>(false)
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false)
  const [isWideScreen, setIsWideScreen] = useState<boolean>(false)
  const [focused, setFocused] = useState(false)
  const [defaultRewind, setDefaultRewind] = useState<number>(isNetflix ? 10000 : 5000)

  // for analytics
  const [countRepeatOnIcon, setCountRepeatOnIcon] = useState<number>(0)
  const [countRepeatOnKeyboard, setCountRepeatOnKeyboard] = useState<number>(0)
  const [countSlowRepeatOnIcon, setCountSlowRepeatOnIcon] = useState<number>(0)
  const [countSlowRepeatOnKeyboard, setCountSlowRepeatOnKeyboard] = useState<number>(0)

  //for OnBoarding
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const [watchOnBoarding, setWatchOnBoarding] = useState(localStorage.getItem('watchingOnBoarding'))
  const freeTranslated = useSelector<RootState, boolean>((state) => state.auth.freeTranslated)
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const isNetflixVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isNetflixVideoHasFocus)
  const isCourseraVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isCourseraVideoHasFocus)
  const alwaysShowTranslationOnYt = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const alwaysShowTranslationOnNetflix = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const alwaysShowTranslationOnCoursera = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const isFullScreenOnNetflix = useSelector<RootState, boolean>((state) => state.settings.isFullScreenOnNetflix)
  const subsShowOnYt = useSelector<RootState, boolean>((state) => state.settings.subsShowOnYt)
  const subsShowOnNetflix = useSelector<RootState, boolean>((state) => state.settings.subsShowOnNetflix)
  const subsShowOnCoursera = useSelector<RootState, boolean>((state) => state.settings.subsShowOnCoursera)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const { locale } = useLanguageContext()
  const { isFullScreen } = useFullScreenContex()

  const extensionShown = useSelector<RootState, boolean>((state) => state.settings.extensionShown)

  const settingsShown = useSelector<RootState, boolean>((state) => state.settings.settingsYouTubeShown)
  const position = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const randomAB = useSelector<RootState, number>((state) => state.settings.randomAB)

  window.addEventListener('focused', ((data: CustomEvent) => {
    setFocused(data.detail)
  }) as EventListener)

  const clearState = () => {
    const currentVideoElement = document.querySelector('video')

    if (currentVideoElement) {
      clearTimeout(timer)
      setColorRepeat(false)
      setColorSlow(false)
      if (colorSlow) {
        currentVideoElement.playbackRate = currentVideoElement.playbackRate / 0.75
      }
    }
  }
  const checkWideScreenValue = (): boolean => {
    const wideScreenChild = document.querySelector('#player-container.style-scope.ytd-watch-flexy');
    return !!document.getElementById('player-theater-container')?.contains(wideScreenChild);
  }

  const sendAnalyticsToTranslateToogle = (action?: 'on' | 'off', eventKeyboard?: 'mouse' | 'keyboard'): void => {
    action && eventKeyboard && sendAmplitudeEvent('double_subs', { action: action, way: eventKeyboard, place: 'side_panel' })
  }

  const handleDownloadSub = () => {
    if(subs.text !== null || subs.text !== undefined || subs !== undefined){
      let output=''
      if(isPaidSubscription){
      subs.text?.forEach((elem)=>{
        output+=`${elem.id}\n${formatSubsTime(elem.startTime)}-->${formatSubsTime(elem.endTime)}\n${elem.text}\n`
      })}
      else {
        subs.text?.slice(0,10).forEach((elem)=>{
          output+=`${elem.id}\n${formatSubsTime(elem.startTime)}-->${formatSubsTime(elem.endTime)}\n${elem.text}\n`
        })
        output+=`\n${strings.options.settings.acssePremium}`
      }
      const blob = new Blob([output],{type:"txt/plain"})
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = 'Subtitles.txt'
      link.click()
      link.remove()
      sendAmplitudeEvent('download_subtitles_A',{ language: subs.languageCode?.toString()||'en'})
    }
  }

  const handleClickDualSubs = (event: any, eventKeyboard?: boolean) => {
    event.preventDefault()
    if (isNetflix) {
      dispatch(setAlwaysShowTranslationOnNetflix(!alwaysShowTranslationOnNetflix))
      if (!alwaysShowTranslationOnNetflix) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle('on', 'keyboard') : sendAnalyticsToTranslateToogle('on', 'mouse')
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle('off', 'keyboard')
          : sendAnalyticsToTranslateToogle('off', 'mouse')
      }
    }
    if (isYoutube) {
      if (!alwaysShowTranslationOnYt) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle('on', 'keyboard') : sendAnalyticsToTranslateToogle('on', 'mouse')
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle('off', 'keyboard')
          : sendAnalyticsToTranslateToogle('off', 'mouse')
      }
      if (subs.text) {
        dispatch(setAlwaysShowTranslationOnYt(!alwaysShowTranslationOnYt))
      } else {
        if (handleClickForTooltipNoSubs) {
          handleClickForTooltipNoSubs()
        }
      }
    }

    if (isCoursera) {
      dispatch(setAlwaysShowTranslationOnCoursera(!alwaysShowTranslationOnCoursera))
      if (!alwaysShowTranslationOnCoursera) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle('on', 'keyboard') : sendAnalyticsToTranslateToogle('on', 'mouse')
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle('off', 'keyboard')
          : sendAnalyticsToTranslateToogle('off', 'mouse')
      }
    }
  }

  // find video pause on Youtube
  useEffect(() => {
    if (isYoutube) {
      const currentVideoElement = document.querySelector('video')
      const timerForPausedVideo = setInterval(() => {
        if (currentVideoElement) {
          setIsFullscreenMode(document.fullscreen)
          setIsVideoPaused(currentVideoElement.paused)
          setIsWideScreen(checkWideScreenValue())
        }
      }, 500)
      return () => {
        clearTimeout(timerForPausedVideo)
      }
    }
  }, [])

  //clearState on youtube
  useEffect(() => {
    if (isVideoPaused && isYoutube) {
      clearState()
    }
  }, [isVideoPaused])

  // event for clearState on Netflix
  useEffect(() => {
    if (videoElement && isNetflix) {
      const eventPauseHandler = (event: any) => {
        if (event.code == 'Space') {
          clearState()
        }
      }
      const eventClickPauseHandler = (event: any) => {
        if (event.target.tagName === 'DIV') {
          if (event.target.className.includes('watch-video')) {
            clearState()
          }
        }
        if (event.target.parentElement.tagName === 'DIV') {
          if (event.target.parentElement.className.includes('control-medium')) {
            clearState()
          }
        }
        if (event.target.parentElement.id === 'pause') {
          clearState()
        }
      }
      document.addEventListener('keydown', eventPauseHandler, true)
      document.addEventListener('click', eventClickPauseHandler)
      return () => {
        document.removeEventListener('keydown', eventPauseHandler, true)
        document.removeEventListener('click', eventClickPauseHandler)
      }
    }
  }, [videoElement, colorSlow])

  useEffect(() => {
    if ((subs && subs.text) || !watchOnBoarding) {
      // eslint-disable-next-line
      const eventHandlerKeyDown = (event: KeyboardEvent) => {
        if (!colorSlow && !colorRepeat) {
          if (event.code == 'ArrowRight') {
            if (localStorage.getItem('watchingOnBoarding')) {
              playNextSubtitle('key', event)
            }
          }
          if (event.code == 'ArrowLeft') {
            if (localStorage.getItem('watchingOnBoarding')) {
              playPreviousSubtitle('key', event)
            }
          }
        }
      }
      // eslint-disable-next-line
      const eventKeyUpHandler = (event: any) => {
        if (!(positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4) && event.code == 'KeyS') {
          handleClickSubs(true)
        }
        if (!(positionOnboarding === 1 || positionOnboarding === 3 || positionOnboarding === 4) && event.code == 'KeyD') {
          handleClickDualSubs(event, true)
        }
        if (!(positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 4) && event.code == 'KeyR') {
          slowRepeat('key')
        }
      }

      document.addEventListener('keydown', eventHandlerKeyDown, true)
      document.addEventListener('keyup', eventKeyUpHandler, true)

      return () => {
        document.removeEventListener('keydown', eventHandlerKeyDown, true)
        document.removeEventListener('keyup', eventKeyUpHandler, true)
      }
    }
  }, [
    colorSlow,
    colorRepeat,
    subs,
    countRepeatOnKeyboard,
    countSlowRepeatOnKeyboard,
    currentLang,
    currentService,
    positionOnboarding,
    watchOnBoarding,
    subsShowOnYt,
    subsShowOnNetflix,
    subsShowOnCoursera,
    alwaysShowTranslationOnNetflix,
    alwaysShowTranslationOnCoursera,
    alwaysShowTranslationOnYt,
  ])

  //find current sub
  useEffect(() => {
    const videoElement = document.querySelector('video')
    if (!videoElement) {
      return
    }

    const handleTimeUpdate = () => {
      if (!(subs && subs.text && videoElement)) return

      const currentVideoElement = document.querySelector('video')
      if (!currentVideoElement) return

      const allCurrentSubs = Subs.getCurrentSubs(currentVideoElement, subs.text)

      if (currentSubs !== allCurrentSubs[0]?.text) {
        setCurrentSubs(allCurrentSubs[0]?.text)
        setCurrentLang(subs.languageName)
        if (isYoutube) {
          setCurrentService('Youtube')
        }
        if (isNetflix) {
          setCurrentService('Netflix')
        }
        if (isCoursera) {
          setCurrentService('Coursera')
        }
      }
    }
    const timerForVideoId = setInterval(handleTimeUpdate, 50)

    return () => {
      if (videoElement) {
        clearInterval(timerForVideoId)
      }
    }
  }, [subs])

  //for send analytic
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('elangChangeCurrentSub'))

    const currentVideoElement = document.querySelector('video')
    if (countRepeatOnIcon || countSlowRepeatOnIcon) {
      const event = {
        category: 'Listening',
        action: 'RepeatSubByMouse',
        label: `${currentLang}, Repeat: ${countRepeatOnIcon}, SlowRepeat: ${countSlowRepeatOnIcon}, ${currentService}`,
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
    }
    if (countRepeatOnKeyboard || countSlowRepeatOnKeyboard) {
      const event = {
        category: 'Listening',
        action: 'RepeatSubByKeyboard',
        label: `${currentLang}, Repeat: ${countRepeatOnKeyboard}, SlowRepeat: ${countSlowRepeatOnKeyboard}, ${currentService}`,
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
    }
    if (currentSubs && currentVideoElement) {
      if (isYoutube) {
        if (alwaysShowTranslationOnYt) {
          const now = new Date()
          const currentDay = now.getDate()
          chrome.storage.sync.get(['dualSubsUsedData'], (result) => {
            if (!Object.keys(result).length) {
              chrome.storage.sync.set({ dualSubsUsedData: { numDualSubsUsed: 1, day: currentDay } })
            } else {
              if (result.dualSubsUsedData.numDualSubsUsed < 80) {
                freeTranslated &&
                  chrome.runtime.sendMessage({
                    component: 'sendAnalyticsCustomeEvent',
                    event: { dimension: 'dimension1', value: 'No limit' },
                  })
              }

              chrome.storage.sync.set({
                dualSubsUsedData: { numDualSubsUsed: result.dualSubsUsedData.numDualSubsUsed + 1, day: currentDay },
              })
              
              if (result.dualSubsUsedData.numDualSubsUsed >= 81) {
                dispatch(setFreeDoubleSubs(false))
              }
              if (result.dualSubsUsedData.numDualSubsUsed % 2 === 0) {
                dispatch(setFreeDoubleSubs(true))
              }
            }
          })

          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'double' })
        } else {
          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'single' })
        }
      }

      if (isNetflix) {
        if (alwaysShowTranslationOnNetflix) {
          const now = new Date()
          const currentDay = now.getDate()
          chrome.storage.sync.get(['dualSubsUsedData'], (result) => {
            if (!Object.keys(result).length) {
              chrome.storage.sync.set({ dualSubsUsedData: { numDualSubsUsed: 1, day: currentDay } })
            } else {
              if (result.dualSubsUsedData.numDualSubsUsed < 80) {
                freeTranslated &&
                chrome.runtime.sendMessage({
                  component: 'sendAnalyticsCustomeEvent',
                  event: { dimension: 'dimension1', value: 'No limit' },
                })
                
              }

              chrome.storage.sync.set({
                dualSubsUsedData: { numDualSubsUsed: result.dualSubsUsedData.numDualSubsUsed + 1, day: currentDay },
              })

              if (result.dualSubsUsedData.numDualSubsUsed >= 81) {
                dispatch(setFreeDoubleSubs(false))
              }
              if (result.dualSubsUsedData.numDualSubsUsed % 2 === 0) {
                dispatch(setFreeDoubleSubs(true))
              }
            }
          })
          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'double' })
        } else {
          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'single' })
        }
      }

      if (isCoursera) {
        if (alwaysShowTranslationOnCoursera) {
          const now = new Date()
          const currentDay = now.getDate()
          chrome.storage.sync.get(['dualSubsUsedData'], (result) => {
            if (!Object.keys(result).length) {
              chrome.storage.sync.set({ dualSubsUsedData: { numDualSubsUsed: 1, day: currentDay } })
            } else {
              if (result.dualSubsUsedData.numDualSubsUsed < 80) {
                freeTranslated &&
                  chrome.runtime.sendMessage({
                    component: 'sendAnalyticsCustomeEvent',
                    event: { dimension: 'dimension1', value: 'No limit' },
                  })
                
              }

              chrome.storage.sync.set({
                dualSubsUsedData: { numDualSubsUsed: result.dualSubsUsedData.numDualSubsUsed + 1, day: currentDay },
              })

              if (result.dualSubsUsedData.numDualSubsUsed >= 81) {
                dispatch(setFreeDoubleSubs(false))
              }
              if (result.dualSubsUsedData.numDualSubsUsed % 2 === 0) {
                dispatch(setFreeDoubleSubs(true))
              }
            }
          })
          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'double' })
        } else {
          sendAmplitudeEvent('subs_count', { language: `${getLanguageName(learnLanguageCode, 'en')}`, resource: currentService, type: 'single' })
        }
      }

      clearState()
    }

    setCountRepeatOnIcon(0)
    setCountSlowRepeatOnIcon(0)
    setCountRepeatOnKeyboard(0)
    setCountSlowRepeatOnKeyboard(0)
  }, [currentSubs])

  const slowRepeat = (event: string) => {
    const currentVideoElement = document.querySelector('video')

    if (!localStorage.getItem('watchingOnBoarding')) return
    if (timer) {
      clearTimeout(timer)
    }
    if (colorRepeat) return
    if (!currentVideoElement || !(subs && subs.text) || !Subs.getCurrentSubs(currentVideoElement, subs.text)[0]) return

    setColorSlow(true)

    if (currentVideoElement.paused) {
      setIsVideoPausedHelper(true)
    }

    if (event === 'click') {
      setCountSlowRepeatOnIcon(countSlowRepeatOnIcon + 1)

      sendAmplitudeEvent('slow_repeat', { way: 'mouse' })
    }
    if (event === 'key') {
      setCountSlowRepeatOnKeyboard(countSlowRepeatOnKeyboard + 1)

      sendAmplitudeEvent('slow_repeat', { way: 'keyboard' })
    }

    const isPaused = currentVideoElement.paused
    const currentSub = Subs.getCurrentSubs(currentVideoElement, subs.text)[0]
    const nextSub = Subs.getNextSub(currentVideoElement, subs.text)[0]
    let extendSubLengthEnd = 0
    let diffSpeed = 0

    if (!nextSub) {
      extendSubLengthEnd = currentSub.endTime - currentSub.startTime
    } else {
      //@ts-ignore
      extendSubLengthEnd = currentSub.endTime - currentSub.startTime + (nextSub.startTime - currentSub.endTime) - 1
    }

    if (!colorSlow) {
      currentVideoElement.playbackRate = currentVideoElement.playbackRate * 0.75
    }

    if (service === 'netflix') {
      //@ts-ignore
      window.dispatchEvent(new CustomEvent('elangSubsSeek', { detail: currentSub.startTime + 0.1 }))
    } else {
      currentVideoElement.currentTime = currentSub.startTime / 1000 + 0.1
    }

    if (isNetflix) {
      isPaused || isVideoPausedHelper ? window.dispatchEvent(new CustomEvent('elangPlayNetflixVideo')) : null
    } else {
      isPaused || isVideoPausedHelper ? currentVideoElement.play() : null
    }

    if (currentVideoElement.playbackRate === 1.5) {
      diffSpeed = 1.5
    } else if (currentVideoElement.playbackRate === 1.3125) {
      diffSpeed = 1.3125
    } else if (currentVideoElement.playbackRate === 1.125) {
      diffSpeed = 1.125
    } else if (currentVideoElement.playbackRate === 0.9375) {
      diffSpeed = 0.9375
    } else if (currentVideoElement.playbackRate === 0.5625) {
      diffSpeed = 0.5625
    } else if (currentVideoElement.playbackRate === 0.375) {
      diffSpeed = 0.375
    } else if (currentVideoElement.playbackRate === 0.1875) {
      diffSpeed = 0.1875
    } else {
      diffSpeed = 0.75
    }
    timer = setTimeout(() => {
      currentVideoElement.playbackRate = currentVideoElement.playbackRate / 0.75
      setColorSlow(false)

      if (isPaused || isVideoPausedHelper) {
        if (isNetflix) {
          //@ts-ignore
          window.dispatchEvent(new CustomEvent('elangSubsSeek', { detail: currentSub.startTime }))
        } else {
          currentVideoElement.currentTime = currentSub.startTime / 1000 + 0.1
        }
      }
      if (isNetflix) {
        isPaused || isVideoPausedHelper ? window.dispatchEvent(new CustomEvent('elangPauseNetflixVideo')) : null
      } else {
        isPaused || isVideoPausedHelper ? currentVideoElement.pause() : null
      }

      setIsVideoPausedHelper(false)
    }, extendSubLengthEnd / diffSpeed)
  }

  const playPreviousSubtitle = (event: string, domEvent: KeyboardEvent | React.MouseEvent) => {
    const currentVideoElement = document.querySelector('video')

    if (!localStorage.getItem('watchingOnBoarding')) return
    if (colorSlow || colorRepeat) return

    if (!currentVideoElement || !(subs && subs.text) || !Subs.getCurrentSubs(currentVideoElement, subs.text)[0]) return

    const previousSub = Subs.getPreviousSub(currentVideoElement, subs.text)[0]

    if (!previousSub) return
    //@ts-ignore
    if (!(currentVideoElement.currentTime * 1000 - previousSub.endTime > defaultRewind)) {
      domEvent.stopPropagation()
      domEvent.preventDefault()

      if (event === 'click') {
        const event = {
          category: 'Listening',
          action: 'PrevSubByMouse',
          label: `${currentLang}, ${currentService}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      }
      if (event === 'key') {
        const event = {
          category: 'Listening',
          action: 'PrevSubByKeyboard',
          label: `${currentLang}, ${currentService}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      }

      if (service === 'netflix') {
        //@ts-ignore
        window.dispatchEvent(new CustomEvent('elangSubsSeek', { detail: previousSub.startTime + 0.1 }))
      } else {
        setTimeout(() => {
          // @ts-ignore
          currentVideoElement.currentTime = previousSub.startTime / 1000 + 0.1
        }, 0)
      }
    }
  }

  const playNextSubtitle = (event: string, domEvent: KeyboardEvent | React.MouseEvent) => {
    const currentVideoElement = document.querySelector('video')

    if (!localStorage.getItem('watchingOnBoarding')) return
    if (colorSlow || colorRepeat) return
    if (!currentVideoElement || !(subs && subs.text) || !Subs.getCurrentSubs(currentVideoElement, subs.text)[0]) return

    const nextSub = Subs.getNextSub(currentVideoElement, subs.text)[0]

    if (!nextSub) return
    //@ts-ignore
    if (!(nextSub.startTime - currentVideoElement.currentTime * 1000 > defaultRewind)) {
      domEvent.stopPropagation()
      domEvent.preventDefault()

      if (event === 'click') {
        const event = {
          category: 'Listening',
          action: 'NextSubByMouse',
          label: `${currentLang}, ${currentService}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      }
      if (event === 'key') {
        const event = {
          category: 'Listening',
          action: 'NextSubByKeyboard',
          label: `${currentLang}, ${currentService}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      }

      if (service === 'netflix') {
        //@ts-ignore
        window.dispatchEvent(new CustomEvent('elangSubsSeek', { detail: nextSub.startTime + 0.1 }))
      } else {
        setTimeout(() => {
          // @ts-ignore
          currentVideoElement.currentTime = nextSub.startTime / 1000 + 0.1
        }, 0)
      }
    }
  }

  const handleClickForShowSubsOnYt = useCallback((fromKeyboard?: boolean) => {
    dispatch(setSubsShowOnYt(!subsShowOnYt))

    !subsShowOnYt && sendAmplitudeEvent('subs_list', { way: fromKeyboard ? 'keyboard' : 'mouse' })
  }, [subs.text, subsShowOnYt])

  const handleClickSubs = (fromKeyboard?: boolean) => {
    if (position === 3) {
      dispatch(setPositionOnBoarding(4))
    }
    if (!extensionShown) {
      dispatch(setExtensionShown(!extensionShown))
    } else {
      isYoutube && handleClickForShowSubsOnYt(fromKeyboard)
      isNetflix && handleClickSubsOnNetflix(fromKeyboard)
      isCoursera && handleClickSubsOnCoursera(fromKeyboard)
      if ((isNetflix || isYoutube || isCoursera) && settingsShown) {
        dispatch(setSettingsYouTubeShown(false))
      }
    }
  }

  const handleClickSubsOnNetflix = (fromKeyboard?: boolean) => {
    dispatch(setSubsShowOnNetflix(!subsShowOnNetflix))
    !subsShowOnNetflix && sendAnalyticsToSubButton(fromKeyboard)
  }

  const handleClickSubsOnCoursera = (fromKeyboard?: boolean) => {
    dispatch(setSubsShowOnCoursera(!subsShowOnCoursera))
    !subsShowOnCoursera && sendAnalyticsToSubButton(fromKeyboard)
  }

  const sendAnalyticsToSubButton = (fromKeyboard?: boolean) => {
    sendAmplitudeEvent('subs_list', { way: fromKeyboard ? 'keyboard' : 'mouse' })
  }

  const navigationClassName = clsx(
    `elang_navigation absolute rounded-l-[8px] w-[32px] h-[100px] flex-col items-center justify-around duration-75 transition-all ease-in
    ${(isNetflix || isCoursera) && positionOnboarding === 4 ? 'z-[10]' : (isNetflix || isCoursera) && 'z-[2000]'} 
    ${isNetflix && isNetflixVideoHasFocus || (positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3) ? 'flex' : isNetflix && 'hidden'} 
    ${isNetflix && isFullScreenOnNetflix ? 'bottom-[150px]' : isNetflix && 'bottom-[130px]'} 
    ${isNetflix && subsShowOnNetflix ? 'right-[402px]' : isNetflix && 'right-[1px]'}
    ${isNetflix && 'bg-gray-25'}
    ${isYoutube && focused ? 'flex' : isYoutube && 'hidden'} 
    ${isYoutube && (isFullscreenMode || isWideScreen) && subsShowOnYt ? 'right-[402px]' : isYoutube && 'right-[1px]'} 
    ${
      isYoutube && (isFullscreenMode || isWideScreen) && positionOnboarding === 4
        ? 'z-[20]'
        : isYoutube && (isFullscreenMode || isWideScreen) && 'z-[10000]'
    }
    ${isYoutube && !(isFullscreenMode || isWideScreen) && positionOnboarding === 4 ? 'z-[20]' : isYoutube && 'z-[2300]'}
    ${isYoutube && isFullscreenMode ? 'bottom-[70px]' : isYoutube && 'bottom-[65px]'} 
    ${isYoutube && !watchOnBoarding && (positionOnboarding === 1 || positionOnboarding === 2) ? 'bg-gray-50' : isYoutube && 'bg-gray-25'} 
    ${isCoursera && positionOnboarding === 4 ? 'z-[10]' : isCoursera && 'z-[2000]'} 
    ${isCoursera && 'bg-gray-25'}
    ${isCoursera && isCourseraVideoHasFocus ? 'flex' : isCoursera && 'hidden'} 
    ${isCoursera && isFullScreen ? 'bottom-[70px]' : isCoursera && 'bottom-[55px]'} 
    ${isCoursera && isFullScreen && subsShowOnCoursera ? 'right-[402px]' : isCoursera && 'right-[1px]'}
    ${
      (positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4) &&
      'bg-black bg-opacity-100'
    }`
  )

  const buttonClassName = `w-full p-1 px-sm h-32px px-full flex justify-center items-center text-gray-200 fill-current ${
    !(colorSlow || colorRepeat) && 'hover:text-blue-400 cursor-pointer'
  } ${isNetflix && 'py-sm px-sm'}`

  return (
    <div id="elangExtension" onDoubleClick={(e) => e.stopPropagation()}>
      <div className={navigationClassName}>
        {!watchOnBoarding && (positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3) && (
          <div
            className="fixed z-[2026] bg-gray-290 inset-0"
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
        )}
        {!watchOnBoarding && (positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3) && <OnBoarding />}
        <Tooltip
          title={
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}>
              {tooltip.subsList}
              <SubsS style={{ marginLeft: '10px' }} />
            </div>
          }
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="left"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <div
            className={`${
              positionOnboarding === 1 && !watchOnBoarding && 'relative z-[999999] bg-white rounded-tl-lg'
            } cursor-pointer ${buttonClassName} ${colorSlow ? 'text-blue-400' : 'text-gray-200'} ${!isCoursera && 'w-28px'}`}
            onClick={(e) => {
              e.stopPropagation()
              handleClickSubs()
            }}
          >
            {isYoutube ? (
              subsShowOnYt ? (
                <ShowSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              ) : (
                <HideSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              )
            ) : isNetflix ? (
              subsShowOnNetflix ? (
                <ShowSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              ) : (
                <HideSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              )
            ) : isCoursera ? (
              subsShowOnCoursera ? (
                <ShowSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              ) : (
                <HideSubsList className={`${positionOnboarding === 1 && 'text-[#4F6EFD]'}`} />
              )
            ) : null}
          </div>
        </Tooltip>
        <Tooltip
          title={
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}>
              {tooltip.doubleSubtitles}
              <RepeatD style={{ marginLeft: '10px' }} />
            </div>
          }
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="left"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <div
            className={`${
              positionOnboarding === 2 && !watchOnBoarding && 'relative z-[9999999] bg-white'
            } cursor-pointer ${buttonClassName} ${colorSlow ? 'text-blue-400' : 'text-gray-200'} ${!isCoursera && 'w-28px'}`}
            onClick={(e) => {
              e.stopPropagation()
              handleClickDualSubs(e)
            }}
          >
            {(isYoutube && alwaysShowTranslationOnYt) ||
            (isNetflix && alwaysShowTranslationOnNetflix) ||
            (isCoursera && alwaysShowTranslationOnCoursera) ? (
              <DualSubs className={`${positionOnboarding === 2 && 'text-[#4F6EFD]'}`} />
            ) : (
              <DualSubsOff className={`${positionOnboarding === 2 && 'text-[#4F6EFD]'}`} />
            )}
          </div>
        </Tooltip>
        <Tooltip
          title={
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}>
              {tooltip.repeatSubtitlesSlow}
              <SnailR style={{ marginLeft: '10px' }} />
            </div>
          }
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="left"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <div
            className={`${
              positionOnboarding === 3 && !watchOnBoarding && 'relative z-[9999999] bg-white rounded-bl-lg'
            } cursor-pointer ${buttonClassName} ${colorSlow ? 'text-blue-400' : 'text-gray-200'} ${!isCoursera && 'w-28px'}`}
            onClick={(e) => {
              e.stopPropagation()
              slowRepeat('click')
            }}
          >
            <SnailIcon className={`${positionOnboarding === 3 && ' text-[#4F6EFD]'}`} />
          </div>
        </Tooltip>

        {randomAB === 0 ?
        <Tooltip
          title={
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px' }}>
              {tooltip.downloadSub}
            </div>
          }
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="left"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <div
            className={`${
              positionOnboarding === 5 && !watchOnBoarding && 'relative z-[9999999] bg-white rounded-bl-lg'
            } cursor-pointer ${buttonClassName} ${colorSlow ? 'text-blue-400' : 'text-gray-200'} ${!isCoursera && 'w-28px'}
            ${ subs.text?.length === 0 && 'pointer-events-none'}`}
            onClick={(e) => {
              e.stopPropagation()
              handleDownloadSub()
            }}
          >
            <DownS className={`${positionOnboarding === 5 && ' text-[#4F6EFD]'}`} />
          </div>
        </Tooltip>: null}
      </div>
    </div>
  )
}

export default React.memo(Navigation)
