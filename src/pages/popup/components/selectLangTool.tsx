import React, { useState } from 'react'

import { useTranslation } from '../../../locales/localisation'
import ArrowRightGrey from '../../../assets/icons/menu/arrowRightGrey.svg'
import ArrowDownSelect from '../../../assets/icons/menu/arrowDownSelect.svg'
import PopupTooltipPrompt from '../../common/components/popupTooltipPrompt'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

type PropsType = {
  localLanguageCode: string
  learningLanguageCode: string
}

const SelectLangTool: React.FC<PropsType> = ({
  localLanguageCode,
  learningLanguageCode,
}) => {
  const [isShowTooltip, setIsShowTooltip] = useState<boolean>(false)
  const strings = useTranslation()
  const tooltip = strings.tooltip.langTooltip

  const handleMouse = () =>{
    setIsShowTooltip(!isShowTooltip)
    sendAmplitudeEvent('switch_language')
  }

  return (
    <div className="flex flex-row items-center gap-[4px] cursor-pointer" 
      onMouseEnter={handleMouse}
      onMouseLeave={()=>setIsShowTooltip(!isShowTooltip)}>
        <div className='text-[14px] font-medium leading-[20px] dark:text-gray-100'>{learningLanguageCode.substring(0,2).toUpperCase()}</div>
        <ArrowRightGrey />
        <div className={isShowTooltip?'text-blue-400 text-[14px] font-medium leading-[20px] ':'text-[14px] font-medium leading-[20px] dark:text-gray-100'}>{localLanguageCode.substring(0,2).toUpperCase()}</div>
        <ArrowDownSelect />
    {isShowTooltip && (<PopupTooltipPrompt isRight isLangTooltip
      title={tooltip.text1} 
      titleSecond={tooltip.text2}/>)}
    </div>
  )
}

export default SelectLangTool
