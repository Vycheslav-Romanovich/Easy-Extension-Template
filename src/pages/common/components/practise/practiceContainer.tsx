import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WordVocabularyElement } from '../../../../constants/types'
import { RootState } from '../../../background/store/reducers'
import TrashIcon from '../../../../assets/icons/youtube/trash-icon.svg'
import { deleteWordFromVocabulary, updateVocabularyWord } from '../../../background/helpers/firebase'
import { useTranslation } from '../../../../locales/localisation'
import firebase from 'firebase/auth'
import { getService } from '../../../../utils/url'
import { getRandomElements, getRandomValue, shuffle } from '../../../background/helpers/wordsPractice'
import TranslatePractice from './translatePractice'
import SoundPractice from './soundPractice'
import MatchPractice from './matchPractice'
import { setPracticeGameWords } from '../../store/videoActions'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import { updateMemoryScalePopup } from '../../../background/helpers/requestForPopap'

type PropsType = {
  wordsForPractice: Array<WordVocabularyElement>
  nextWord: (value: boolean, countOfWords: number) => void
  updatePracticeState: boolean
  currentStyle: (black: string, general: string) => string
  getPracticeValue: (value: number) => void
  isMatchPracticeAble: boolean
}

const PracticeContainer: React.FC<PropsType> = ({
  wordsForPractice,
  nextWord,
  updatePracticeState,
  currentStyle,
  getPracticeValue,
  isMatchPracticeAble,
}) => {
  const strings = useTranslation()
  const dispatch = useDispatch()
  const { game } = strings.practice

  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const practiceGameWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.video.practiceGameWords)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const [practiceWord, setPracticeWord] = useState<WordVocabularyElement>()
  const [translations, setTranslations] = useState<Array<WordVocabularyElement>>([])
  const [matchesPairs, setMatchesPairs] = useState<Array<WordVocabularyElement>>([])
  const [faildAnswer, setFaildAnswer] = useState<WordVocabularyElement | null>(null)
  const [successAnswer, setSuccessAnswer] = useState<WordVocabularyElement | null>(null)
  const [randomValue, setRandomValue] = useState<number>(0)
  const [selectedElement, setSelectedElement] = useState<WordVocabularyElement | null>(null)

  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const getUpdatedArray = (selectedElement: WordVocabularyElement) => {
    return practiceGameWords.map((item) => {
      if (item.word === selectedElement.word) {
        item.isPracticeWord = true
        return item
      }
      return item
    })
  }

  const correctAnswer = (selectedElement: WordVocabularyElement) => {
    setTimeout(() => {
      dispatch(setPracticeGameWords(getUpdatedArray(selectedElement)))
      const memoryRating = selectedElement.memoryScale ? selectedElement.memoryScale + 1 : 1

      updateVocabularyWord(selectedElement, user.uid, true).then(() => {
        updateMemoryScalePopup(user.uid, selectedElement.word, memoryRating > 5 ? 5 : memoryRating ).then(() => {
          nextWord(false, 1)
        })
      }).catch(e => {
        console.error(e)
        nextWord(false, 1)
      })
    }, 500)
  }

  const failedAnswer = (selectedElement: WordVocabularyElement) => {
    setFaildAnswer(selectedElement)
    practiceWord?.word && setSuccessAnswer(practiceWord)
    setTimeout(() => nextWord(true, 1), 2000)
  }

  const chooseSoundTheAnswer = async () => {
    if (selectedElement) {
      if (selectedElement.word === practiceWord?.word) {
        setSuccessAnswer(practiceWord)

        const event = {
          category: 'Training',
          action: 'CorrectTranslation',
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

        correctAnswer(selectedElement)
      } else {
        const event = {
          category: 'Training',
          action: 'InorrectTranslation',
        }
        chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })

        failedAnswer(selectedElement)
      }
    }
  }

  const chooseTranslateTheAnswer = async (selectedElement: WordVocabularyElement) => {
    if (selectedElement.translate === practiceWord?.translate) {
      setSuccessAnswer(practiceWord)

      const event = {
        category: 'Training',
        action: 'CorrectTranslation',
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      sendAmplitudeEvent('training_word_selected', { answer: 'correct' })

      correctAnswer(selectedElement)
    } else {
      const event = {
        category: 'Training',
        action: 'InorrectTranslation',
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
      sendAmplitudeEvent('training_word_selected', { answer: 'incorrect' })

      failedAnswer(selectedElement)
    }
  }

  const chooseMatchAnswer = (countOfMatchesWords: number, removeData: Array<WordVocabularyElement>) => {
    let dataAfterRemoveFromPractice = [...practiceGameWords]

    const learningWords = removeData.length
      ? matchesPairs.filter((matchesItem) => !removeData.some((removeDataItem) => removeDataItem.word === matchesItem.word))
      : matchesPairs

    if (removeData.length) {
      dataAfterRemoveFromPractice = dataAfterRemoveFromPractice.filter((matchesItem) => {
        return !removeData.some((removeDataItem) => removeDataItem.word === matchesItem.word)
      })

      removeData.forEach((item) => {
        deleteWordFromVocabulary(item.word, user.uid)
      })
      removeData.length === 3 && nextWord(false, countOfMatchesWords)
    }

    learningWords.forEach((item, index) => {
      dataAfterRemoveFromPractice = dataAfterRemoveFromPractice.map((gameWords) => {
        if (item.word === gameWords.word) {
          gameWords.isPracticeWord = true
          return gameWords
        }
        return gameWords
      })

      const memoryRating = item.memoryScale ? item.memoryScale + 1 : 1

      updateVocabularyWord(item, user.uid, true).then(() => {
          updateMemoryScalePopup(user.uid, item.word, memoryRating > 5 ? 5 : memoryRating).then(() => {
            index === learningWords.length - 1 && nextWord(false, countOfMatchesWords)
          })
        }).catch(e => {
        console.error(e)
        index === learningWords.length - 1 && nextWord(false, countOfMatchesWords)
      })
    })

    dispatch(setPracticeGameWords(dataAfterRemoveFromPractice))
  }

  const updateSelectedState = (value: WordVocabularyElement) => {
    setSelectedElement(value)
  }

  const setPracticeValue = (): number => {
    const value = getRandomValue(isMatchPracticeAble ? new Array(3) : new Array(2));
    setRandomValue(value);
    getPracticeValue(value);

    return value;
  }

  const removeWordFromPractice = (practiceWord: WordVocabularyElement) => {
    deleteWordFromVocabulary(practiceWord.word, user.uid).then(() => {
      dispatch(setPracticeGameWords(practiceGameWords.filter((item) => item.word !== practiceWord.word)))
    })
  }

  useEffect(() => {
    const indexofPractice = setPracticeValue()

    if (wordsForPractice.length) {
      const currentWord = wordsForPractice[getRandomValue(wordsForPractice)]
      setPracticeWord(currentWord)


      if (indexofPractice === 2 && wordsForPractice.length >= 3) {
        setMatchesPairs(shuffle(getRandomElements(currentWord, wordsForPractice)))
      }

      if (indexofPractice !== 2) {
        setTranslations(shuffle(getRandomElements(currentWord, vocabularyWords)))
      }
    }
    setSuccessAnswer(null)
    setFaildAnswer(null)
    setSelectedElement(null)
  }, [wordsForPractice.length, updatePracticeState])

  return (
    <div className={`flex self-center flex-col items-center px-[36px] mx-auto ${!isYouTube && !isNetflix && !isCoursera ? 'w-full' : 'w-[330px]'}`}>
      {practiceWord && (translations.length || matchesPairs.length) && (
        <>
          {randomValue === 0 && (
            <TranslatePractice
              practiceWord={practiceWord}
              chooseTheAnswer={chooseTranslateTheAnswer}
              successAnswer={successAnswer}
              faildAnswer={faildAnswer}
              variants={translations}
              currentStyle={currentStyle}
              key={practiceWord.word}
            />
          )}
          {randomValue === 1 && (
            <SoundPractice
              practiceWord={practiceWord}
              chooseTheAnswer={chooseSoundTheAnswer}
              successAnswer={successAnswer}
              faildAnswer={faildAnswer}
              variants={translations}
              currentStyle={currentStyle}
              selectedElement={selectedElement}
              setSelectedElement={updateSelectedState}
              key={practiceWord.translate}
            />
          )}
          {randomValue === 2 && <MatchPractice currentStyle={currentStyle} variants={matchesPairs} chooseTheAnswer={chooseMatchAnswer} />}
        </>
      )}
      {practiceWord && practiceGameWords.length > 3 && randomValue !== 2 && (
        <div
          className={`cursor-pointer hover:underline flex mt-[26px] items-center ${
            !isNetflix && !isYouTube && !isCoursera && 'mb-[20px]'
          } ${currentStyle('text-gray-200', 'text-gray-300')} ${currentStyle('active:text-gray-200', 'active:text-gray-400')}`}
          onClick={() => removeWordFromPractice(practiceWord)}
        >
          <TrashIcon className="fill-current" />
          <p className={`ml-[6px] text-[12px] my-0`}>{game.deleteWord}</p>
        </div>
      )}
    </div>
  )
}

export default PracticeContainer
