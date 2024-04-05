import React, { useEffect, useRef } from 'react'
import BtnPlus from '../../../../assets/icons/btnClose.svg'
import { useTranslation } from '../../../../locales/localisation'
import ArrowForTranslatePopup from '../../../../assets/images/arrowForTranslatePopup.svg'
import { getService } from '../../../../utils/url'

type PropsType = {
  onBoarding?: boolean | null
  setOnBoarding?: any
  setElementActive: (value: boolean) => void
}

const OnBoardingForSearchSubtitleBtn: React.FC<PropsType> = ({ onBoarding, setOnBoarding, setElementActive }) => {
  const strings = useTranslation()
  const text = strings.onBoarding.searchBtn
  const onBoardingRef = useRef(null)

  const handleClick = () => {
    setOnBoarding(false)
    localStorage.setItem('watchOnBoardingSearchBtn', 'true' )
  }

  useEffect(() => {
    const event = {
      category: 'Onboarding',
      action: `SearchVideoOnBoarding`,
      label: `${getService()}`,
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }, [])

  useEffect(() => {
    onBoardingRef.current && setElementActive(true)
  }, [onBoardingRef.current])

  return (
    <>
      {onBoarding ? (
        <div ref={onBoardingRef} className="absolute font-inter top-60px left-[-96px] bg-white rounded-8 p-[26px] w-[209px] !z-[3001]">
          <ArrowForTranslatePopup
            style={{ transform: 'rotate(180deg)' }}
            className="absolute fill-current text-white dark:text-gray-700 top-12 left-[120px]"
          />
          <div className="w-full text-right cursor-pointer absolute top-17px right-17px" onClick={handleClick}>
            <BtnPlus className="fill-current dark:text-gray-700 text-gray-400" />
          </div>
          <div className="flex flex-col items-center justify-center text-gray-600">
            <div className="text-[18px] leading-[28px] mb-[4px] font-semibold	text-[#333333] w-full">
              {text.title}
            </div>
            <div className="text-14px leading-[20px] text-[#5F6368] mb-[12px] font-normal" >
              {text.body}
            </div>
            <button
              className="h-40px font-bold w-full bg-blue-400 text-white border-0 text-14px text-center rounded-4 bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 active:from-blue-800 active:to-blue-800 dark:active:from-blue-800"
              onClick={handleClick}
            >
              {text.buttonText}
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default OnBoardingForSearchSubtitleBtn
