import React, { useEffect, useState } from 'react'
import BtnPlus from '../../../../assets/icons/btnClose.svg'
import { useTranslation } from '../../../../locales/localisation'
import OnBoardingSubListDark from '../../../../assets/icons/showSubList/darkSubList.svg'
import OnBoardingSubListDarkIcon from '../../../../assets/icons/showSubList/iconSub.svg'
import OnBoardingSubListDarkIconS from '../../../../assets/icons/showSubList/iconSubS.svg'
import OnBoardingDualIconD from '../../../../assets/icons/btnOnBoardingRepeat/dualSubsAnimateD.svg'
import OnBoardingDualIcon from '../../../../assets/icons/btnOnBoardingRepeat/dualSubsAnimate.svg'
import OnBoardingRepeatIcon from '../../../../assets/icons/btnOnBoardingRepeat/repeatAnimate.svg'
import OnBoardingRepeatIconR from '../../../../assets/icons/btnOnBoardingRepeat/repeatAnimateR.svg'
import OnBoardingSubListWhite from '../../../../assets/icons/showSubList/whiteSubList.svg'
import OnBoardingDualSubsDark from '../../../../assets/icons/btnOnBoardingRepeat/dualSubsDark.svg'
import OnBoardingDualSubsWhite from '../../../../assets/icons/btnOnBoardingRepeat/dualSubsWhite.svg'
import OnBoardingRepeatWhite from '../../../../assets/icons/btnOnBoardingRepeat/repeatWhite.svg'
import OnBoardingRepeatDark from '../../../../assets/icons/btnOnBoardingRepeat/repeatDark.svg'
import StepFour from '../../../../assets/animations/OnBoardingStepFour.json'
import SubListS from '../../../../assets/icons/btnOnBoardingRepeat/subListS.svg'
import DualSubsD from '../../../../assets/icons/btnOnBoardingRepeat/dualSubsD.svg'
import RepeatR from '../../../../assets/icons/btnOnBoardingRepeat/repeatR.svg'
import FigrArrow from '../../../../assets/icons/btnOnBoardingRepeat/figurArrow.svg'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { getService } from '../../../../utils/url'
import { setPositionOnBoarding } from '../../store/settingsActions'
import { Player } from '@lottiefiles/react-lottie-player'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

