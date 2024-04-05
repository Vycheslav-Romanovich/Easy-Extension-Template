import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { WordVocabularyElement } from '../../../constants/types'
import { RootState } from '../../background/store/reducers'
import DefaultPractiseState from '../components/practise/defaultPractiseState'
import PracticeMainWindow from '../components/practise/practiceMainWindow'
import Fire from '../../../assets/icons/settings/fire.svg'
import Cat from '../../../assets/icons/settings/dayly-practice-cat.svg'
import { StatisticsInfo } from '../components/statisticInfo'
import { setStreak, setTermsCount } from '../../background/helpers/firebase'
import firebase from 'firebase/auth'
import { getService } from '../../../utils/url'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { produceData } from '../../../utils/normalizeTerm'
import { useTranslation } from '../../../locales/localisation'

type PropType = {
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  isMenuParent?: boolean
  setIsPracticeActive?: (isPracticeActive: boolean) => void
}

const ServicePractisePanel: React.FC<PropType> = ({ isFullscreenModeOnYt, isWidescreenModeYt, isMenuParent, setIsPracticeActive }) => {
  const service = getService()
  const { isFullScreen } = useFullScreenContex()
  const strings = useTranslation()
  const { mainWindow } = strings.practice

  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const countOfPracticedWords = useSelector<RootState, number>((state) => state.vocabulary.countOfPracticedWords)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const lastPracticed = useSelector<RootState, number>((state) => state.vocabulary.lastPracticed)
  const streak = useSelector<RootState, number>((state) => state.vocabulary.streak)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)

  const [isPracticeStart, setIsPracticeStart] = useState<boolean>(false)

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'

  const practiceWords = (value: boolean) => {
    setIsPracticeStart(value)
  }

  useEffect(() => {
    const yesterdayDate = produceData(new Date(+new Date() - 24*3600*1000), 'en')
    const nowDate = produceData(new Date(), 'en')
    const lastPracticedDate = produceData(new Date(lastPracticed), 'en')

    // If last practice not today and not yesterday
    if (!(yesterdayDate === lastPracticedDate || nowDate === lastPracticedDate)) {
      setStreak(0, user.uid)
    }

    if (lastPracticedDate !== nowDate) {
      setTermsCount(0, user.uid)
    }
  }, [])

  useEffect(() => {
    setIsPracticeActive && setIsPracticeActive(isPracticeStart)
  }, [isPracticeStart])

  useEffect(() => {
    vocabularyWords.length < 3 && practiceWords(false)
  }, [vocabularyWords.length])

  return (
    <div className={`flex flex-col justify-between h-full`}>
      {isPracticeStart ? (
        <PracticeMainWindow
          practiceWords={practiceWords}
          isFullscreenModeOnYt={isFullscreenModeOnYt}
          isWidescreenModeYt={isWidescreenModeYt}
          isMenuParent={isMenuParent}
          onExit={()=>null}
        />
      ) : (
        <DefaultPractiseState
          isFullscreenModeOnYt={isFullscreenModeOnYt}
          isWidescreenModeYt={isWidescreenModeYt}
          practiceWords={practiceWords}
          isMenuParent={isMenuParent}
        />
      )}

      {!isPracticeStart && !isMenuParent && <StatisticsInfo
        iconLeft={<Fire />}
        iconRight={<Cat />}
        infoLeft={streak}
        infoRight={countOfPracticedWords}
        titleLeft={streak === 1 ? mainWindow.day : mainWindow.days}
        titleRight={mainWindow.terms}
        descriptionLeft={mainWindow.currentStreak}
        descriptionRight={mainWindow.goal}
        darkMode={isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen}
        isPractice
        tooltipTextLeft={`${mainWindow.streakTooltip1} ${streak} ${streak === 1 ? mainWindow.day : mainWindow.days} ${mainWindow.streakTooltip2}`}
        tooltipTextRight={mainWindow.practiceTooltip}
      />}
    </div>
  )
}

export default ServicePractisePanel
