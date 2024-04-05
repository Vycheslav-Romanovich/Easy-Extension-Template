import React, { useEffect, useState } from 'react'
import ProgressCat from '../../../popup/components/progress/progressCat'
import Button from '../button'
import ArrowRight from '../../../../assets/icons/menu/arrowRight.svg'
import Warning from '../../../../assets/icons/youtube/warning.svg'
import QRCode from '../../../../assets/images/qrCodes/qr_to_train_vocabulary.svg'
import { useTranslation } from '../../../../locales/localisation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { WordVocabularyElement } from '../../../../constants/types'
import { getService } from '../../../../utils/url'
import { setIsFinishedPractice, setPracticeGameWords, setPracticeRound } from '../../store/videoActions'
import { setOpenPractise } from '../../store/settingsActions'
import { useFullScreenContex } from '../../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
type PropsType = {
  isWidescreenModeYt?: boolean
  isFullscreenModeOnYt?: boolean
  practiceWords: (value: boolean) => void
  isMenuParent?: boolean
}
const DefaultPractiseState: React.FC<PropsType> = ({ isWidescreenModeYt, isFullscreenModeOnYt, practiceWords, isMenuParent }) => {
  const strings = useTranslation()
  const dispatch = useDispatch()
  const { defaultPracticeState } = strings.practice

  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const practiceRound = useSelector<RootState, number>((state) => state.video.practiceRound)
  const isFinishedPractice = useSelector<RootState, boolean>((state) => state.video.isFinishedPractice)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const countOfPracticedWords = useSelector<RootState, number>((state) => state.vocabulary.countOfPracticedWords)
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const [currentPracticeRound, setCurrentPracticeRound] = useState<number>(practiceRound)

  const { isFullScreen } = useFullScreenContex()

  const showBannerDate = new Date() < new Date(2023, 9, 1)

  useEffect(() => {
    practiceRound === 0 || (isFinishedPractice && isPaidSubscription)
      ? setCurrentPracticeRound(practiceRound)
      : setCurrentPracticeRound(practiceRound - 1)
  }, [vocabularyWords.length, practiceRound])

  const goToPracticeWords = () => {
    let wordsForPracticeSorted: WordVocabularyElement[] = []

    if (vocabularyWords.length <= 10) {
      wordsForPracticeSorted = vocabularyWords
    } else {
      vocabularyWords.sort((a, b) => {
        if (a.memoryScale === undefined) return -1
        if (b.memoryScale === undefined) return 1
        return a.memoryScale - b.memoryScale
      } )
      wordsForPracticeSorted = vocabularyWords.slice(0, 10)
    }
    wordsForPracticeSorted.forEach(item => item.isPracticeWord = false)
    
    dispatch(setPracticeGameWords(wordsForPracticeSorted))
    
    dispatch(setOpenPractise(false))

    if (isFinishedPractice) {
      isPaidSubscription && dispatch(setPracticeRound(0))
      dispatch(setIsFinishedPractice(false))
    }

    practiceWords(true)

    sendAmplitudeEvent('training_start')
    
    const event = {
      category: 'Training',
      action: 'TrainingStart',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const currentStyle = (dark: string, general: string): string => {
    if (
      (isNetflix ||
      isDarkModeInYoutube ||
      (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt)) ||
      (isCoursera && isFullScreen)) && !isMenuParent
    ) {
      return dark
    } else {
      return general
    }
  }

  return (
    <div className={`flex py-[16px] px-[20px] justify-center ${currentStyle('!relative top-[30%]','')} ${isMenuParent && 'gap-[26px]'}`}>
      {/* <ProgressCat
        count={10}
        rating={countOfPracticedWords}
        isWidescreenModeYt={isWidescreenModeYt}
        isFullscreenModeOnYt={isFullscreenModeOnYt}
        isMenuItem={isMenuParent}
      /> */}

      <div>
        {/* <h4 className={`m-0 ${isMenuParent ? 'text-[16px]' : 'text-[14px]'} font-bold ${currentStyle('text-white', 'text-gray-600')}`}>
          {defaultPracticeState.title}
        </h4> */}
        {/* <p className="text-[12px] text-gray-300  mt-[6px] mb-0">
          {vocabularyWords.length}&nbsp;{defaultPracticeState.count}
        </p> */}
        {vocabularyWords.length >= 3 ? (
          <section className={`flex flex-col ${showBannerDate? '' :'pt-[34px]'} items-center gap-[8px]`}>
            <Button 
            type="primary"
            className='rounded-xl min-w-[245px] h-[48px]'
            text={defaultPracticeState.nextBtn }
            component={<ArrowRight className='ml-[6px] fill-white'/>}
            onClick={goToPracticeWords}
            />
            <p className='text-[12px] font-normal text-gray-300'>{defaultPracticeState.or}</p>
            <p className='text-[12px] font-normal'>{defaultPracticeState.mobile}</p>
            <QRCode />
            {/* <p className={`text-[14px] font-bold mr-[8px] hover:underline text-blue-400 mb-0 mt-0`}>{defaultPracticeState.nextBtn}</p>
            <ArrowRight /> */}
          </section>
        ) : (
          <section className="flex flex-col items-center">
          <Button 
            type="disabled"
            className='rounded-xl min-w-[245px] h-[48px] bg-gray-300'
            text={defaultPracticeState.nextBtn }
            component={<ArrowRight className='ml-[6px] fill-white'/>}
            />
          <div className="flex items-center mt-[16px] cursor-pointer">
            <Warning />
            <p className="text-[12px] text-yellow-800 ml-[4px] hover:underline mb-0 mt-0">{defaultPracticeState.warning}</p>
          </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default DefaultPractiseState
