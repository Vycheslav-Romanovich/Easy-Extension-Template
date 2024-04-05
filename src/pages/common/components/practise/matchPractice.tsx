import React, { useEffect, useState } from 'react'
import { MatchPracticeData, WordVocabularyElement } from '../../../../constants/types'
import { getService } from '../../../../utils/url'
import { shuffle } from '../../../background/helpers/wordsPractice'
import { useTranslation } from '../../../../locales/localisation'
import TrashIcon from '../../../../assets/icons/youtube/trash-icon.svg'

type PropsType = {
  currentStyle: (black: string, general: string) => string
  variants: Array<WordVocabularyElement>
  chooseTheAnswer: (value: number, array: Array<WordVocabularyElement>) => void
}

const MatchPractice: React.FC<PropsType> = ({ currentStyle, variants, chooseTheAnswer }) => {
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'
  const strings = useTranslation()
  const { game } = strings.practice

  const [selectedElementId, setSelectedElementId] = useState<number | null>(null)
  const [selectedElements, setSelectedElements] = useState<Array<{ selectElement: MatchPracticeData; index: number }>>([])
  const [matchFaildAnswer, setMatchFaildAnswer] = useState<Array<{ selectElement: MatchPracticeData; index: number }>>([])
  const [successAnswer, setSuccessAnswer] = useState<WordVocabularyElement | null>(null)
  const [successAnswerIdList, setSuccessAnswerIdList] = useState<Array<number>>([])
  const [wordsData, setWordsData] = useState<Array<MatchPracticeData>>([])
  const [removedData, setRemovedData] = useState<Array<MatchPracticeData>>([])

  const getCurrentStyleState = (element: MatchPracticeData, index: number) => {
    if (successAnswer?.word === element.word || successAnswer?.translate === element.word) {
      return `border-green-300 hover:border-green-300 ${currentStyle('bg-green-200', 'bg-green-100')}`
    } else if (
      (matchFaildAnswer[0] && matchFaildAnswer[0].index === index) ||
      (matchFaildAnswer[1] && matchFaildAnswer[1].index === index)
    ) {
      return 'border-gray-300 hover:border-gray-300 bg-gray-325'
    } else if (selectedElementId === index) {
      return currentStyle('border-blue-200', 'border-blue-400')
    } else {
      return currentStyle('border-white', 'border-gray-300')
    }
  }

  const getDataToMatchPractice = (words: Array<WordVocabularyElement>) => {
    const data = [] as Array<MatchPracticeData>
    words.forEach((item, index) => {
      data.push({ id: index, word: item.word, wordData: item })
      data.push({ id: index, word: item.translate, wordData: item })
    })

    return shuffle(data)
  }

  const getStackofRemovedElements = (removedItem: MatchPracticeData) => {
    setRemovedData((prevData) => [...prevData, removedItem])
    setSelectedElements([])
    setSelectedElementId(null)
  }

  const matchPair = (item: MatchPracticeData, index: number) => {
    setSelectedElementId(index)
    setSelectedElements([...selectedElements, { selectElement: item, index }])
    if ([...selectedElements, item].length === 2) {
      setSelectedElementId(null)
      if (selectedElements[0].selectElement.id === item.id) {
        setSuccessAnswer(item.wordData)

        setTimeout(() => {
          setSuccessAnswerIdList([...successAnswerIdList, item.id])
          setSuccessAnswer(null)
          setSelectedElements([])
        }, 500)
      }

      if (selectedElements[0].selectElement.id !== item.id) {
        setSelectedElementId(null)
        setMatchFaildAnswer([selectedElements[0], { selectElement: item, index }])
        setTimeout(() => {
          setMatchFaildAnswer([])
          setSelectedElements([])
        }, 2000)
      }
    }
  }

  useEffect(() => {
    setWordsData(getDataToMatchPractice(variants))
    setSelectedElementId(null)
    setSelectedElements([])
    setMatchFaildAnswer([])
    setSuccessAnswer(null)
    setSuccessAnswerIdList([])
    setRemovedData([])
  }, [variants])



  useEffect(() => {
    if (successAnswerIdList.length + removedData.length === 3) {
      chooseTheAnswer(
        successAnswerIdList.length,
        removedData.map((removedDataItem) => removedDataItem.wordData)
      )
      setRemovedData([])
    }
  }, [successAnswerIdList, removedData.length])

  return (
    <>
      <div className={`w-full flex flex-col items-center ${!isNetflix && !isYouTube && !isCoursera && 'mt-[20px]'}`}>
        <div className={`w-full flex flex-wrap gap-y-[12px] ${successAnswer || (matchFaildAnswer.length && 'pointer-events-none')}`}>
          {wordsData.map((item, index) => {
            return (
              <div
                onClick={() => matchPair(item, index)}
                className={`w-fit select-none text-[14px] ${currentStyle(
                  'text-white',
                  'text-gray-600'
                )} rounded-[4px] border border-solid cursor-pointer text-center px-[26px] py-[10px] ml-[12px] ${getCurrentStyleState(
                  item,
                  index
                )} ${successAnswerIdList.includes(item.id) && 'opacity-0 pointer-events-none'} ${
                  removedData.some((element) => element.id === item.id) && 'opacity-0 pointer-events-none'
                }`}
                key={index}
              >
                {item.word}
              </div>
            )
          })}
        </div>
      </div>

      {wordsData.length > 6 &&
      <div
        className={`${selectedElementId === null && 'pointer-events-none opacity-50'} cursor-pointer hover:underline flex mt-[26px] items-center ${
          !isNetflix && !isYouTube && !isCoursera && 'mb-[20px]'
        } ${currentStyle('text-gray-200', 'text-gray-300')} ${currentStyle('active:text-gray-200', 'active:text-gray-400')}`}
        onClick={() => selectedElementId !== null && getStackofRemovedElements(wordsData[selectedElementId])}
      >
        <TrashIcon className="fill-current" />
        <p className={`ml-[6px] text-[12px] my-0`}>{game.deleteWord}</p>
      </div>}
    </>
  )
}

export default MatchPractice
