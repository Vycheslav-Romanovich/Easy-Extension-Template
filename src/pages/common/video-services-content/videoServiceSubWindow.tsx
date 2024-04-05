import React, { useState, useEffect } from 'react'
import { useStore } from 'effector-react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../background/store/reducers'
import { setExtensionShown, setSettingsYouTubeShown, setSubsShowOnNetflix, setSubsShowOnCoursera } from '../store/settingsActions'
import { getService } from '../../../utils/url'
import { subsStore } from '../../content/store'

import VideoServiceVocabulary from './videoServiceVocabulary'
import CloseDark from '../../../assets/icons/youtube/CloseDark.svg'
import CloseWhite from '../../../assets/icons/youtube/CloseWhite.svg'
import YoutubePage from '../components/youtubePage'
import NavigationTabYoutube from '../../options/components/navigation/navigationTabYoutube'
import { useTranslation } from '../../../locales/localisation'
import YoutubeSubs from './videoServiceSubsPanel'
import firebase from 'firebase/auth'
import HiddenSubsButton from './hiddenSubsButton'
import ServiceProductsPanel from './videoServiceProductsPanel'
import PractiseModal from '../components/practise/practiseModal'
import { ActiveServiceTab } from '../../../constants/types'
import { setActiveServiceTab } from '../store/videoActions'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import { clearWordsToPractice } from '../store/vocabularyActions'

