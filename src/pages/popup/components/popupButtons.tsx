import React, { useState } from 'react'
import PopupTooltip from '../../common/components/popupTooltip'

import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'

import StarIcon from '../../../assets/icons/menu/star.svg'
import PlusIcon from '../../../assets/icons/menu/plus.svg'
import DisableVocIcon from '../../../assets/icons/menu/disabledVoc.svg'
import BookIcon from '../../../assets/icons/menu/book.svg'
import { useTranslation } from '../../../locales/localisation'
import PopupTooltipPrompt from '../../common/components/popupTooltipPrompt'
import SelectLangTool from '../components/selectLangTool'
import firebase from 'firebase/auth'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

type PropsType = {
  clickPlusButton: () => void
  clickVocabularyButton: () => void
  disebled: boolean
  isShowPlusTooltip: boolean
  isShowVocTooltip: boolean
  isMarginOff?: boolean
  uid: string | null
  isAddedItem: boolean
  tooltipMessage: 'premium' | 'account'
  localLanguageCode: string
  learningLanguageCode: string
  isPhrase?: boolean 
  isShowTranslate?:boolean
  isDarkMode?: boolean
  randomAB?: number
}

const PopupButtons: React.FC<PropsType> = ({
  clickPlusButton,
  clickVocabularyButton,
  disebled,
  isShowPlusTooltip,
  isShowVocTooltip,
  uid,
  isAddedItem,
  tooltipMessage,
  isMarginOff,
  localLanguageCode,
  learningLanguageCode,
  isShowTranslate,
  isPhrase,
  isDarkMode,
  randomAB,
}) => {
  const countOfNewWords = useSelector<RootState, number>((state) => state.vocabulary.countOfNewWords)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const [isMouseDownVoc, setIsMouseDownVoc] = useState<boolean>(false)
  const [isMouseDownAdd, setIsMouseDownAdd] = useState<boolean>(false)
  const [isShowVocabulary, setIsShowVocabulary] = useState<boolean>(false)
  const [isShowSave, setIsShowSave] = useState<boolean>(false)
  const strings = useTranslation()
  const tooltip = strings.tooltip.translatePopup

  randomAB === 0 ? sendAmplitudeEvent('test_button_view_A') : sendAmplitudeEvent('test_button_view_B')

  return (
    <div style={{ marginTop: isMarginOff? '':'8px', borderTop: isPhrase? isDarkMode? '1px solid #3E3F45' : '1px solid #EDEEF2':'' }} className={`flex rounded-b-md px-[16px] py-[10px] items-center justify-between`}>
      <div className='flex flex-row gap-[12px] items-center'>
      <div
        onClick={clickPlusButton}
        onMouseDown={() => setIsMouseDownAdd(!isMouseDownAdd)}
        onMouseUp={() => setIsMouseDownAdd(!isMouseDownAdd)}
        onMouseEnter={() => setIsShowVocabulary(!isShowVocabulary)}
        onMouseLeave={() => setIsShowVocabulary(!isShowVocabulary)}
        className={`${
          disebled && 'pointer-events-none'
        } dark:bg-gray-500 dark:border-gray-500 flex items-center justify-center dark:hover:border-blue-300
                hover:border-blue-800 cursor-pointer relative`}
      >
        {isShowPlusTooltip && <PopupTooltip tooltipMessage={tooltipMessage} />}
        {tooltipMessage !== 'premium' ? user && isShowVocabulary && <PopupTooltipPrompt title={isAddedItem?tooltip.delete:tooltip.text1} /> : null}

        {isAddedItem ? (
          randomAB === 0 ?
          <StarIcon className="fill-current text-[#FBBF24]" /> : 
          <PlusIcon className="fill-current text-[#FBBF24]" />
        ) : (
          <>
            {uid ? (
              randomAB === 0 ?
              <StarIcon className={`fill-current text-gray-300 hover:text-blue-350 ${
                isShowVocabulary ? 'text-blue-800' : 'text-blue-400'
              }`}/> :
              <PlusIcon className={`fill-current text-gray-300 hover:text-blue-350 ${
                isShowVocabulary ? 'text-blue-800' : 'text-blue-400'
              }`}/>
            ) : (
              randomAB === 0 ? 
              <StarIcon className={`fill-current text-gray-300 hover:text-blue-350`}/> :
              <PlusIcon className={`fill-current text-gray-300 hover:text-blue-350`}/>
            )}
          </>
        )}
      </div>
      <div
        onClick={() => clickVocabularyButton()}
        onMouseEnter={() => setIsShowSave(!isShowSave)}
        onMouseLeave={() => setIsShowSave(!isShowSave)}
        onMouseDown={() => setIsMouseDownVoc(!isMouseDownVoc)}
        onMouseUp={() => setIsMouseDownVoc(!isMouseDownVoc)}
        className="relative dark:bg-gray-500 dark:border-gray-500 flex items-center justify-center dark:hover:border-blue-300 hover:border-blue-800 cursor-pointer"
      >
        {isShowVocTooltip && <PopupTooltip tooltipMessage={tooltipMessage} />}
        {tooltipMessage !== 'premium' ? user && isShowSave && <PopupTooltipPrompt title={tooltip.text2} /> : null}
        {uid ? (
          <BookIcon
            className={`fill-current hover:text-blue-350 
            
             ${countOfNewWords ? 'text-blue-350': 'text-gray-300'}`}
          />
        ) : (
          <DisableVocIcon />
        )}
        {countOfNewWords ? (
          <div style={{ width: '8px', height: '8px', top: '1px', left: '56%' }} className="popUpImportant absolute bg-yellow-900 rounded-full"></div>
        ) : null}
      </div>
      </div>
        {isShowTranslate && (<SelectLangTool localLanguageCode={localLanguageCode} learningLanguageCode={learningLanguageCode} />)}
    </div>
  )
}

export default PopupButtons
