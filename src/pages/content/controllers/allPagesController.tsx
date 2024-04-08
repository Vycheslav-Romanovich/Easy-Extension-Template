import ReactDOM from 'react-dom'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForceUpdate } from 'react-custom-hook-use-force-update'

import { AllVideoWords, PopupData, VideoWord, WayToOpenTextTranslation } from '../../../constants/types'
import { ShowTranslatePopUpWithDate } from '../../background/api/googleTranslate'
import { RootState } from '../../background/store/reducers'
import { getService, getVideoId } from '../../../utils/url'
import { setClosePopupState, setVideoWasPaused, setVideoWordsTranslate } from '../../common/store/videoActions'
import { setLearningLang, setLocalLang, setGamePopupShowed, setWayToOpenTextTranslation } from '../../common/store/settingsActions'

import ElangLogo from '../../../assets/icons/Extension.svg'
import { setFreeDoubleSubs, setFreeTranslated, deleteAccount } from '../../common/store/authActions'
import { environment } from '../../../utils/environment'
import MyWordsModal from '../../common/components/myWordsModal'
import firebase from 'firebase/auth'
import { dataFromGoogleApi, getSingleWord, translatePartOfText } from '../../background/helpers/request'
import { getTranslateCode } from '../../../constants/supportedLanguages'
import { checkTextComplited, checkTextSymbolsLength } from '../../background/helpers/checkListSetUp'
import { useStore } from 'effector-react'
import { subsStore, translatedSubsStore } from '../store'
import Subs from '../subs'
import { setWithButton } from '../../background/helpers/firebase'
import { useFullScreenContex } from '../../../context/FullScreenContext'

let popTranslateParent: HTMLElement | null
let courseraPopTranslateParent: HTMLElement | null
let wrapper: HTMLElement | null
let courseraConteinerForFullScreen: HTMLElement | null

// eslint-disable-next-line
let timer: any = undefined

