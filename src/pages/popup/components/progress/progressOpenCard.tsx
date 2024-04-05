import React, { useState } from 'react'

import CheckMark from '../../../../assets/icons/menu/check.svg'
import ArrowDown from '../../../../assets/icons/menu/arrowDown.svg'
import ArrowUp from '../../../../assets/icons/menu/arrowUp.svg'

import { Player } from '@lottiefiles/react-lottie-player'
import { useLanguageContext } from '../../../../context/LanguageContext'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'

type PropsType = {
  text: string
  animation: string
  isDone: boolean
  keyValue: string
}

const ProgressOpenCard: React.FC<PropsType> = ({ text, animation, isDone, keyValue }) => {
  const { locale } = useLanguageContext()
  const [isShow, setIsShow] = useState<boolean>(false)

  const openListFeature = () => {
    keyValue === 'account' ? getLinkToWebsite(locale, 'signup') : setIsShow(!isShow)
  }

  const getArrowState = () => {
    if (isShow) {
      return <ArrowUp />
    } else {
      return <ArrowDown />
    }
  }

  return (
    <div className={`z-20 select-none flex flex-col`}>
      <div className="flex items-center z-20">
        <div
          className={`w-5 h-5 rounded-full flex justify-center items-center ${
            !isDone ? 'border-2 border-gray-125 bg-white' : 'bg-blue-400'
          }`}
        >
          {isDone && <CheckMark />}
        </div>
        <div
          onClick={openListFeature}
          className={`z-20 flex justify-center ml-3.5 items-baseline ${
            !isDone ? 'cursor-pointer hover:underline decoration-blue-400' : 'pointer-events-none'
          }`}
        >
          <p className={`text-sm max-w-[320px] ${!isDone ? 'font-bold text-blue-400 mr-1.5' : 'text-gray-400 font-normal lineThrough'}`}>
            {text}
          </p>
          {keyValue !== 'account' && !isDone && getArrowState()}
        </div>
      </div>
      {isShow && (
        <div className="mt-3 ml-7 pr-60px">
          <Player autoplay loop src={animation} className="w-full" />
        </div>
      )}
    </div>
  )
}

export default ProgressOpenCard
