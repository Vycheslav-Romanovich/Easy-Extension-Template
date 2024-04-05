import React from 'react'
import { getService } from '../../../../utils/url'
import SpeakIcon from '../../../../assets/icons/menu/SpeakIcon.svg'
import { WordVocabularyElement } from '../../../../constants/types'
import { sound } from '../../../../utils/sound'

type PropsType = {
  currentStyle: (black: string, general: string) => string
  practiceWord: WordVocabularyElement
  successAnswer: WordVocabularyElement | null
  faildAnswer: WordVocabularyElement | null
  variants: Array<WordVocabularyElement>
  chooseTheAnswer: (value: WordVocabularyElement) => void
}

const TranslatePractice: React.FC<PropsType> = ({
  currentStyle,
  practiceWord,
  successAnswer,
  faildAnswer,
  variants,
  chooseTheAnswer,
}) => {
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'

  return (
    <div className={`w-full flex flex-col items-center ${!isNetflix && !isYouTube && !isCoursera && 'mt-[20px]'}`}>
      <div
        onClick={() => sound(practiceWord)}
        className={`flex text-[18px] font-semibold select-none items-center hover:underline cursor-pointer ${currentStyle(
          'text-blue-200',
          'text-blue-400'
        )} active:text-blue-800`}
      >
        <div className="cursor-pointer">
          <SpeakIcon className="fill-current" />
        </div>
        <p className={`ml-[14px] h-[28px] my-0`}>{practiceWord.word}</p>
      </div>
      <div className="mt-[36px] w-full">
        {variants.map((item, index) => {
          return (
            <div
              onClick={() => chooseTheAnswer(item)}
              className={`select-none ${successAnswer && successAnswer.translate && 'pointer-events-none'} w-full rounded-[4px] border border-solid ${currentStyle(
                'border-white',
                'border-gray-300'
              )} cursor-pointer text-center hover:border-blue-400 active:border-blue-800 ${index && 'mt-[12px]'} ${
                successAnswer && successAnswer.translate === item.translate &&
                `border-green-300 hover:border-green-300 ${currentStyle('bg-green-200', 'bg-green-100')}`
              } ${faildAnswer && faildAnswer.translate === item.translate && 'border-gray-300 hover:border-gray-300 bg-gray-325'}`}
              key={item.timestamp}
            >
              <p className={`text-[14px] m-0 ${currentStyle('text-white', 'text-[#2E2F37]')} py-[10px]`}>{item.translate}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TranslatePractice