const AllPagesController: React.FC = () => {
  const dispatch = useDispatch()
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'
  const subs = useStore(subsStore)
  const translatedSubs = useStore(translatedSubsStore)
  // eslint-disable-next-line
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const wayToOpenTextTranslation = useSelector<RootState, WayToOpenTextTranslation>((state) => state.settings.wayToOpenTextTranslation)
  const videoWasPaused = useSelector<RootState, boolean>((state) => state.video.videoWasPaused)
  const gamePopupShowLink = useSelector<RootState, string>((state) => state.settings.gamePopupShowLink)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const freeTranslated = useSelector<RootState, boolean>((state) => state.auth.freeTranslated)
  const freeDoubleSubs = useSelector<RootState, boolean>((state) => state.auth.freeDoubleSubs)
  const videoWords = useSelector<RootState, AllVideoWords>((state) => state.video.videoWords)
  const localLanguage = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguage = useSelector<RootState, string>((state) => state.settings.learningLang)

  const [link, setLink] = useState<string>('')
  const [domRect, setDomRect] = useState<DOMRect | undefined>(undefined)
  const [selectedWord, setSelectedWord] = useState<string | undefined>(undefined)
  const [selectedPhrase, setSelectedPhrase] = useState<string | undefined>(undefined)
  const [selectedWordinVideo, setSelectedWordinVideo] = useState<string | undefined>(undefined)
  const [selectionWidth, setSelectionWidth] = useState<number | undefined>(undefined)
  const [selectionHeight, setSelectionHeight] = useState<number | undefined>(undefined)
  const [selectionWordX, setSelectionWordX] = useState<number | undefined>(undefined)
  const [selectionWordY, setSelectionWordY] = useState<number | undefined>(undefined)
  const [selectionWordXlogo, setSelectionWordXlogo] = useState<number | undefined>(undefined)
  const [selectionWordYlogo, setSelectionWordYlogo] = useState<number | undefined>(undefined)

  const [cursorX, setCursorX] = useState<number | undefined>(undefined)
  const [cursorY, setCursorY] = useState<number | undefined>(undefined)
  const [showPopup, setShowPopup] = useState<boolean>(false)
  const [isNativeLang, setIsNativeLang] = useState<boolean>(false)

  const [isFullSelectItemData, setIsFullSelectItemData] = useState<boolean>(false)

  const [translateSingleWord, setTranslateSingleWord] = useState<string>('')
  const [popupObject, setPopupObject] = useState<PopupData>()
  const [translate, setTranslate] = useState<string>('')

  const [isGamePopupShow, setSsGamePopupShow] = useState(false)

  const { isFullScreen } = useFullScreenContex()

  const highlightPhrase = useRef(false)
  const UseForceUpdateFn = useForceUpdate()
  const [logoPopupShow, setLogoPopupShow] = useState(
    wayToOpenTextTranslation === 'withButton' && !isNetflix && !isYoutube && !isCoursera ? 'logo' : 'popup'
  )

  const updateBottomSize = useCallback(() => {
    if (domRect) {
      if (isNetflix || isYoutube || isCoursera) return false
      return -(domRect.bottom + domRect.height - window.innerHeight) > 252
    }
  }, [domRect])

  const setWordY = useCallback((domRect) => {
    if (updateBottomSize()) {
      return domRect.top + pageYOffset + domRect.height
    } else {
      return domRect.top + pageYOffset
    }
  }, [])

  const classnameChanger = (open: number, close: number) => {
    if (wayToOpenTextTranslation === 'withButton' && !isNetflix && !isYoutube && !isCoursera) {
      return close + 'px'
    } else {
      return open + 'px'
    }
  }

  const callLogo = () => {
    setLogoPopupShow('popup')
    const wrapper: HTMLElement = document.querySelector('.elangExtension') as HTMLElement
    if (wrapper !== null) {
      wrapper.style.top = selectionWordY + 'px'
      wrapper.style.left = selectionWordX + 'px'
    }
  }

  const updatePopupState = (rect: DOMRect, selectedWord: string, selectedPhrase: string | undefined) => {
    setDomRect(rect)

    setSelectedPhrase(selectedPhrase)
    setSelectedWord(selectedWord)
    setSelectionWordX(pageXOffset + rect.left + rect.width / 2)
    setSelectionWordY(setWordY(rect))
    setSelectionWordXlogo(rect.left + pageXOffset + rect.width)
    setSelectionWordYlogo(rect.top + pageYOffset - 32)
    setShowPopup(true)
    setSelectionWidth(rect.width)
    setSelectionHeight(rect.height)

    dispatch(setClosePopupState(true))
  }

  const defaultPopupState = () => {
    setDomRect(undefined)
    setSelectedPhrase(undefined)
    setSelectedWord(undefined)
    setSelectionWordX(undefined)
    setSelectionWordY(undefined)
    setSelectionWordXlogo(undefined)
    setSelectionWordYlogo(undefined)
    setShowPopup(false)
    setSelectionWidth(undefined)
    setSelectionHeight(undefined)

    dispatch(setClosePopupState(false))
    setTranslate('')
    setTranslateSingleWord('')
    setPopupObject(undefined)
    wayToOpenTextTranslation === 'withButton' && !isNetflix && !isYoutube && !isCoursera && setLogoPopupShow('logo')
  }

  const mouseUpEventHandler = (event: MouseEvent) => {
    if (getService() === 'youtube') {
      const videoElement = document.querySelector('video')
      videoElement && setLink(`https://youtu.be/${getVideoId()}?t=${Math.trunc(videoElement.currentTime)}`)
    } else {
      setLink(window.location.href)
    }

    if (isYoutube || isNetflix || isCoursera) {
      const selectedWord = window.getSelection()?.toString().trim()

      if (!selectedWord) {
        highlightPhrase.current = false
      }
    }

    //@ts-ignore
    if (window.getSelection()?.rangeCount > 0) {
      const rect: DOMRect | undefined = window.getSelection()?.getRangeAt(0).getBoundingClientRect()

      if (window.getSelection()?.focusOffset || window.getSelection()?.anchorOffset) {
        let selectedWord = window.getSelection()?.toString().trim()
        const selectedPhrase = window?.getSelection()?.anchorNode?.parentElement?.textContent?.toString()

        //@ts-ignore
        if (event.target?.id === 'eLangSubs' && !highlightPhrase.current && !selectedWord) {
          const positionX = event.x
          const positionY = event.y
          setCursorX(positionX)
          setCursorY(positionY)

          const range = document.caretRangeFromPoint(positionX, positionY)

          if (range && range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset && range.endOffset) {
            //@ts-ignore
            range.expand('word')
            selectedWord = range
              .toString()
              .trim()
              .replace(/[.,/#!$%^&*;:{}=\-_`~()0-9]/g, '')

            highlightPhrase.current = true

            window.getSelection()?.removeAllRanges()
            const rangeToSelect = document.caretRangeFromPoint(positionX, positionY)
            //@ts-ignore
            window.getSelection().addRange(rangeToSelect)
            //@ts-ignore
            rangeToSelect.expand('word')
          }
        }

        let sumOfValue = 0

        for (const key in rect) {
          //@ts-ignore
          if (typeof rect[key] === 'number') {
            //@ts-ignore
            sumOfValue += rect[key]
          }
        }
        if (sumOfValue === 0) {
          return
        } else if (selectedWord && rect) {
          updatePopupState(rect, selectedWord, selectedPhrase)
        }
        //@ts-ignore
        if (selectedWord && !event.target.closest('#elangExtensionPopup') && !isFullSelectItemData) {
          logoPopupShow === 'popup' && getFullSelectItemData(selectedWord)
        }
      }
    }
  }

  const mouseMoveEventHandler = (event: MouseEvent) => {
    const videoElement = document.querySelector('video')
    const videoElementNetflix = document.querySelector('.watch-video--back-container')
    const videoElementNetflixFlag = document.querySelector('.watch-video--flag-container')
    const videoElementNetflixBack = document.querySelector('.watch-video--back-container')

    if (
      //@ts-ignore
      event.target?.id === 'eLangSubs' ||
      //@ts-ignore
      event.target.closest('#elangExtensionPopup') ||
      //@ts-ignore
      event.target.closest('#eLangLoading')
    ) {
      //@ts-ignore
      if (!videoElement.paused && !videoWasPaused) {
        dispatch(setVideoWasPaused(true))

        isYoutube || isCoursera ? videoElement?.pause() : window.dispatchEvent(new CustomEvent('elangPauseNetflixVideo'))
      }
    } else if (videoWasPaused) {
      isYoutube || isCoursera ? videoElement?.play() : window.dispatchEvent(new CustomEvent('elangPlayNetflixVideo'))
      dispatch(setVideoWasPaused(false))
    }

    if (
      //@ts-ignore
      (event.target?.id === 'eLangSubsWrapper' ||
        //@ts-ignore
        event.target?.id === 'eLangBackgroundSubs' ||
        //@ts-ignore
        event.target?.id === 'eLangTranslatedSubs') &&
      !highlightPhrase.current
    ) {
      setShowPopup(false)
    }
    if (event.target === videoElement) {
      setShowPopup(false)
      highlightPhrase.current = false
    }
    if (event.target === videoElementNetflix || event.target === videoElementNetflixFlag || event.target === videoElementNetflixBack) {
      setShowPopup(false)
    }

    //@ts-ignore
    if (event.target?.id === 'eLangSubs' && !highlightPhrase.current) {
      const positionX = event.x
      const positionY = event.y
      setCursorX(positionX)
      setCursorY(positionY)

      const range = document.caretRangeFromPoint(positionX, positionY)

      if (range && range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset && range.endOffset) {
        //@ts-ignore
        range.expand('word')
        const word = range
          .toString()
          .trim()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()0-9]/g, '')

        setSelectedWordinVideo(word)
      }
    }
  }
  // Очищает стейт для попапа и выделенного слова, удаляет все выделения на стр и разрешает выделять фразу
  const mouseDownEventHandler = (event: MouseEvent) => {
    const popup = document.querySelector('.elang_popup_window_wrapper')
    const logo = document.querySelector('#elang_translation_logo')

    if (isYoutube || isNetflix || isCoursera) {
      setSelectedWordinVideo(undefined)
      clearTimeout(timer)

      const selectedWordArr = window.getSelection()?.toString().trim().split(' ')

      //@ts-ignore
      if ((event.target.id === 'eLangSubs' || event.target.id === 'eLangSubsWrapper') && selectedWordArr?.length === 1) {
        window.getSelection()?.removeAllRanges()

        highlightPhrase.current = true
      } else {
        window.getSelection()?.removeAllRanges()
        setShowPopup(false)
        highlightPhrase.current = false
      }
    }
    //@ts-ignore
    if (
      (popup && wrapper && wrapper.children[0]?.tagName !== 'svg') ||
      document.querySelector('#eLangLoading') ||
      //@ts-ignore
      event.target.parentElement !== logo
    ) {
      if (event.button === 0) {
        setShowPopup(false)
      }
      setSelectedWordinVideo(undefined)
    }
  }

  const subChangeEventHandler = () => {
    if (isNetflix || isYoutube || isCoursera) {
      setSelectedWordinVideo(undefined)
    }
  }

  const updateTranslateWordState = () => {
    if (isPaidSubscription || freeTranslated) {
      selectedWordinVideo && dataFromGoogleApi(selectedWordinVideo, learnLanguage, localLanguage).then((data) => {
        setPopupObject(data)
        setTranslateSingleWord(data.translation)

        const obj = Object.assign(videoWords, {
          [`${selectedWordinVideo}`]: { word: selectedWordinVideo, translate: data.translation, data: data },
        })
        dispatch(setVideoWordsTranslate(obj))
      },
        (error) => console.warn('fetch failure', error)
      )
    } else {
      defaultLimitedState()
    }
  }

  const getFullSelectItemData = (selectedWord: string) => {
    const videoElement = document.querySelector('video')
    if (isPaidSubscription || freeTranslated) {
      if (
        videoElement &&
        subs.text &&
        !checkTextComplited(selectedWord, learnLanguage) &&
        translatedSubs.text &&
        Subs.getCurrentSubs(videoElement, subs.text)[0] &&
        Subs.getCurrentSubs(videoElement, subs.text)[0].text === selectedWord
      ) {
        setTranslate(Subs.getCurrentSubs(videoElement, translatedSubs.text)[0].text)
      } else {
        if (checkTextSymbolsLength(selectedWord, learnLanguage) <= 75) {
          if (checkTextComplited(selectedWord, learnLanguage)) {
            setIsFullSelectItemData(true)
            dataFromGoogleApi(selectedWord, learnLanguage, localLanguage).then((data) => {
              setIsFullSelectItemData(false)
              setPopupObject(data)
            })
          }
          getSingleWord(selectedWord, getTranslateCode(learnLanguage), getTranslateCode(localLanguage)).then(
            (result) => {
              setTranslate(result)
            },
            (error) => console.warn('fetch failure', error)
          )
        }

        if (checkTextSymbolsLength(selectedWord, learnLanguage) > 75) {
          translatePartOfText(selectedWord, learnLanguage, localLanguage).then((data) => {
            setTranslate(data)
          })
        }
      }
    } else {
      defaultLimitedState()
    }
  }

  const defaultLimitedState = () => {
    setPopupObject({
      synoyms: [],
      allPartOfSpeech: [],
      example: [],
      partOfSpeech: '',
      transcription: 'invisilbe',
      translation: 'invisilbe',
      word: 'invisilbe',
    })

    setTranslate('invisilbe')
  }

  useEffect(() => {
    selectedWord && getFullSelectItemData(selectedWord)
  }, [logoPopupShow])

  useEffect(() => {
    if (user && wayToOpenTextTranslation === 'immediately') {
      setWithButton(user.uid)
      dispatch(setWayToOpenTextTranslation('withButton'))
    }
  }, [])

  useEffect(() => {
    if (window.location.origin === environment.website || window.location.origin === 'http://localhost:3000') {
      const timerForVideoId = setInterval(() => {
        if (
          window.location.pathname === '/welcome/second-step' ||
          window.location.pathname === '/welcome/second-step-abtest' ||
          window.location.pathname === '/ru/welcome/second-step-abtest' ||
          window.location.pathname === '/en/welcome/second-step-abtest' ||
          window.location.pathname === '/ru/welcome/second-step' ||
          window.location.pathname === '/en/welcome/second-step'
        ) {
          const localLang = localStorage.getItem('myLangForExtension')
          const learningLang = localStorage.getItem('iLearnForExtension')

          if (localLang && learningLang) {
            const lnag = {
              localLang,
              learningLang,
            }

            dispatch(setLocalLang(lnag.localLang))
            dispatch(setLearningLang(lnag.learningLang))
            chrome.storage.sync.set({ elangLaguagesPair: lnag })

            chrome.runtime.sendMessage({
              component: 'sendAnalyticsCustomeEvent',
              event: { dimension: 'dimension4', value: `${lnag.learningLang}/${lnag.localLang}` },
            })

            setTimeout(() => clearTimeout(timerForVideoId), 1500)
          }
        }
      }, 500)
      return () => {
        clearTimeout(timerForVideoId)
      }
    }
  }, [user])

  useEffect(() => {
    if (
      !user &&
      (window.location.origin === environment.website || window.location.origin === 'http://localhost:3000') &&
      (window.location.pathname === '/en/welcome/first-step' ||
        window.location.pathname === '/welcome/first-step' ||
        window.location.pathname === '/ru/welcome/first-step')
    ) {
      localStorage.removeItem('customToken')
    }
  }, [])

  // Синхронизация аккаунтов с веб-сайтом website -> extension
  useEffect(() => {
    if (
      !user &&
      (window.location.origin === environment.website || window.location.origin === 'http://localhost:3000') &&
      (window.location.pathname === '/en/welcome/first-step' ||
        window.location.pathname === '/welcome/first-step' ||
        window.location.pathname === '/ru/welcome/first-step' ||
        window.location.pathname === '/ru/signin' ||
        window.location.pathname === '/signin' ||
        window.location.pathname === '/en/signin' ||
        window.location.pathname === '/ru/signup' ||
        window.location.pathname === '/signup' ||
        window.location.pathname === '/en/signup' ||
        window.location.pathname === '/ru/account/settings' ||
        window.location.pathname === '/en/account/settings' ||
        window.location.pathname === '/account/settings' ||
        window.location.pathname === '/en/welcome/second-step' ||
        window.location.pathname === '/welcome/second-step' ||
        window.location.pathname === '/ru/welcome/second-step' ||
        window.location.pathname === '/en/welcome/third-step' ||
        window.location.pathname === '/welcome/third-step' ||
        window.location.pathname === '/ru/welcome/third-step' ||
        window.location.pathname === '/en/welcome/second-step-abtest' ||
        window.location.pathname === '/welcome/second-step-abtest' ||
        window.location.pathname === '/ru/welcome/second-step-abtest')
    ) {
      const timer = setInterval(() => {
        const token = localStorage.getItem('customToken')
        if (token) {
          chrome.runtime.sendMessage({ component: 'updateUserInfo', token: token })
          localStorage.removeItem('customToken')
          setTimeout(() => clearTimeout(timer), 1500)
        }
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [user])

  useEffect(() => {
    //remove account
    if (
      user &&
      (window.location.href.includes(environment.website) || window.location.href.includes('http://localhost:3000')) &&
      localStorage.getItem('removeAccount') === 'true'
    ) {
      dispatch(deleteAccount())
      localStorage.removeItem('removeAccount')
    }
  }, [user])

  useEffect(() => {
    document.addEventListener('mouseup', mouseUpEventHandler)
    document.addEventListener('mousedown', mouseDownEventHandler)

    return () => {
      document.removeEventListener('mouseup', mouseUpEventHandler)
      document.removeEventListener('mousedown', mouseDownEventHandler)
    }
  }, [isPaidSubscription, logoPopupShow, subs.text, translatedSubs.text, isFullSelectItemData])

  useEffect(() => {
    window.addEventListener('elangChangeCurrentSub', subChangeEventHandler)
    return () => window.addEventListener('elangChangeCurrentSub', subChangeEventHandler)
  }, [])

  useEffect(() => {
    if (isYoutube || isCoursera || isNetflix) {
      document.addEventListener('mousemove', mouseMoveEventHandler)
      return () => {
        document.removeEventListener('mousemove', mouseMoveEventHandler)
      }
    }
  }, [videoWasPaused])

  useEffect(() => {
    if (isYoutube || isNetflix || isCoursera) {
      const now = new Date()
      const currentDay = now.getDate()

      chrome.storage.sync.get(['dualSubsUsedData'], (result) => {
        if (Object.keys(result).length) {
          // if (result.dualSubsUsedData.numDualSubsUsed === 80) {
          //   dispatch(setFreeDoubleSubs(false))
          // }
          if (result.dualSubsUsedData.day !== currentDay) {
            chrome.storage.sync.set({ dualSubsUsedData: { numDualSubsUsed: 1, day: currentDay } })
            dispatch(setFreeDoubleSubs(true))
            chrome.storage.sync.set({ isFirstTimeAtDay: true })
          }
        }
      })
    }
  }, [freeDoubleSubs, isPaidSubscription])

  useEffect(() => {
    const now = new Date()
    const currentDay = now.getDate()
    const currentTime = now.getHours()

    chrome.storage.sync.get(['translatedData'], (result) => {
      if (Object.keys(result).length) {
        if (result.translatedData.count === 10) {
          dispatch(setFreeTranslated(false))
        }
        if (result.translatedData.day !== currentDay) {
          chrome.storage.sync.set({ translatedData: { count: 1, day: currentDay } })
          dispatch(setFreeTranslated(true))
          chrome.storage.sync.set({ isFirstTimeAtMonth: true })
        }
        chrome.storage.sync.get(['showNotification'], (data) => {    
          if(data.showNotification.day !== currentDay) {
            chrome.storage.sync.set({ showNotification: { count: 1, hour: currentTime, day: currentDay } })
          }
        })
      }
    })
  }, [freeTranslated, isPaidSubscription])

  useEffect(() => {
    if (selectedWordinVideo && cursorX && cursorY) {
      window.getSelection()?.removeAllRanges()
      const range = document.caretRangeFromPoint(cursorX, cursorY)
      //@ts-ignore
      window.getSelection().addRange(range)
      //@ts-ignore
      range.expand('word')


      timer = window.setTimeout(() => {
        if (selectedWordinVideo) {
          if (Object.keys(videoWords).length) {
            const translateWord = Object.values(videoWords).find((item) => item.word === selectedWordinVideo) as VideoWord
            if (!translateWord?.translate) {
              updateTranslateWordState()
            } else {
              setPopupObject(translateWord.data)
              setTranslateSingleWord(translateWord.translate)
            }
          } else {
            updateTranslateWordState()
          }
        }
        const rect: DOMRect | undefined = window.getSelection()?.getRangeAt(0).getBoundingClientRect()
        if (selectedWordinVideo && rect) {
          const selectedPhrase = window?.getSelection()?.anchorNode?.parentElement?.textContent?.toString()
          updatePopupState(rect, selectedWordinVideo, selectedPhrase)
        }
      }, 600)
      return () => {
        clearTimeout(timer)
        //@ts-ignore
        window.getSelection().removeAllRanges()
        setShowPopup(false)
        setSelectedWordinVideo(undefined)
      }
    }
  }, [selectedWordinVideo])

  useEffect(() => {
    if (showPopup) {
      //смотрит иконка или нет
      if (
        !document.querySelector('.elang_popup_window_wrapper') &&
        !(wayToOpenTextTranslation === 'immediately') &&
        !isNetflix &&
        !isYoutube &&
        !isCoursera
      ) {
        setLogoPopupShow('logo')
      }
      //создает новый родителський элемент ТОЛЬКО для нетфликс
      if (getService() === 'netflix') {
        if (!document.querySelector('.elangExtension')) {
          const anchor = document.createElement('div')
          document.querySelector('[data-uia="video-canvas"]')?.parentElement?.append(anchor)
          anchor.classList.add('elangExtension')
        }
      }
      popTranslateParent = document.querySelector('.elangExtension')
      courseraPopTranslateParent = document.querySelector('#persistent_fullscreen')

      if (popTranslateParent) {
        popTranslateParent.id = 'elangExtension'
      }

      if (courseraPopTranslateParent && courseraPopTranslateParent.childNodes.length) {
        courseraConteinerForFullScreen = document.createElement('div')
        courseraConteinerForFullScreen.id = 'elangExtension'
        courseraPopTranslateParent.append(courseraConteinerForFullScreen)
      }

      // создание враппера для попапа
      if (popTranslateParent && selectionWordY && selectionWordYlogo && selectionWordX && selectionWordXlogo) {
        wrapper = document.createElement('div')
        wrapper.classList.add('elang_popup_window_wrapper')
        wrapper.style.position = 'absolute'
        wrapper.style.zIndex = '9999'
        wrapper.style.top = classnameChanger(selectionWordY, selectionWordYlogo)
        wrapper.style.left = classnameChanger(selectionWordX, selectionWordXlogo)

        if (
          isCoursera &&
          courseraPopTranslateParent &&
          courseraPopTranslateParent.childNodes.length &&
          courseraConteinerForFullScreen
        ) {
          courseraConteinerForFullScreen.append(wrapper)
        } else {
          popTranslateParent.append(wrapper)
        }

        UseForceUpdateFn()
      }
    } else if (!showPopup && wrapper) {
      wrapper.remove()
      defaultPopupState()
      setSelectedWordinVideo(undefined)

      if (!highlightPhrase.current) {
        //@ts-ignore
        window.getSelection().removeAllRanges()
      }
    }
  }, [showPopup])

  useEffect(() => {
    const htmlTag: HTMLElement = document.querySelector('html') as HTMLElement

    if (htmlTag) {
      const pageLang = htmlTag.getAttribute('lang')
      !isYoutube && !isNetflix && !isCoursera && pageLang?.includes(localLanguage) ? setIsNativeLang(true) : setIsNativeLang(false)
    }
  }, [localLanguage])

  useEffect(() => {
    window.location.href === gamePopupShowLink
      ? setSsGamePopupShow(true)
      : setSsGamePopupShow(false)
  }, [gamePopupShowLink])

  return (
    <>
      {offExtension &&
        wrapper &&
        selectedWord &&
        !isNativeLang &&
        ReactDOM.createPortal(
          <>
            {logoPopupShow === 'logo' && !isNetflix && !isYoutube && !isCoursera ? (
              <ElangLogo id="elang_translation_logo" className="logoOpacity" onClick={callLogo} />
            ) : (
              <ShowTranslatePopUpWithDate
                selectionWidth={selectionWidth}
                selectionHeight={selectionHeight}
                selectedPhrase={selectedPhrase}
                word={selectedWord}
                uid={user ? user.uid : null}
                link={link}
                position={updateBottomSize()}
                domRectWidth={domRect?.width}
                isVideoWord={translateSingleWord}
                popupObject={popupObject}
                translate={translate}
              />
            )}
          </>,
          wrapper
        )}
      {<MyWordsModal
          isOpen={isGamePopupShow}
          onCancel={() => {
            dispatch(setGamePopupShowed(''))
          }}
        ></MyWordsModal>}
    </>
  )
}

export default AllPagesController
