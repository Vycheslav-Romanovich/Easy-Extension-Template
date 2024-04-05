import React, { useEffect, useState } from 'react'
import Button from './button'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { getLinkToWebsite } from '../../background/helpers/websiteLink'
import { getService } from '../../../utils/url'
import { useTranslation } from '../../../locales/localisation'
import firebase from 'firebase'

import Warning from  '../../../assets/icons/vocabulary/warning.svg'

import DisabledCheck from  '../../../assets/icons/vocabulary/disabledCheck.svg'
import Lock from '../../../assets/icons/youtube/lock.svg'

import { useLanguageContext } from '../../../context/LanguageContext'
import { setIsFinishedPractice, setPracticeGameWords, setPracticeRound } from '../store/videoActions'
import { setOpenPractise } from '../store/settingsActions'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

import {  WordVocabularyElement } from '../../../constants/types'

type PropsType = {
  practiceWordsClick: (value: boolean) => void
  vocabularyWordsCount: number
  translateHistoryCount: number
}

const VocabularyFooter: React.FC<PropsType> = ({
  practiceWordsClick,
  vocabularyWordsCount,
  translateHistoryCount
}) => {  
  const strings = useTranslation()
  const { defaultPracticeState, game } = strings.practice
  const { locale } = useLanguageContext()
  const dispatch = useDispatch()

  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const practiceWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.practiceWords)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const isFinishedPractice = useSelector<RootState, boolean>((state) => state.video.isFinishedPractice)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const playWithWords = strings.popup.menu.playWithWords

  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'

  const [countFreePractice, setCountFreePractice] = useState<number>(1)

  const goToPracticeWords = () => {
    let wordsForPracticeSorted: WordVocabularyElement[] = []

    if (practiceWords.length <= 10) {
      wordsForPracticeSorted = practiceWords
    } else {
      practiceWords.sort((a, b) => {
        if (a.memoryScale === undefined) return -1
        if (b.memoryScale === undefined) return 1
        return a.memoryScale - b.memoryScale
      } )
      wordsForPracticeSorted = practiceWords.slice(0, 10)
    }
    // @ts-ignore: Unreachable code error
    const practiceData: Array<WordVocabularyElement>=wordsForPracticeSorted.map((item)=> item.practiceWords)
    practiceData.forEach(item => item.isPracticeWord = false)
    
    dispatch(setPracticeGameWords(practiceData))
    
    dispatch(setOpenPractise(false))

    if (isFinishedPractice) {
      isPaidSubscription && dispatch(setPracticeRound(0))
      dispatch(setIsFinishedPractice(false))
    }

    practiceWordsClick(true)

    sendAmplitudeEvent('training_start', { words_amount: practiceWords.length.toString()})
  }

  const goToPremium = () =>{
    user && user.uid ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
  }

  useEffect(() => {
    if(localStorage.getItem('countPracticeFree') === null || localStorage.getItem('countPracticeFree') === undefined) {
      setCountFreePractice(1)
    }
    else {
      // @ts-ignore: Unreachable code error
      const local = parseInt(localStorage.getItem('countPracticeFree'))
      setCountFreePractice(local)
    }
  }, [])


  return (
   <div className={`sticky bottom-0 flex w-full items-center justify-center ${practiceWords.length >= 3 &&((countFreePractice<3 && !isPaidSubscription) || isPaidSubscription) ? 'pb-[11px]': 'bg-gray-100'}`}>
     {vocabularyWordsCount >= 0 && vocabularyWordsCount < 3 && !(countFreePractice >= 3 && !isPaidSubscription) &&
     <div className="flex flex-row py-4 gap-[4px] items-center">
       <Warning />
       <p className="text-[12px] text-blue-400 font-normal leading-4">{defaultPracticeState.warningFooter}</p>
     </div>
     }
     {vocabularyWordsCount >= 3 && practiceWords.length <3 && !(countFreePractice >= 3 && !isPaidSubscription) &&
      <div className="flex flex-row py-4 gap-[12px] items-center">
      <DisabledCheck />
      <p className="text-[12px] text-gray-300 font-normal leading-4">{defaultPracticeState.moreWordsFooter}</p>
    </div>  
     }
     {(countFreePractice >= 3 && !isPaidSubscription) && 
     <div className="flex flex-row py-4 gap-[12px] items-center">
      <Lock />
      <p className="text-[12px] text-gray-300 font-normal leading-4">{defaultPracticeState.freeLimitFooter}&nbsp;
      <span className='text-blue-400 cursor-pointer' onClick={goToPremium}>
      {defaultPracticeState.premium}
      </span>
      </p>
    </div> }
     {practiceWords.length >= 3 && ((countFreePractice < 3 && !isPaidSubscription) || isPaidSubscription) &&
      <Button  
      type="primary"
      className="rounded min-w-[245px] max-w-[336px]"
      text={`${game.buttonStart1}${practiceWords.length}${game.buttonStart2}`}
      disabled={practiceWords.length>10}
      onClick={goToPracticeWords}
      />
     }
   </div>
  )
}

export default VocabularyFooter
