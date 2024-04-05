import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { Tooltip } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import PopupTooltipPrompt from '../popupTooltipPrompt'
import { MemoryItem } from './memoryItem'
import SpeakIcon from '../../../../assets/icons/menu/SpeakIcon.svg'
import Check from '../../../../assets/icons/vocabulary/Check.svg'
import Choise from '../../../../assets/icons/vocabulary/Choise.svg'
import YouTube from '../../../../assets/icons/vocabulary/youtube.svg'
import Netflix from '../../../../assets/icons/vocabulary/netflix.svg'
import Coursera from '../../../../assets/icons/vocabulary/coursera.svg'
import Internet from '../../../../assets/icons/vocabulary/internet.svg'
import DoneIco from '../../../../assets/icons/settings/vocabulary-word-done.svg'
import StarIcon from '../../../../assets/icons/menu/star.svg'
import TrashIcon from '../../../../assets/icons/settings/vocabulary-trashIcon.svg'
import { PhraseVocabularyElement, WordHistoryElement, WordVocabularyElement } from '../../../../constants/types'
import { useTranslation } from '../../../../locales/localisation'
import { sound } from '../../../../utils/sound'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import useStyles from '../../../common/styles/tooltipSyle'

type Props = {
  item: any
  darkMode: boolean
  isWordSaved?: boolean
  activeTab: 'saved' | 'translationHistory' | 'practice'
  addItemToVocabulary: (item: WordVocabularyElement | PhraseVocabularyElement | WordHistoryElement) => void
  removeElement: (item: WordVocabularyElement | PhraseVocabularyElement | WordHistoryElement) => void
  addItemToPractice: (item: WordVocabularyElement) => void
  removeItemToPractice: (item: WordVocabularyElement) => void
  isPopUp?: boolean
}

