import React, { useState } from 'react'
import ServicePractisePanel from '../../../common/video-services-content/videoServicePractisePanel'
import { setGamePopupShowed } from '../../../common/store/settingsActions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import firebase from 'firebase/auth'
import { useTranslation } from '../../../../locales/localisation'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import Fire from '../../../../assets/icons/settings/fire.svg'
import Cat from '../../../../assets/icons/settings/dayly-practice-cat.svg'
import { StatisticsInfo } from '../../../common/components/statisticInfo'

type Props = {
  isPracticeActive: boolean
  setIsPracticeActive: (isPracticeActive: boolean) => void
}

export const Practice: React.FC<Props> = ({ isPracticeActive, setIsPracticeActive }) => {
  const dispatch = useDispatch()
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const isGameInstall = useSelector<RootState, boolean>((state) => state.settings.isGameInstall)
  const countOfPracticedWords = useSelector<RootState, number>((state) => state.vocabulary.countOfPracticedWords)
  const streak = useSelector<RootState, number>((state) => state.vocabulary.streak)

  const strings = useTranslation()
  const practice = strings.popup.menu.practice
  const { mainWindow } = strings.practice
  const showBannerDate = new Date() < new Date(2023, 9, 1)

  const [isGameLinkShow, setIsGameLinkShow] = useState<boolean>(false)

  const closeWindow = (value: boolean) => {
    chrome.storage.sync.set({ closeGameLink: true })
    setIsGameLinkShow(value)
  }


  const handleClickExtension = () => {
    sendAmplitudeEvent('download_words_practice_app')
    chrome.tabs.query({active: true}, ([tab]) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
      } else {
        tab.url && dispatch(setGamePopupShowed(tab.url))
      }
    });
  }

  return (
    <div className='flex flex-col h-full relative'>
      {!isPracticeActive && <div className='flex h-[54px] justify-between items-center px-[46px]'>
        <h2 className='text-[18px] font-semibold text-gray-800'>{practice.title}</h2>
      </div>}

      <section className={`${isPracticeActive && 'h-full'} ${showBannerDate? 'h-[278px]' : 'h-[300px]'} bg-[#FFFFFF] px-[26px]`}>
        <ServicePractisePanel isMenuParent setIsPracticeActive={setIsPracticeActive} />
      </section>

      {!isPracticeActive && <div className='relative bottom-0 w-full bg-[#FFFFFF]'>
        <StatisticsInfo
          iconRight={<Fire className='w-[24px] h-[26px]' />}
          iconLeft={<Cat />}
          infoRight={streak}
          infoLeft={countOfPracticedWords}
          titleRight={streak === 1 ? mainWindow.day : mainWindow.days}
          titleLeft={mainWindow.terms}
          descriptionRight={mainWindow.currentStreak}
          descriptionLeft={mainWindow.goal}
          darkMode={false}
          isPractice
          tooltipTextRight={`${mainWindow.streakTooltip1} ${streak} ${streak === 1 ? mainWindow.day : mainWindow.days} ${mainWindow.streakTooltip2}`}
          tooltipTextLeft={mainWindow.practiceTooltip}
        />
      </div>}
    </div>
  )
}
