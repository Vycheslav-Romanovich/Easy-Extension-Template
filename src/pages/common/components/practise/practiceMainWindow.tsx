import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WordVocabularyElement } from '../../../../constants/types'
import { useTranslation } from '../../../../locales/localisation'
import { RootState } from '../../../background/store/reducers'
import { setIsFinishedPractice, setPracticeGameWords, setPracticeRound } from '../../store/videoActions'

import Cross from '../../../../assets/icons/youtube/exitCross.svg'
import Confetti from 'react-confetti';
import FinishedPractice from './finishedPractice'
import Lock from '../../../../assets/icons/youtube/footer_lock.svg'
import { getService } from '../../../../utils/url'
import { setOpenPractise } from '../../store/settingsActions'
import PracticeContainer from './practiceContainer'
import { useFullScreenContex } from '../../../../context/FullScreenContext'
import firebase from 'firebase/auth'
import { setLastPractice, setStreak, setTermsCount } from '../../../background/helpers/firebase'
import { produceData } from '../../../../utils/normalizeTerm'
import { clearWordsToPractice } from '../../store/vocabularyActions'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

type PropsType = {
  practiceWords: (value: boolean) => void
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  isMenuParent?: boolean
  onExit: () => void
}

const PracticeMainWindow: React.FC<PropsType> = ({ practiceWords, isFullscreenModeOnYt, isWidescreenModeYt, isMenuParent, onExit }) => {
  const strings = useTranslation()
  const dispatch = useDispatch()
  const { mainWindow } = strings.practice
  const practiceGameWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.video.practiceGameWords)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const practiceRound = useSelector<RootState, number>((state) => state.video.practiceRound)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const countOfPracticedWords = useSelector<RootState, number>((state) => state.vocabulary.countOfPracticedWords)
  const lastPracticed = useSelector<RootState, number>((state) => state.vocabulary.lastPracticed)
  const streak = useSelector<RootState, number>((state) => state.vocabulary.streak)

  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const [progressWidth, setProgressWidth] = useState<number>(0)
  const [allRounds, setAllRounds] = useState<number>(Math.ceil(practiceGameWords.length / 10))
  const [practiceWordsFromRound, setPracticeWordsFromRound] = useState<number>(1)
  const [countOfCurrentWordInRound, setCountOfCurrentWordInRound] = useState<number>(0)
  const [wordsForPractice, setWordsForPractice] = useState<Array<WordVocabularyElement>>([])
  const [updatePracticeState, setUpdatePracticeState] = useState<boolean>(false)
  const [isNextRound, setIsNextRound] = useState<boolean>(false)
  const [roundEnd, setRoundEnd] = useState<boolean>(false)
  const [practiceValue, setPracticeValue] = useState<number>(0)
  const [stopAnimation, setStopAnimation] = useState<boolean>(false)
  const [watchHeight, setWatchHeight] = useState<number | undefined>(0)
  const [countFreePractice, setCountFreePractice] = useState<number>(0)

  const [counterPracticedWords, setCounterPracticedWords] = useState<number>(countOfPracticedWords)

  const { isFullScreen } = useFullScreenContex()

  useEffect(() => {
    const yesterdayDate = produceData(new Date(+new Date() - 24*3600*1000), 'en')
    const nowDate = produceData(new Date(), 'en')
    const lastPracticedDate = produceData(new Date(lastPracticed), 'en')

    if(nowDate === lastPracticedDate) {
      if(localStorage.getItem('countPracticeFree') === null) {
        localStorage.setItem('countPracticeFree', '1')
        setCountFreePractice(1)
      }
      else {
        const countPracticeFree  = (): string => { 
          // @ts-ignore: Unreachable code error
          const local = parseInt(localStorage.getItem('countPracticeFree'))
          setCountFreePractice(local + 1)
          return (local+1).toString()
        }
        localStorage.setItem('countPracticeFree', countPracticeFree())
      }
    }
    
    if (yesterdayDate === lastPracticedDate) {
      setStreak(streak + 1, user.uid)
    }
    
    // If last practice not today and not yesterday
    if (!(yesterdayDate === lastPracticedDate || nowDate === lastPracticedDate)) {
      setStreak(1, user.uid)
      localStorage.setItem('countPracticeFree', '1')
      setCountFreePractice(1)
    }

    if(!isPaidSubscription && countFreePractice >= 3) {
      sendAmplitudeEvent('limit_training')
    }

    setLastPractice(+new Date, user.uid)
    return () => {
      dispatch(setPracticeGameWords([]))
    }
  }, [])

  useEffect(() => {
    if (counterPracticedWords + countOfCurrentWordInRound <= 10) {
      setTermsCount(counterPracticedWords + countOfCurrentWordInRound, user.uid)
    } else {
      setTermsCount(10, user.uid)
    }
  }, [countOfCurrentWordInRound])

  useEffect(() => {
    setAllRounds(Math.ceil(practiceGameWords.length / 10))
  }, [practiceGameWords.length])


  useEffect(() => {
    practiceRound === 0 && dispatch(setPracticeRound(1))
  }, [practiceRound])

  useEffect(() => {
    if (practiceRound !== 0) {
      const wordsCountOfRound = Math.abs(practiceGameWords.length - 10 * (practiceRound - 1))
      practiceRound && 10 * practiceRound - practiceGameWords.length < 0 ? setPracticeWordsFromRound(10) : setPracticeWordsFromRound(wordsCountOfRound)
      roundEnd && setRoundEnd(!roundEnd)

      if (wordsCountOfRound === countOfCurrentWordInRound) {
        nextRoundHandler()
      }

    }
  }, [practiceRound, practiceGameWords.length])

  useEffect(() => {
    if (practiceRound !== 0) {
      const progress = (countOfCurrentWordInRound * 100) / practiceWordsFromRound
      progress && setProgressWidth(progress)

      setWordsForPractice(practiceGameWords.filter((item) => !item.isPracticeWord))
    }
  }, [practiceRound, countOfCurrentWordInRound, practiceGameWords.length])

  function handleWindowSize (): number | undefined {
    return document.querySelector("#practiceMainContainer")?.clientHeight;
  }

  useEffect(() => {
    if (!isYouTube && !isNetflix && !isCoursera) {
      setWatchHeight(295)
    } else {
      setWatchHeight(handleWindowSize())
    }
   const timer = setTimeout(() => setStopAnimation(true), 3000);
   return () => {
    clearTimeout(timer);
    setWatchHeight(0);
    setStopAnimation(false);
  }
 }, [roundEnd])

  const nextRoundHandler = () => {
    setRoundEnd(!roundEnd)
    if (allRounds === practiceRound) {
      dispatch(setIsFinishedPractice(true))
      setIsNextRound(false)
    }

    if (practiceRound < allRounds) {
      setIsNextRound(true)
      setCountOfCurrentWordInRound(0)
    }
  }

  const nextWord = (isFailedAnswer: boolean, countOfWords: number) => {
    setUpdatePracticeState(!updatePracticeState)

    if (!isFailedAnswer) {
      if (isPaidSubscription && countOfCurrentWordInRound + countOfWords === practiceWordsFromRound) {
        nextRoundHandler()
      } else if (!isPaidSubscription && countOfCurrentWordInRound + countOfWords === 3) {
        setRoundEnd(!roundEnd)
        setCountOfCurrentWordInRound(countOfCurrentWordInRound + countOfWords)
        dispatch(setIsFinishedPractice(true))
      } else {
        setCountOfCurrentWordInRound(countOfCurrentWordInRound + countOfWords)
      }
    }
  }

  const currentStyle = (dark: string, general: string): string => {
    if (
      (isNetflix ||
        isDarkModeInYoutube ||
        (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt)) ||
        (isCoursera && isFullScreen)) &&
      !isMenuParent
    ) {
      return dark
    } else {
      return general
    }
  }

  const exitFromPractice = () => {
    dispatch(setOpenPractise(true))
    const event = {
      category: 'Training',
      action: 'TrainingClickExit',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

    onExit()
    dispatch(clearWordsToPractice())
    // practiceWords(false)
    sendAmplitudeEvent('training_exit',{ words_amount: practiceGameWords.length.toString() })
  }

  const getPracticeValue = (value: number) => {
    setPracticeValue(value)
  }
  
  return (
    <div className={`flex flex-col h-full justify-between ${(isYouTube || isNetflix || isCoursera)? 'min-h-[450px]':'min-h-[531px]'}`} id="practiceMainContainer">
        {!roundEnd ? (
            <div className={`flex flex-col pt-[24px] px-[36px] ${!isYouTube && !isNetflix && !isCoursera && 'mb-[40px]'}`}>
              <div className="flex items-center justify-between">
                <p
                  className={`text-[14px] font-bold m-0 ${
                    !isPaidSubscription && roundEnd ? 'text-gray-300' : currentStyle('text-white', 'text-gray-600')
                  }`}
                >
                  {practiceValue === 0 && mainWindow.progressTranslateTitle}
                  {practiceValue === 1 && mainWindow.progressSoundTitle}
                  {practiceValue === 2 && mainWindow.progressMatchTitle}
                </p>
                <span className="text-[12px] text-gray-300">
                  {countOfCurrentWordInRound}/{practiceWordsFromRound}
                </span>
              </div>
              <div className={`h-[6px] w-full ${currentStyle('bg-gray-300', 'bg-gray-980')} rounded-[4px] mt-[6px]`}>
                <div
                  style={{ width: `${progressWidth}%` }}
                  className={`h-full rounded-[4px] ${
                    !isPaidSubscription && roundEnd ? 'bg-gray-300' : currentStyle('bg-blue-200', 'bg-blue-400')
                  }`}
                ></div>
            </div>
          </div>
        ) : null}

      <div className={`${(isNetflix || isCoursera) ? 'h-full pt-[46px]' : `flex h-full ${roundEnd && 'min-h-[400px]'} flex-col justify-center`}`}>
        {isPaidSubscription && roundEnd && (
          <Confetti
            numberOfPieces={stopAnimation ? 0 : 200}
            width={402}
            height={watchHeight}
            colors={['#4F6EFD', '#B5EAFF', '#C4B0FF', '#EDE6F8', '#E4E8FA', '#EDE6F8', '#A4B4FF', '#C4B0FF', '#B5EAFF', '#EDE6F8', '#E4F2FD']}
          />
        )}

        {!roundEnd && wordsForPractice.length ? (
          <PracticeContainer
            wordsForPractice={wordsForPractice}
            nextWord={nextWord}
            updatePracticeState={updatePracticeState}
            currentStyle={currentStyle}
            getPracticeValue={getPracticeValue}
            isMatchPracticeAble={
              (isPaidSubscription && practiceWordsFromRound - countOfCurrentWordInRound >= 3) ||
              (!isPaidSubscription && countOfCurrentWordInRound === 0)
            }
          />
        ) : null}

        {roundEnd && (
          <FinishedPractice
            onExit={onExit}
            isNextRound={isNextRound}
            currentStyle={currentStyle}
            isFullscreenModeOnYt={isFullscreenModeOnYt}
            isWidescreenModeYt={isWidescreenModeYt}
          />
        )}
      </div>
      
      <div
        className={`flex justify-between text-[12px] text-gray-300 border-x-0 border-b-0 border-t border-solid ${currentStyle(
          'border-gray-400',
          'border-gray-980'
        )} py-[15px] pr-[20px] pl-[24px]`}
      >
        {isPaidSubscription ? (
          <p className="m-0 flex flex-row items-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.55467 14.534C10.6387 14.1167 13.3333 12.6174 13.3333 8.7407C13.3333 5.21337 10.7513 2.86404 8.894 1.7847C8.48267 1.5447 8 1.86004 8 2.3367V3.55537C8 4.5167 7.596 6.27137 6.47333 7.00137C5.9 7.37403 5.28 6.81604 5.21067 6.13604L5.15333 5.57737C5.08667 4.92804 4.42533 4.53404 3.90667 4.93004C2.974 5.64004 2 6.8867 2 8.74003C2 13.4807 5.526 14.6667 7.28867 14.6667C7.39133 14.6667 7.49933 14.6627 7.61133 14.6567C7.90867 14.6194 7.61133 14.7227 8.55467 14.5334V14.534Z" fill="#EFA30E"/>
            <path opacity="0.5" d="M5.33301 12.296C5.33301 14.0426 6.74034 14.5826 7.61101 14.6573C7.90834 14.62 7.61101 14.7233 8.55434 14.534C9.24701 14.2893 9.99967 13.6613 9.99967 12.296C9.99967 11.4313 9.45367 10.8973 9.02634 10.6473C8.89567 10.5706 8.74367 10.6673 8.73234 10.818C8.69501 11.2966 8.23501 11.678 7.92234 11.314C7.64567 10.9926 7.52901 10.5226 7.52901 10.222V9.82862C7.52901 9.59262 7.29101 9.43529 7.08701 9.55662C6.32967 10.0053 5.33301 10.9293 5.33301 12.296Z" fill="white"/>
            </svg>&nbsp;{streak}&nbsp;{streak>1?mainWindow.days : mainWindow.day}&nbsp;{mainWindow.streak}
          </p>
        ) : (
          <div className="flex items-center">
            <Lock />
            <p className="ml-[8px] my-0">{mainWindow.lock} ({countFreePractice}/3)</p>
          </div>
        )}
        <div
          className={`flex items-center cursor-pointer hover:underline ${currentStyle('text-gray-200', 'text-gray-300')} ${currentStyle(
            'active:text-gray-200',
            'active:text-gray-400'
          )}`}
          onClick={exitFromPractice}
        >
          <Cross className="fill-current" />
          <p className="ml-[6px] my-0">{mainWindow.exitBtn}</p>
        </div>
      </div>
    </div>
  )
}

export default PracticeMainWindow
