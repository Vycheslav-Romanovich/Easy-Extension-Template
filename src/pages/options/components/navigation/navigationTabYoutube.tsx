import React from 'react'
import { ActiveServiceTab } from '../../../../constants/types'

import { getService } from '../../../../utils/url'

type PropType = {
  title: string
  className?: string
  line?: string
  name: string
  activeTab: boolean
  setActiveTab: (value: ActiveServiceTab) => void
  isDarkModeInYoutube?: boolean
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
}

const NavigationTabYoutube: React.FC<PropType> = ({ title, className, name, line, activeTab, setActiveTab, isDarkModeInYoutube,isFullscreenModeOnYt, isWidescreenModeYt }) => {
  const service = getService()
  const isNetflix = service === 'netflix'
  const isCoursera = service === 'coursera'

  const goTab = () => {
    (title === 'Subtitles' || title === 'Субтитры' || name === 'Subtitles') && setActiveTab('subtitles');
    (title === 'Vocabulary' || title === 'Словарь' || name === 'Vocabulary') && setActiveTab('vocabulary');
    (title === 'Products' || title === 'Продукты' || name === 'Products') && setActiveTab('products');
  }

  return (
    <div
      className={`${className} ${
        isNetflix ? 'dark' : null
      } relative 2xl:py-[16px] py-[12px] last:mb-0 px-10 flex items-center no-underline select-none`}
    >
      <div className={`flex cursor-pointer ${activeTab && 'pointer-events-none'}`} onClick={goTab}>
        <div className="w-full flex justify-between items-center">
          <div
            style={
              isCoursera
                ? {
                    fontSize: '14px',
                    lineHeight: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  }
                : {}
            }
            className={`${activeTab ? (isDarkModeInYoutube || isFullscreenModeOnYt || isWidescreenModeYt || isCoursera || isNetflix) ? 'text-gray-100' : 'text-gray-700' : `text-gray-300 dark:text-gray-300`} ${
              !isCoursera && 'text-2xl'
            }`}
          >
            {title}
          </div>
        </div>
      </div>
      <div
        className={`${line ? 'w-full' : 'w-sm'} ${line} line ${
          activeTab ? '' : 'invisible'
        } absolute right-0 h-full rounded-l-xl dark:bg-blue-300 bg-blue-400`}
      />
    </div>
  )
}

export default NavigationTabYoutube
