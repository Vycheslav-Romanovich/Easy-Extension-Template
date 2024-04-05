import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useStore } from 'effector-react'

import { RootState } from '../../../../background/store/reducers'
import { autoPauseStore, subsStore, translatedSubsStore } from '../../../store'
import { toggleAutoPause } from '../../../events'
import { getVideoId, getService } from '../../../../../utils/url'
import Subs from '../../../subs'

import { setTranlateSubsLangName } from '../../../../common/store/videoActions'
import { useTranslation } from '../../../../../locales/localisation'

import CaptionLine from './captionLine'
import clsx from 'clsx'
import { setSubsShowOnCoursera } from '../../../../common/store/settingsActions'
import { useFullScreenContex } from '../../../../../context/FullScreenContext'

const config = {
  attributes: true,
  childList: true,
}

const Captions: React.FC<{
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  showSubs?: boolean,
}> = ({ isFullscreenModeOnYt, isWidescreenModeYt, showSubs }) => {
  const subs = useStore(subsStore)
  const translatedSubs = useStore(translatedSubsStore)
  const strings = useTranslation()

  const extensionShown = useSelector<RootState, boolean>((state) => state.settings.extensionShown)
  const alwaysShowTranslationOnYt = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const alwaysShowTranslationOnNetflix = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const alwaysShowTranslationOnCoursera = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const isFullScreenOnNetflix = useSelector<RootState, boolean>((state) => state.settings.isFullScreenOnNetflix)
  const backgroundSubOnYt = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnYt)
  const backgroundSubOnNetflix = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnNetflix)
  const backgroundSubOnCoursera = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnCoursera)
  const subsShowOnYt = useSelector<RootState, boolean>((state) => state.settings.subsShowOnYt)
  const subsShowOnNetflix = useSelector<RootState, boolean>((state) => state.settings.subsShowOnNetflix)
  const subsShowOnCoursera = useSelector<RootState, boolean>((state) => state.settings.subsShowOnCoursera)
  const position = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  const [focused, setFocused] = useState(false)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(document.querySelector('video'))
  const [currentSubs, setCurrentSubs] = useState<string[]>([])
  const [currentSubsTranslated, setCurrentSubsTranslated] = useState<string[]>([])

  const errorLoadTranslateCaption = strings.youtubeVocSubs.subtitles.errorLoad

  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'
  const isCoursera = getService() === 'coursera'

  const dispatch = useDispatch()

  const { isFullScreen } = useFullScreenContex()

  useEffect(() => {
    isFullScreen ? dispatch(setSubsShowOnCoursera(true)) : dispatch(setSubsShowOnCoursera(false))
  }, [isFullScreen])

  //eslint-disable-next-line
  const mutationCallback = function (mutationsList: any) {
    for (const mutation of mutationsList) {
      if (mutation.addedNodes[0]) {
        setVideoElement(mutation.addedNodes[0].children[0])
      }
    }
  }

  const observer = new MutationObserver(mutationCallback)

  const handleTimeUpdate = () => {
    if (!(subs && subs.text && videoElement)) {
      setCurrentSubs([''])
      return
    }

    const allCurrentSubs = Subs.getCurrentSubs(videoElement, subs.text)
    setCurrentSubs([allCurrentSubs[0]?.text])

    if (!(translatedSubs && translatedSubs.text && videoElement)) {
      setCurrentSubsTranslated([''])
      return
    }

    const allCurrentTranslatedSubs = Subs.getCurrentSubs(videoElement, translatedSubs.text)
    if (isYoutube) {
      setCurrentSubsTranslated([allCurrentTranslatedSubs[0]?.text === undefined ? errorLoadTranslateCaption : allCurrentTranslatedSubs[0]?.text])
    }
    else {
      setCurrentSubsTranslated([allCurrentTranslatedSubs[0]?.text])
    }
  }

  useEffect(() => {
    const videoContainer = document.querySelector('[data-uia="video-canvas"]')
    if (videoContainer) {
      observer.observe(videoContainer.children[0], config)
    }

    window.addEventListener('focused', ((data: CustomEvent) => {
      setFocused(data.detail)
    }) as EventListener)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isYoutube && showSubs) {
      setFocused(true)
    }
  }, [showSubs])

  useEffect(() => {
    if (!videoElement) {
      return
    }

    if (!(subs.synchronized && translatedSubs.synchronized) && subs.text && translatedSubs.text) {
      const [synchronisedSubs, synchronisedTranslatedSubs] = Subs.syncSubs(subs.text, translatedSubs.text)
      subs.text = synchronisedSubs
      subs.synchronized = true
      translatedSubs.text = synchronisedTranslatedSubs
      translatedSubs.synchronized = true
    }

    translatedSubs.languageName && dispatch(setTranlateSubsLangName(translatedSubs.languageName))

    videoElement.removeEventListener('timeupdate', handleTimeUpdate)
    videoElement.addEventListener('timeupdate', handleTimeUpdate)
    handleTimeUpdate()
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [subs, translatedSubs, videoElement])

  const wrapperClassName = clsx(`elang_captions absolute font-inter duration-75 transition-all ease-in`, {
    'invisible': !currentSubs[0] && !currentSubsTranslated[0]
  })

  if (!extensionShown || !subs.text || subs.text.length === 0 || (!isCoursera && getVideoId() !== subs.videoId)) {
    return <div className="elang_captions hidden"></div>
  }

    const contentClassName = clsx(
      `relative rounded-lg ${(isYoutube && backgroundSubOnYt) || (isNetflix && backgroundSubOnNetflix) || (isCoursera && backgroundSubOnCoursera) ? 'bg-gray-50 bg-opacity-75' : ''} `
    )

  return (
    <div
      className={wrapperClassName}
      style={{
        left: '50%',
        transform: isYoutube
          ? (isFullscreenModeOnYt || isWidescreenModeYt) && subsShowOnYt
              ? 'translate(calc(-50% - 201px), 0)'
              : 'translate(-50%, 0)'
            : isNetflix
              ? subsShowOnNetflix
                ? 'translate(calc(-50% - 201px), 0)'
                : 'translate(-50%, 0)'
            : isCoursera
            ? subsShowOnCoursera && isFullScreen
                ? 'translate(calc(-50% - 201px), 0)'
                : 'translate(-50%, 0)'
            : '',
        maxWidth: isYoutube
          ? (isFullscreenModeOnYt || isWidescreenModeYt) && subsShowOnYt
              ? 'calc(72% - 201px)'
              : (isFullscreenModeOnYt || isWidescreenModeYt) ? '72%' : '90%'
            : isNetflix
            ? subsShowOnNetflix
              ? 'calc(72% - 201px)'
              : '72%'
            : isCoursera
            ? subsShowOnCoursera && isFullScreen
              ? 'calc(72% - 201px)'
              : isFullScreen ? '72%' : '90%'
            : '0',
        width: 'max-content',
        zIndex: position === 4 ? -1 : position === 3 ? 10 : 59,
        bottom: isNetflix ? (isFullScreenOnNetflix ? '150px' : '130px')
          : isYoutube ? (isFullscreenModeOnYt ? '70px' : isWidescreenModeYt ? '60px' : '55px')
          : isCoursera ? (isFullScreen ? '70px' : '55px') : undefined,
      }}
    >
      <div
        style={{
          zIndex: position === 4 ? -1 : position === 3 ? 10 : 59,
          boxSizing: 'border-box',
        }}
        className="relative"
        id="eLangSubsWrapper"
        onClick={(e) => {
          e.stopPropagation()
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div
          className={contentClassName}
          id="eLangBackgroundSubs"
          style={{
            borderRadius: '8px',
            position: 'relative',
            boxSizing: 'border-box',
            padding: '12px 20px',
            userSelect: 'none',
            margin: '0 auto',
            maxWidth: isCoursera ? isFullScreen ? '100%' : '90%' : '',
          }}
        >
          <CaptionLine type="main" text={currentSubs} select id={'eLangSubs'} />
          {((isNetflix && alwaysShowTranslationOnNetflix) || (isYoutube && alwaysShowTranslationOnYt) || (isCoursera && alwaysShowTranslationOnCoursera)) && (
            <CaptionLine type="translation" text={currentSubsTranslated} id={'eLangTranslatedSubs'} />
          )}
        </div>
      </div>
    </div>
  )
}
// eslint-disable-next-line
;(autoPauseStore as any).on(toggleAutoPause, (state: any, enable: boolean) => enable)

export default React.memo(Captions)
