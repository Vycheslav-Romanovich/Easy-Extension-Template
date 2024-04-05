import React, { useState } from 'react'
import PopupTooltipPrompt from '../popupTooltipPrompt'

type Props = {
  icon: React.ReactNode;
  info: number
  title: string
  description: string
  darkMode: boolean
  isPractice?: boolean
  tooltipText?: string
}

export const InfoBlock: React.FC<Props> = ({
  info,
  title,
  description,
  icon,
  darkMode,
  isPractice,
  tooltipText
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className='flex items-center relative pl-[26px] w-full h-[59px] gap-[12px]'
         onMouseEnter={() => {setShowTooltip(true)}}
         onMouseLeave={() => {setShowTooltip(false)}}
    >
      {showTooltip && isPractice && <PopupTooltipPrompt title={tooltipText} icon={icon}/>}

      {icon}

      <div className='flex flex-col'>
        <h4 className={`text-14px font-bold leading-[20px] m-0 ${
          darkMode
            ? 'text-white'
            : 'text-gray-600'
        }`}>
          {`${info} ${title}`}
        </h4>

        <p className='text-[12px] font-normal leading-[16px] text-gray-300 m-0'>
          {`${description}`}
        </p>
      </div>
    </div>
  )
}