export const TermItem: React.FC<Props> = ({item, darkMode, activeTab, addItemToVocabulary, isWordSaved, removeElement, addItemToPractice, removeItemToPractice, isPopUp}) => {
  const strings = useTranslation()
  const { vocabulary, monthsList } = strings.popup.menu
  const classes = useStyles()
  const months = [
    monthsList.items0, 
    monthsList.items1, 
    monthsList.items2, 
    monthsList.items3, 
    monthsList.items4, 
    monthsList.items5, 
    monthsList.items6, 
    monthsList.items7, 
    monthsList.items8, 
    monthsList.items9, 
    monthsList.items10, 
    monthsList.items11];
  const isNetflix = item.link.includes('netflix')
  const isYoutube = item.link.includes('youtu')
  const isCoursera = item.link.includes('coursera')

  const practiceWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.practiceWords)
  const learningLang = useSelector<RootState, string>((state) => state.settings.learningLang)

  const [showScaleTooltip, setShowScaleTooltip] = useState(false)
  const [showDoneTooltip, setShowDoneTooltip] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [isShowWordTranslate, setIsShowWordTranslate] = useState(false)
  const [isShowWord, setIsShowWord] = useState(false)

  const handleChange = (item: any) => {
    setIsChecked((prev) => !prev)

    if(!isChecked) {
      addItemToPractice(item)
    }
    else {
      removeItemToPractice(item)
    }
  }

  const handleClickShowTranslate = () => {
    setIsShowWordTranslate(!isShowWordTranslate)
    sendAmplitudeEvent('reveal_context_translate', { language: learningLang })
  }
  
  const handleClickShowWord = () => {
    setIsShowWord(!isShowWord)
    sendAmplitudeEvent('reveal_context_word', { language: learningLang })
  }

  const ContextElement:React.FC = () => {
    return (item.historyPhrases != undefined ? 
      item.historyPhrases.toString().replace(/[^\s\w]/g,'').split(' ').map((element:string, index: number) => element.toLowerCase() === item.word.toLowerCase()
      ? isShowWordTranslate ? 
        <>
          <span className={`text-blue-400 cursor-pointer ${index === 0 ? 'first-letter:uppercase' : ''}`} onClick={handleClickShowTranslate} key={Math.floor(Math.random()*item.timestamp)}>{item.translate.toLowerCase()}</span>
          <span className={`text-blue-400 cursor-pointer ${index === 0 ? 'first-letter:uppercase' : ''}`} onClick={handleClickShowWord} key={Math.floor(Math.random()*item.timestamp)}>({isShowWord ? element : '•'.repeat(element.length)})&nbsp;</span>
        </>
      :
      <span className='cursor-pointer text-blue-400' onClick={handleClickShowTranslate} key={Math.floor(Math.random()*item.timestamp)}> 
      {'•'.repeat(item.translate.length)}({'•'.repeat(element.length)})&nbsp;</span> : 
      <span className={`cursor-default ${index === 0 ? 'first-letter:uppercase' : ''}`} key={Math.floor(Math.random()*item.timestamp)}>{element}&nbsp;</span>) :
      null)
  }
  
  const LinkElement:React.FC = () => {
    return <Tooltip
    title={
      <div className='cursor-pointer' style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', flexDirection: 'column' }}>
        <div style={{ color: '#A4B4FF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px'}}>{item.link.replace('https://','').replace('http://','').replace('www.','')}</div>
        <div style={{ width: '140px' }}>{monthsList.viewed} {new Date(item.timestamp).getDate()} {months[new Date(item.timestamp).getMonth()]}</div>
      </div>
    }
    arrow
    TransitionComponent={Fade}
    enterDelay={500}
    placement="left"
    classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
  >
    <div
      className='cursor-pointer text-gray-400 hover:text-blue-400'
      onClick={() => {
        item.link && window.open(item.link,'_blank')
      }}
    >
    {isYoutube && <YouTube/>}
    {isNetflix && <Netflix />}
    {isCoursera && <Coursera />}
    {(!isYoutube && !isNetflix && !isCoursera) && <Internet />}
    </div>
  </Tooltip>
  }

  return (
    <div key={item.timestamp} className={`flex justify-between items-center text-[14px] mb-[20px] leading-[20px] gap-[18px]`}>
      <div className="flex items-center relative gap-[18px]"
           onMouseLeave={() => {setShowScaleTooltip(false)}}
      >
        {showScaleTooltip &&
          <PopupTooltipPrompt title={vocabulary.practiceTheTerms} titleSecond={vocabulary.timesToMemorize} isRight withLink/>
        }

        {item.memoryScale !== undefined &&
          (<div className='flex flex-col gap-[1px] rounded-[4px] overflow-hidden cursor-pointer'
                onMouseEnter={() => {setShowScaleTooltip(true)}}
          >
            <MemoryItem isLight={item.memoryScale === 5}/>
            <MemoryItem isLight={item.memoryScale >= 4}/>
            <MemoryItem isLight={item.memoryScale >= 3}/>
            <MemoryItem isLight={item.memoryScale >= 2}/>
            <MemoryItem isLight={item.memoryScale >= 1}/>
          </div>)
        }

        {activeTab === 'translationHistory' ? <LinkElement/> : 
        <div
          onClick={() => sound(item)}
          className={`flex select-none items-center cursor-pointer`}
        >
          <SpeakIcon className="fill-current text-gray-400" />
        </div>}

        <div className="flex flex-col">
          <div
            className={`${
              darkMode ? 
              isPopUp ? 
                'text-gray-600':
                'text-white'
                : 'text-gray-600'
            } max-w-[382px] break-words flex flex-wrap select-none`}
          >
            {item.word ?
            activeTab === 'translationHistory' ? 
            <ContextElement key={Math.floor(Math.random()*item.timestamp)}/>
            : item.word : item.phrase}
            {item.memoryScale === 5 &&
              <DoneIco className='inline ml-[6px] cursor-pointer'
                       onMouseEnter={() => {setShowDoneTooltip(true)}}
                       onMouseLeave={() => {setShowDoneTooltip(false)}}
              />}
            {showDoneTooltip && <PopupTooltipPrompt title={vocabulary.termMastered}
                                                    titleSecond={vocabulary.practised5times}
                                                    isRight
                                                    isDone
            />}
          </div>
          <div className="text-gray-300 mt-[4px] select-none">{activeTab==='translationHistory' ? null: item.translate}</div>
        </div>
      </div>

      <div className='flex gap-[25px] items-center'>
        {/* {activeTab === 'translationHistory' &&
          <StarIcon className={`cursor-pointer fill-current ${isWordSaved ? 'text-blue-400' : 'text-gray-400'}`}
                    onClick={() => {
                      addItemToVocabulary(item)
                      sendAmplitudeEvent('add_to_favorites')
                    }}
          />
        } */}

        {activeTab === 'saved' && item.memoryScale != 5 &&
          <>{isChecked ?
              <Check  
              className="cursor-pointer"
              onClick={() => handleChange(item)} />:
              practiceWords.length <= 9 &&
              <Choise 
              className="cursor-pointer"
              onClick={() => handleChange(item)}/>}
          </>
        }
        {activeTab==='translationHistory'&&<div style={{marginLeft: 'auto'}}
             className="cursor-pointer right-0 text-gray-400 hover:text-red-400"
             onClick={() => removeElement(item)}
        >
          <TrashIcon className="fill-current" />
        </div>}
      </div>
    </div>
  )
}