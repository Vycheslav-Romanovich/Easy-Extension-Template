import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WordVocabularyElement } from '../../../../constants/types'
import { useTranslation } from '../../../../locales/localisation'
import { RootState } from '../../../background/store/reducers'
import CatFinish from '../../../../assets/images/vocabulary/catFinish.svg'
import BannerPractice from './bannerPractice'
import { setActiveServiceTab, setPracticeGameWords } from '../../store/videoActions'
import { clearWordsToPractice } from '../../store/vocabularyActions'
import Button from '../button'
import firebase from 'firebase'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../../context/LanguageContext'
import { getService } from '../../../../utils/url'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import { setOpenPractise } from '../../store/settingsActions'

type PropsType = {
  onExit: () => void
  isNextRound: boolean
  currentStyle: (black: string, general: string) => string
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
}

const FinishedPractice: React.FC<PropsType> = ({ onExit, isNextRound, currentStyle, isFullscreenModeOnYt, isWidescreenModeYt }) => {
  const practiceGameWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.video.practiceGameWords)
  const practiceRound = useSelector<RootState, number>((state) => state.video.practiceRound)
  const isFinishedPractice = useSelector<RootState, boolean>((state) => state.video.isFinishedPractice)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)

  const dispatch = useDispatch()
  const strings = useTranslation()
  const { game } = strings.practice
  const { locale } = useLanguageContext()
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const finishedPractice = async () => {
    if (isFinishedPractice && isPaidSubscription) {
      const array = practiceGameWords.map((item) => {
        item.isPracticeWord = false
        return item
      })
      // dispatch(setActiveServiceTab('vocabulary')) 
      dispatch(clearWordsToPractice())
      dispatch(setPracticeGameWords(array))

      onExit()  
    }

    if (isFinishedPractice && !isPaidSubscription) {
      user && user.uid ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
      // onExit()

      sendAmplitudeEvent('go_to_Premium', { location: 'training' })
    }
    dispatch(setOpenPractise(true))
  }

  return (
    <div className={`flex flex-col items-center my-auto relative z-[1] px-0 ${!isYouTube && !isNetflix && !isCoursera && 'pt-[20px]'}`}>
        <CatFinish />
      <h3 className={`mt-[28px] text-[16px] mb-0 font-bold ${currentStyle('text-white', 'text-gray-600')}`}>
        {!isPaidSubscription ? game.lock : game.title}
      </h3>
      {!isPaidSubscription ? (
        <p className={`mt-[6px] mb-0 ${currentStyle('text-gray-300', 'text-gray-400')} text-[12px] max-w-[244px] text-center`}>
          {game.lockDescription}
        </p>
      ) : (
        <p className={`mt-[6px] mb-0 ${currentStyle('text-gray-300', 'text-gray-400')} text-[12px] max-w-[229px] text-center`}>
          {game.resultDescriptionPart1} {isFinishedPractice ? practiceGameWords.length : 10 * practiceRound}/{practiceGameWords.length}{' '}
          {game.resultDescriptionPart2}
        </p>
      )}

      <Button
        type="primary"
        text={!isPaidSubscription ? game.lockBtn : isFinishedPractice ? game.finish : game.next}
        className={`mt-[26px] max-w-[346px] ${!isYouTube && !isNetflix && !isCoursera && 'mb-[20px]'}`}
        onClick={finishedPractice}
      />
      <BannerPractice />
    </div>
  )
}

export default FinishedPractice
