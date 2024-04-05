import React from 'react'
import { WordVocabularyElement } from '../../../../constants/types'
import { getService } from '../../../../utils/url'

import SpeakIcon from '../../../../assets/icons/menu/SpeakIcon.svg'
import Button from '../button'
import { useTranslation } from '../../../../locales/localisation'
import { sound } from '../../../../utils/sound'

type PropsType = {
    currentStyle: (black: string, general: string) => string
    practiceWord: WordVocabularyElement
    successAnswer: WordVocabularyElement | null
    faildAnswer: WordVocabularyElement | null
    variants: Array<WordVocabularyElement>
    chooseTheAnswer: () => void;
    setSelectedElement: (value: WordVocabularyElement) => void;
    selectedElement: WordVocabularyElement | null
  }

const SoundPractice: React.FC<PropsType> = ({ practiceWord, currentStyle, successAnswer, faildAnswer, variants, chooseTheAnswer, selectedElement, setSelectedElement }) => {
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'
  
  const strings = useTranslation()
  const { game } = strings.practice

  const getCurrentStyleState = (element: string) => {
    if (successAnswer && successAnswer.word === element) {
      return `border-green-300 hover:border-green-300 ${currentStyle('bg-green-200', 'bg-green-100')}`
    } else if (faildAnswer && faildAnswer.word === element) {
      return 'border-gray-300 hover:border-gray-300 bg-gray-325'
    } else if (selectedElement?.word === element) {
      return currentStyle('border-blue-200', 'border-blue-400')
    } else {
      return currentStyle('border-white', 'border-gray-300')
    }
  }

  const handleClick=(practiceWord: WordVocabularyElement)=>{
    setSelectedElement(practiceWord);
    sound(practiceWord);
  }

  return (
    <div className={`w-full flex flex-col items-center ${!isNetflix && !isYouTube && !isCoursera && 'mt-[20px]'}`}>
      <p className={`flex text-[18px] font-semibold select-none items-center ${currentStyle('text-white', 'text-gray-600')}`}>
        {practiceWord.translate}
      </p>
      <div className={`flex mt-[36px] w-full ${successAnswer && 'pointer-events-none'}`}>
        {variants.map((item, index) => {
          return (
            <div
              onClick={() => handleClick(item)}
              className={`w-full flex items-center justify-center select-none text-[14px] h-[38px] rounded-[4px] border border-solid cursor-pointer text-center hover:border-blue-400 active:border-blue-800 active:text-blue-800 ${
                index && 'ml-[12px]'
              } ${currentStyle('text-blue-200', 'text-blue-400')} ${getCurrentStyleState(item.word)}`}
              key={item.timestamp}
            >
              <SpeakIcon className="fill-current" />
              <p className={`ml-[8px] my-0 ${currentStyle('text-white', 'text-gray-600')}`}>{index + 1}</p>
            </div>
          )
        })}
      </div>

      <Button type={selectedElement ? 'primary' : 'disabled'} text={game.continue} className="mt-[16px]" onClick={chooseTheAnswer} />
    </div>
  )
}

export default SoundPractice