const onBoarding: React.FC = () => {
  const dispatch = useDispatch()
  const strings = useTranslation()

  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'
  const isCoursera = getService() === 'coursera'
  const videoElement = document.querySelector('video')
  const text = strings.onBoarding

  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const positionOnBoarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  const [isVideoElementLoad, setIsVideoElementLoad] = useState<boolean>(false)

  const nextPosition = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation()
    if (positionOnBoarding < 4) dispatch(setPositionOnBoarding(positionOnBoarding + 1))
  }
  const prevPosition = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation()
    if (positionOnBoarding > 1) dispatch(setPositionOnBoarding(positionOnBoarding - 1))
  }
  const handleClick = (e: React.BaseSyntheticEvent) => {
    e.stopPropagation()
    localStorage.setItem('watchingOnBoarding', 'true')
    dispatch(setPositionOnBoarding(0))

    if (isYoutube) {
      document.querySelectorAll('.onBoardingDisable').forEach((domElement) => domElement.remove())

      const relatedElement = document.querySelector('#related');
      const elangExtension = document.querySelector('#elangExtension.elang_youtube_window_wrapper');
      const below = document.querySelector('#below');

      relatedElement && relatedElement.removeAttribute('style');
      elangExtension && elangExtension.removeAttribute('style');
      below && below.removeAttribute('style');
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoElement && videoElement.getAttribute('src')) {
        setIsVideoElementLoad(true)
        clearInterval(interval)
      }
    }, 100)
    const isVideoPlay = isYoutube
      ? setInterval(() => {
          const videoElement = document.querySelector('video')
          if (videoElement && !videoElement.paused) {
            videoElement.pause()
          }
        }, 100)
      : null
    return () => {
      //@ts-ignore
      isYoutube ? clearInterval(isVideoPlay) : null
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('watchingOnBoarding')) {
      if (isNetflix) {
        window.dispatchEvent(new CustomEvent('elangPauseNetflixVideo'))
      } else {
        videoElement && videoElement.getAttribute('src') ? videoElement.pause() : null
      }
    }
  }, [isVideoElementLoad])

  useEffect(() => {
    if (positionOnBoarding) {
      sendAmplitudeEvent('onboarding_view', { onboarding_step: `${positionOnBoarding}` })
    }
  }, [positionOnBoarding])

  useEffect(() => {
    const headerOnYt = document.querySelector('#masthead-container')
    if (headerOnYt && positionOnBoarding !== 0) {
      //@ts-ignore
      headerOnYt.style.zIndex = 0
    }
    return () => {
      if (headerOnYt) {
        //@ts-ignore
        headerOnYt.style.zIndex = 2020
      }
    }
  }, [positionOnBoarding])

  return (
    <div
      className={`${
        isNetflix || isDarkModeInYoutube
          ? 'dark bg-[#333333] text-white border-[8px solid #FFFFF] shadow-onboarding'
          : 'bg-white border-white text-[#333333] shadow-none border-none'
      } ${
        isYoutube && positionOnBoarding === 4
          ? '!h-[239px] !left-[-23px] !top-[-307px]'
          : isCoursera && positionOnBoarding === 4
          ? '!h-[285px] !left-[-148px] !top-[-307px]'
          : 'h-auto left-[-273px] top-[-178px]'
      } ${
        isNetflix && positionOnBoarding === 4 ? 'h-[250px] left-[-30px] top-[-320px] top-[-178px]' : 'h-auto left-[-273px] top-[-190px]'
      } absolute !z-[10000] bottom-72 select-none !rounded-[8px] !w-[261px] !py-[26px] !cursor-default `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`dark:bg-gray-800 bg-white px-[23px] ${isNetflix || isDarkModeInYoutube ? ' !bg-transparent' : ''}`}>
        <div className="absolute cursor-pointer leading-[1px] top-[12px] right-[12px]" onClick={handleClick}>
          <BtnPlus className="fill-current text-gray-600 dark:text-blue-100" />
        </div>
        <div className="flex justify-center">
          <div className="justify-self-center flex justify-center items-center">
            {positionOnBoarding === 1 && (
              <div className="relative flex flex-col mb-[4px]">
                <div className="imgContainer relative w-[209px] h-[110px] mb-[18px]">
                  {isNetflix || isDarkModeInYoutube ? (
                    <OnBoardingSubListDark className="text-center" />
                  ) : (
                    <OnBoardingSubListWhite className="text-center" />
                  )}
                  <div>
                    <OnBoardingSubListDarkIcon className="absolute top-[72px] left-[56px] w-full animate-showIcon" />
                    <OnBoardingSubListDarkIconS className="absolute top-[72px] left-[59px] w-full delay-[1.6s] animate-showIcon2" />
                  </div>
                </div>
                <div className="flex items-center mb-[10px]">
                  <span className="text-18px font-inter font-semibold text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none mr-[9px] !z-[1000]">
                    {text.stepOne.title}
                  </span>
                  <SubListS />
                </div>
                <span className="text-[14px] font-inter font-normal text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none !z-[1000]">
                  {text.stepOne.text}
                </span>
              </div>
            )}
            {positionOnBoarding === 2 && (
              <div className="relative flex flex-col mb-[4px]">
                <div className="imgContainer relative w-[209px] h-[110px] mb-[18px]">
                  {isNetflix || isDarkModeInYoutube ? (
                    <OnBoardingDualSubsDark className="text-center" />
                  ) : (
                    <OnBoardingDualSubsWhite className="text-center" />
                  )}
                  <div>
                    <OnBoardingDualIcon className="absolute top-[72px] left-[108px] w-full animate-showIcon" />
                    <OnBoardingDualIconD className="absolute top-[72px] left-[114px] w-full delay-[3s] animate-showIcon2" />
                  </div>
                </div>
                <div className="flex items-center mb-[10px]">
                  <span className="text-18px font-inter font-semibold text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none mr-[9px] !z-[1000]">
                    {text.stepTwo.title}
                  </span>
                  <DualSubsD />
                </div>
                <span className="text-[14px] font-inter font-normal text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none !z-[1000]">
                  {text.stepTwo.text}
                </span>
              </div>
            )}
            {positionOnBoarding === 3 && (
              <div className="relative flex flex-col mb-[4px]">
                <div className="imgContainer relative w-[209px] h-[110px] mb-[18px]">
                  {isNetflix || isDarkModeInYoutube ? (
                    <OnBoardingRepeatDark className="text-center" />
                  ) : (
                    <OnBoardingRepeatWhite className="text-center" />
                  )}
                  <div>
                    <OnBoardingRepeatIcon className="absolute top-[8px] left-[146px] w-full animate-showIcon" />
                    <OnBoardingRepeatIconR className="absolute top-[18px] left-[157px] w-full delay-[1.6s] animate-showIcon2" />
                  </div>
                </div>
                <div className="flex items-center mb-[10px]">
                  <span className="text-18px font-inter font-semibold text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none mr-[9px] !z-[1000]">
                    {text.stepThree.title}
                  </span>
                  <RepeatR />
                </div>
                <span className="text-[14px] font-inter font-normal text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none !z-[1000]">
                  {text.stepThree.text}
                </span>
              </div>
            )}
            {positionOnBoarding === 4 && (
              <div className="relative flex flex-col mb-[4px]">
                <div className="mb-[18px] w-[209px]">
                  <Player autoplay loop src={StepFour} className="w-full h-[110px]" />
                </div>
                <div className="flex items-center mb-[10px]">
                  <span className="[text-shadow:none] text-18px font-inter font-semibold leading-[26px] text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none mr-[9px]">
                    {text.stepFour.title}
                  </span>
                </div>
                <span className="[text-shadow:none] text-[14px] font-inter leading-[17px] font-normal text-gray-800 opacity-100 bg-opacity-100 dark:text-blue-100 select-none !z-[1000]">
                  {text.stepFour.text}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={`flex justify-between mt-[12px] items-center`}>
          <span className={'[text-shadow:none] text-gray-600 font-inter text-14px dark:text-blue-100 leading-[16px]'}>
            {positionOnBoarding + '/4'}
          </span>
          <div className="flex">
            <div onClick={prevPosition} className="flex cursor-pointer items-center mr-[16px]">
              {positionOnBoarding === 0 ||
              positionOnBoarding === 2 ||
              positionOnBoarding === 3 ||
              positionOnBoarding === 4 ? (
                <p className="[text-shadow:none] font-bold font-inter text-14px cursor-pointer stroke-current text-[#888B99] z-10000 leading-[20px]">
                  {strings.onBoarding.button.back}
                </p>
              ) : (
                <div className="!w-[9px]" />
              )}
            </div>
            <div className="flex items-center cursor-pointer" onClick={nextPosition}>
              {positionOnBoarding === 0 ||
              positionOnBoarding === 1 ||
              positionOnBoarding === 2 ||
              positionOnBoarding === 3 ? (
                <p className="[text-shadow:none] font-bold font-inter text-14px cursor-pointer stroke-current text-[#738BFB] z-10000 leading-[20px]">
                  {strings.onBoarding.button.next}
                </p>
              ) : (
                <p
                  onClick={handleClick}
                  className="[text-shadow:none] font-bold text-14px cursor-pointer stroke-current text-[#738BFB] z-10000 leading-[20px]"
                >
                  {strings.onBoarding.button.finish}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <FigrArrow
        className={`absolute fill-current text-white dark:text-gray-600 right-[-10px] ${
          positionOnBoarding === 1
            ? 'bottom-[70px]'
            : positionOnBoarding === 2
            ? 'bottom-[35px]'
            : positionOnBoarding === 3
            ? 'bottom-[5px]'
            : isCoursera && positionOnBoarding === 4
            ? 'left-[160px] bottom-[-17px] rotate'
            : positionOnBoarding === 4
            ? 'bottom-[-17px] left-[33px] rotate'
            : ''
        }`}
      />
    </div>
  )
}

export default onBoarding
