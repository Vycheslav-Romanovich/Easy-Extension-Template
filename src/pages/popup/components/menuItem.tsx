import React from 'react'
import { OnClickHandler } from '../../../constants/types'

type PropType = {
  image: React.ReactNode
  text: string
  color: string
  onClick: OnClickHandler
  needHoverEffect: boolean
}

const MenuItem: React.FC<PropType> = ({ image, text, color, onClick, needHoverEffect }) => {
  return (
    <div
      onClick={onClick}
      style={{ height: 84, width: 96 }}
      className={`group relative z-20 flex flex-col items-center cursor-pointer ${
        needHoverEffect && 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <div className={'mb-3 mt-4 fill-current text-gray-400 dark:text-white group-hover:text-blue-400'}>{image}</div>
      <div className="text-gray-800 dark:text-gray-200 w-20 text-center group-hover:text-blue-400">{text}</div>
    </div>
  )
}

export default MenuItem