const VideoServiceSubWindow: React.FC<{
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  handleClickForShowSubsOnYt?: () => void
}> = ({ isFullscreenModeOnYt, isWidescreenModeYt, handleClickForShowSubsOnYt }) => {
  const dispatch = useDispatch()
  const subs = useStore(subsStore)
  const service = getService()
  const strings = useTranslation()
  const { isFullScreen } = useFullScreenContex()
  const { youtube } = strings.options.navigation

  // eslint-disable-next-line
  const extensionShown = useSelector<RootState, boolean>((state) => state.settings.extensionShown)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const subsShowOnNetflix = useSelector<RootState, boolean>((state) => state.settings.subsShowOnNetflix)
  const subsShowOnCoursera = useSelector<RootState, boolean>((state) => state.settings.subsShowOnCoursera)
  const subsShowOnYt = useSelector<RootState, boolean>((state) => state.settings.subsShowOnYt)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const isYtHasFocusOnVideo = useSelector<RootState, boolean>((state) => state.settings.isYtVideoHasFocus)
  const isNetflixVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isNetflixVideoHasFocus)
  const isCourseraVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isCourseraVideoHasFocus)
  const isFullScreenOnNetflix = useSelector<RootState, boolean>((state) => state.settings.isFullScreenOnNetflix)
  const settingsShown = useSelector<RootState, boolean>((state) => state.settings.settingsYouTubeShown)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const activeTab = useSelector<RootState, ActiveServiceTab>((state) => state.video.activeTab)

  const [subsShow, setSubsShow] = useState<boolean>(false)
  const [showPractiseModal, setShowPractiseModal] = useState<boolean>(false)
  const videoElement = document.querySelector('video')

  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const setActiveTab = (value: ActiveServiceTab) => {
    dispatch(clearWordsToPractice())
    dispatch(setActiveServiceTab(value))
  }

  const styles = {
    className: `${!isCoursera && 'text-3xl'} flex justify-center pl-0 pr-0`,
    line: 'bottom-0 right-auto h-sml',
  }

  useEffect(() => {
    isNetflix && setSubsShow(subsShowOnNetflix)
    isYouTube && setSubsShow(subsShowOnYt)
    isCoursera && setSubsShow(subsShowOnCoursera)
  }, [subsShowOnNetflix, subsShowOnYt, subsShowOnCoursera])

  useEffect(() => {
    chrome.storage.sync.get(['showPractise'], (result) => {
      if (result.showPractise) {
        setShowPractiseModal(result.showPractise)
      }
    })
  }, [])

  const handleClickSubsOnNetflix = () => {
    dispatch(setSubsShowOnNetflix(!subsShowOnNetflix))
    sendAnalyticsToSubButton(subsShowOnNetflix)
  }

  const handleClickSubsOnCoursera = () => {
    dispatch(setSubsShowOnCoursera(!subsShowOnCoursera))
    sendAnalyticsToSubButton(subsShowOnCoursera)
  }

  const sendAnalyticsToSubButton = (value: boolean) => {
    const event = {
      category: 'SubButton',
      action: 'ShowSubsList',
      label: `${!value}, ${subs.languageName}, ${getService()}`,
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const handleClick = () => {
    if (!extensionShown) {
      dispatch(setExtensionShown(!extensionShown))
    } else {
      isYouTube && handleClickForShowSubsOnYt && handleClickForShowSubsOnYt()
      isNetflix && handleClickSubsOnNetflix()
      isCoursera && handleClickSubsOnCoursera()
      if ((isNetflix || isYouTube || isCoursera) && settingsShown) {
        dispatch(setSettingsYouTubeShown(false))
      }
    }
  }

  const hiddenPractiseModal = () => {
    chrome.storage.sync.set({ showPractise: true })
    setShowPractiseModal(!showPractiseModal)
    const event = {
      category: 'Training',
      action: 'TrainingHide',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const goToPractise = () => {
    setSubsShow(true)
    dispatch(setActiveServiceTab('practise'))
    const event = {
      category: 'Training',
      action: 'TrainingAccept',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const goToSubtitles = () => {
    dispatch(setActiveServiceTab('subtitles'))
  }

  useEffect(() => {
    if (activeTab === 'products') {
      sendAmplitudeEvent('go_to_our_products', { location: 'player' })
    }
  }, [activeTab])

  return (
    <>
      {isYouTube && !isFullscreenModeOnYt && !isWidescreenModeYt && !subsShow ? (
        <>
          <HiddenSubsButton goToSubtitles={goToSubtitles} />
          {/* {!showPractiseModal && <PractiseModal onClick={hiddenPractiseModal} goToPractise={goToPractise} />} */}
        </>
      ) : (
        <div
          style={{
            display: subsShow ? 'block' : 'none',
            height:
              isYouTube && videoElement
                ? isFullscreenModeOnYt
                  ? isYtHasFocusOnVideo
                    ? 'calc(100vh - 70px)'
                    : '100vh'
                  : isWidescreenModeYt
                  ? isYtHasFocusOnVideo
                    ? videoElement?.offsetHeight - 55
                    : videoElement?.offsetHeight
                  : videoElement?.offsetHeight
                : isNetflix && videoElement
                ? isFullScreenOnNetflix
                  ? isNetflixVideoHasFocus
                    ? 'calc(100vh - 150px)'
                    : '100vh'
                  : isNetflixVideoHasFocus
                  ? 'calc(100vh - 130px)'
                  : '100vh'
                : isCoursera && videoElement
                ? isFullScreen
                  ? isCourseraVideoHasFocus
                    ? 'calc(100vh - 70px)'
                    : '100vh'
                  : isCourseraVideoHasFocus
                  ? videoElement?.offsetHeight - 55
                  : videoElement?.offsetHeight
                : undefined,

            marginBottom: isYouTube && !isFullscreenModeOnYt && !isWidescreenModeYt ? 20 : undefined,
          }}
          className={`font-inter
            ${ isNetflix ||
            isDarkModeInYoutube ||
            (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt)) ||
            (isCoursera && isFullScreen)
              ? isFullscreenModeOnYt || isWidescreenModeYt || isNetflix || isCoursera
                ? 'dark bg-gray-50 bg-opacity-75'
                : 'dark'
              : 'dark'}`
          }
        >
          <YoutubePage
            className={`border ${
              isYouTube && !isFullscreenModeOnYt && !isWidescreenModeYt ? 'border-solid border-gray-950 rounded-[8px]' : 'rounded'
            } ${isFullscreenModeOnYt || isWidescreenModeYt ? 'mb-0' : 'mb-6'} ${
              (positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4) &&
              'pointer-events-none select-none'
            }`}
          >
            <div className="flex flex-col relative" style={{ width: `${isNetflix ? '400px' : undefined}`, height: '100%' }}>
              <div
                className={`${
                  isNetflix || (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen ? 'dark' : 'light'
                } flex items-center ${isNetflix && 'dark:shadow-none'}
              ${
                positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4
                  ? 'shadow-none'
                  : 'shadow-btWhite'
              }
              ${isDarkModeInYoutube && 'shadow-btDark'} ${(isFullscreenModeOnYt || isWidescreenModeYt) && 'dark:shadow-none'} ${
                isFullScreen && 'dark:shadow-none'
                }`}
              >
                <NavigationTabYoutube
                  isFullscreenModeOnYt={isFullscreenModeOnYt}
                  isDarkModeInYoutube={isDarkModeInYoutube}
                  isWidescreenModeYt={isWidescreenModeYt}
                  className={`${styles.className} ml-8`}
                  line={styles.line}
                  title={youtube.subs}
                  name='Subtitles'
                  activeTab={activeTab === 'subtitles'}
                  setActiveTab={setActiveTab}
                />
                {user && (
                  <NavigationTabYoutube
                    isFullscreenModeOnYt={isFullscreenModeOnYt}
                    isDarkModeInYoutube={isDarkModeInYoutube}
                    isWidescreenModeYt={isWidescreenModeYt}
                    className={`${styles.className} ml-[36px]`}
                    line={styles.line}
                    activeTab={activeTab === 'vocabulary'}
                    title={youtube.vocabulary}
                    name='Vocabulary'
                    setActiveTab={setActiveTab}
                  />
                )}

                {user && (
                  <NavigationTabYoutube
                    isFullscreenModeOnYt={isFullscreenModeOnYt}
                    isDarkModeInYoutube={isDarkModeInYoutube}
                    isWidescreenModeYt={isWidescreenModeYt}
                    className={`${styles.className} ml-[36px]`}
                    line={styles.line}
                    title={youtube.products}
                    name='Products'
                    activeTab={activeTab === 'products'}
                    setActiveTab={setActiveTab}
                  />
                )}

                <div style={{ right: '2rem', top: '10px' }} className="absolute cursor-pointer" onClick={handleClick}>
                  {isDarkModeInYoutube || isFullscreenModeOnYt || isWidescreenModeYt || isNetflix || isFullScreen ? (
                    <CloseWhite />
                  ) : (
                    <CloseDark />
                  )}
                </div>
              </div>
              {activeTab === 'subtitles' && (
                <YoutubeSubs isFullscreenModeOnYt={isFullscreenModeOnYt} isWidescreenModeYt={isWidescreenModeYt} />
              )}
              {activeTab === 'vocabulary' && user && (
                <VideoServiceVocabulary isFullscreenModeOnYt={isFullscreenModeOnYt} isWidescreenModeYt={isWidescreenModeYt} />
              )}
              {activeTab === 'products' && user && (
                <ServiceProductsPanel isFullscreenModeOnYt={isFullscreenModeOnYt} isWidescreenModeYt={isWidescreenModeYt} />
              )}
            </div>
          </YoutubePage>
        </div>
      )}
    </>
  )
}

export default React.memo(VideoServiceSubWindow)
