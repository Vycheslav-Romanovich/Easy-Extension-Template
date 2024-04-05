import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStore } from 'effector-react'

import { subsStore } from '../../content/store'
import { IPaymentData, SubtitleLine } from '../../../constants/types'
import { RootState } from '../../background/store/reducers'
import { getService } from '../../../utils/url'

import Lock from '../../../assets/images/lock.svg'
import LockDark from '../../../assets/images/lockDark.svg'

import { useTranslation } from '../../../locales/localisation'
import Subs from '../../content/subs'

import { getLanguageName } from '../../../constants/supportedLanguages'
import { useLanguageContext } from '../../../context/LanguageContext'
import firebase from 'firebase/auth'
import { getLinkToWebsite } from '../../background/helpers/websiteLink'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import Button from '../components/button'

const YoutubeSubs: React.FC<{
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
}> = ({ isFullscreenModeOnYt, isWidescreenModeYt }) => {
  const subs = useStore(subsStore)
  const service = getService()
  const strings = useTranslation()
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learningLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const isFullScreenOnNetflix = useSelector<RootState, boolean>((state) => state.settings.isFullScreenOnNetflix)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const freeTranslated = useSelector<RootState, boolean>((state) => state.auth.freeTranslated)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const freeDoubleSubs = useSelector<RootState, boolean>((state) => state.auth.freeDoubleSubs)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const paymentData = useSelector<RootState, IPaymentData>((state) => state.auth.paymentData)
  const randomAB = useSelector<RootState, number>((state) => state.settings.randomAB)


  const [videoElement] = useState(document.querySelector('video'))
  const [currentSubsId, setCurrentSubsId] = useState<number>(0)
  const [freeSubsPanel, setFreeSubsPanel] = useState<boolean>(true)

  const { locale } = useLanguageContext()
  const { isFullScreen } = useFullScreenContex()

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const limitPart1 = strings.youtubeVocSubs.premium.limitPart1
  const limitPart1NotPremium = strings.youtubeVocSubs.notPremium.limitPart1
  const limitLink = strings.youtubeVocSubs.premium.link
  const limitLinkNotPremium = strings.youtubeVocSubs.notPremium.link
  const limitSubsWithTimeCodes = strings.youtubeVocSubs.premium.limitSubsWithTimeCodes
  const limitSubsWithTimeCodesNotPremium = strings.youtubeVocSubs.notPremium.limitSubsWithTimeCodes

  const checkVideoMoment = (currentSub: SubtitleLine) => {
    if (!currentSub) return
    if (!isPaidSubscription && !freeDoubleSubs) return

    sendAmplitudeEvent('subs_list_jump', { way: 'mouse' })

    if (isNetflix) {
      window.dispatchEvent(new CustomEvent('elangSubsSeek', { detail: currentSub.startTime }))
    } else {
      // @ts-ignore
      videoElement.currentTime = currentSub.startTime / 1000 + 0.1
    }
  }

  const startTimeOfSubs = (times: number) => {
    const time = Math.round(times / 1000)
    const hours = Math.floor(time / 60 / 60)
    const minutes = Math.floor(time / 60) - hours * 60
    const seconds = time % 60
    const formatted = [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0'), seconds.toString().padStart(2, '0')]

    formatted[0] === '00' && formatted.shift()

    return formatted.join(':')
  }

  const handleDownloadSub = () => {
    if(subs.text !== null || subs.text !== undefined || subs !== undefined){
      let output=''
      if(isPaidSubscription){
      subs.text?.forEach((elem)=>{
        output+=`${elem.id}\n${startTimeOfSubs(elem.startTime)}-->${startTimeOfSubs(elem.endTime)}\n${elem.text}\n`
      })}
      else {
        subs.text?.slice(0,10).forEach((elem)=>{
          output+=`${elem.id}\n${startTimeOfSubs(elem.startTime)}-->${startTimeOfSubs(elem.endTime)}\n${elem.text}\n`
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
      sendAmplitudeEvent('download_subtitles_B',{ language: subs.languageCode?.toString()||'en'})
    }
  }

  useEffect(() => {
    if (!videoElement) {
      return
    }
  }, [subs, isFullScreenOnNetflix])

  useEffect(() => {
    if (subs.text) {
      if (!isPaidSubscription && !freeDoubleSubs) return
      const videoElement = document.querySelector('video')
      if (!videoElement) {
        return
      }

      const handleTimeUpdate = () => {
        if (!(subs && subs.text && videoElement)) return

        const currentVideoElement = document.querySelector('video')
        if (!currentVideoElement) return
        const allCurrentSubs = Subs.getCurrentSubs(currentVideoElement, subs.text)

        if (allCurrentSubs[0]) {
          setCurrentSubsId(allCurrentSubs[0]?.id)
        }
      }
      const timerForVideoId = setInterval(handleTimeUpdate, 250)

      return () => {
        if (videoElement) {
          setCurrentSubsId(0)
          clearInterval(timerForVideoId)
        }
      }
    }
  }, [subs.text, isPaidSubscription, freeDoubleSubs])

  useEffect(() => {
    const currentDomSub = document.getElementById(`${currentSubsId}sub`)
    const subList = document.getElementById('elangSubList')
    if (currentDomSub && videoElement) {
      isNetflix || isCoursera
        ? subList?.scrollTo(0, currentDomSub.offsetTop - window.innerHeight / 5 + 50)
        : subList?.scrollTo(0, currentDomSub.offsetTop - +videoElement?.style.height.split('px').join('') / 5)
    }
 
  }, [currentSubsId])

  useEffect(() => {
    chrome.storage.sync.get(['isFirstTimeAtDay'], (result) => {
      if (!isPaidSubscription && !freeDoubleSubs && (result.isFirstTimeAtDay || result.isFirstTimeAtDay === undefined)) {
        const event = {
          category: 'Plans',
          action: `EndOfFreeSubs`,
          label: `${getLanguageName(learningLanguageCode, locale)}/${getLanguageName(localLanguageCode, locale)}, ${getService()}`,
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

        sendAmplitudeEvent('limit_double_subs', { resource: `${service}` })

        chrome.runtime.sendMessage({ component: 'sendAnalyticsCustomeEvent', event: { dimension: 'dimension1', value: 'Subtitle Limit' } })

        if (!isPaidSubscription && !freeTranslated && !freeDoubleSubs) {
          chrome.runtime.sendMessage({ component: 'sendAnalyticsCustomeEvent', event: { dimension: 'dimension1', value: 'All Limits' } })
        }

        chrome.storage.sync.set({ isFirstTimeAtDay: false })
      }
    })

    if (isYoutube || isNetflix || isCoursera) {
      chrome.storage.sync.get(['dualSubsUsedData'], (result) => {
        if (Object.keys(result).length) {
          if(result.dualSubsUsedData.numDualSubsUsed >= 81) {
            setFreeSubsPanel(false)
          }
        }
      })
    }
  }, [freeDoubleSubs])

  return (
    <>
      {!isPaidSubscription && !freeDoubleSubs || !isPaidSubscription && !freeSubsPanel ? (
        <div
          style={{ maxWidth: 297, boxSizing: 'border-box', top: 60, zIndex: 999, left: '50%', transform: 'translateX(-50%)',  background: isDarkModeInYoutube || isFullscreenModeOnYt || isNetflix ? 'rgba(51, 51, 51, 0.70)' : '#EFF2FE' }}
          className="relative rounded-[12px] px-[54px] py-[45px] mt-[15px] animate-fade"
        >
          <div className="flex flex-col items-center">
          {isDarkModeInYoutube || isFullscreenModeOnYt || isNetflix ? <LockDark /> : <Lock />}
            <div className={`flex flex-col mt-[34px] gap-[12px] text-[14px] leading-[19px] text-center ${
            isDarkModeInYoutube || isFullscreenModeOnYt || isNetflix ? 'text-gray-100' : 'text-gray-400'
            }`}>
            <p>{!paymentData?.isSubscriptionFinished ? limitPart1NotPremium : limitPart1}</p>
            <p>
              <span
                className="cursor-pointer text-brand-300"
                onClick={() => {
                  const event = {
                  category: 'Plans',
                  action: `OpenSubscription`,
                  label: `From Free Limit`,
                }
                chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
                user ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
                user && sendAmplitudeEvent('go_to_Premium', { location: 'double_subs' })
                }}
              >
              {!paymentData?.isSubscriptionFinished ? limitLinkNotPremium : limitLink}
              </span>
            {!paymentData?.isSubscriptionFinished ? limitSubsWithTimeCodesNotPremium : limitSubsWithTimeCodes}
            </p>
            </div>
          </div>
        </div>
      ) : 
      (<div
        id="elangSubList"
        style={{ height: '100%', filter: !isPaidSubscription && !freeDoubleSubs || !isPaidSubscription && !freeSubsPanel ? 'blur(1000px)' : '' }}
        className={`${
          !isPaidSubscription && !freeDoubleSubs || !isPaidSubscription && !freeSubsPanel ? 'select-none' : ''
        } scrollbar scrollbar-width-yt scrollbar-track-radius-full relative
        ${
          isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen
            ? 'scrollbar-thumb-gray-400 scrollbar-track-gray-20'
            : positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4
            ? 'scrollbar-thumb-blue-350 scrollbar-track-[#5F6368] opacity-60'
            : 'scrollbar-thumb-blue-350 scrollbar-track-gray-200'
        }
      `}
      >
        {randomAB === 1 ?
        <div className="px-[20px] pt-[16px]">
          <Button
            className={`2xl:h-44 font-sans border-0 font-bold`}
            type="primary"
            text={strings.tooltip.youtube.downloadSub}
            onClick={handleDownloadSub}
            disabled={subs.text?.length === 0}
          />
         </div> : null}
        {subs.text?.map((el, i) => {
          return (
            <div
              key={i}
              className={`flex gap-[10px] ${i + 1 === subs.text?.length && 'pb-9'} ${
                currentSubsId === el.id ? (isDarkModeInYoutube || isFullscreenModeOnYt || isWidescreenModeYt || isCoursera || isNetflix) ? 'rounded-[12px] bg-elang-subtitle-dark text-white' : 'rounded-[12px] bg-[#EFF2FE] text-gray-600' : (isDarkModeInYoutube || isFullscreenModeOnYt || isWidescreenModeYt || isCoursera || isNetflix) ? 'text-white' : 'text-gray-600'
              } 
              
              ${!isCoursera && 'mt-5 pt-2 pb-2 pr-4 pl-11 text-2xl'}`}
              style={
                isCoursera ? 
                {
                  fontSize: '14px',
                  lineHeight: '16px',
                  marginTop: '24px',
                  paddingLeft: '28px',
                  paddingRight: '16px',
                  transition: currentSubsId === el.id ? 'all 0.3s ease-out 0.05s' : ''
                }
                :  currentSubsId === el.id ? {transition: 'all 0.3s ease-out 0.05s'} : {}
              }
              
            >
              <span className={`cursor-pointer dark:hover:text-blue-300 hover:text-blue-300 ${currentSubsId === el.id ? (isDarkModeInYoutube || isFullscreenModeOnYt || isWidescreenModeYt || isCoursera || isNetflix) ? 'text-blue-200' : 'text-blue-400' : 'text-gray-300'}`} onClick={() => checkVideoMoment(el)} >{startTimeOfSubs(el.startTime)}</span> <span id={`${el.id}sub`}>{el.text}</span>
            </div>
          )
        })}
      </div>)}
    </>
  )
}

export default YoutubeSubs
