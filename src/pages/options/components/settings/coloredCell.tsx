import React from 'react'
import { SubtitleColors } from '../../../../constants/types'
import clsx from 'clsx'

type PropType = {
  handleColorChange: (color: SubtitleColors) => void
  color: SubtitleColors
  classNameOn?: string
  selectedColor: SubtitleColors
  className?: string
  settings: string
}

const ColoredCell: React.FC<PropType> = ({ handleColorChange, color, selectedColor, className, settings }) => {
  const wrapperClassName = clsx(
    'flex justify-center items-center rounded-md cursor-pointer ring-blue-400 ring-inset bg-gray-330 hover:bg-gray-325 active:bg-gray-330'
  )
  const optionClassName = clsx({ underline: selectedColor === color })
  const cellClassName = clsx(className, 'rounded', {
    'border border-gray-700 ': selectedColor === color,
  })

  return (
    <div
      onClick={() => {
        handleColorChange(color)
      }}
      className={wrapperClassName}
      style={{ marginLeft: '4px', width: 24, height: 20 }}
    >
      {settings === 'option' ? (
        <div className={cellClassName}></div>
      ) : (
        <div className={optionClassName} style={{ color: color, fontSize: 14}}>
          Aa
        </div>
      )}
    </div>
  )
}

export default ColoredCell
