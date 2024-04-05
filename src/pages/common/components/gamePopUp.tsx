import React, { useEffect, useState, useRef } from 'react'
import Button from './button'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { getService } from '../../../utils/url'
import { useTranslation } from '../../../locales/localisation'

import ArrowBottom from  '../../../assets/icons/menu/arrowBottom.svg'
import ArrowBottomBlack from  '../../../assets/icons/menu/arrowBottomBlack.svg'
import PhoneLightIcon from '../../../assets/icons/menu/phoneLightIcon.svg'
import PhoneDarkIcon from '../../../assets/icons/menu/phoneDarkIcon.svg'
import { useLanguageContext } from '../../../context/LanguageContext'
import { setGamePopupShowed } from '../store/settingsActions'

type PropsType = {
  onHandleClick: (value: boolean) => void
}

const GamePopUp: React.FC<PropsType> = ({
  onHandleClick  
}) => {  
  const strings = useTranslation()
  const { locale } = useLanguageContext()
  const dispatch = useDispatch()

  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)

  const playWithWords = strings.popup.menu.playWithWords

  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const menuRef = useRef<any>(null);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const event = {
      category: 'Games',
      action: 'GamesGoTo',
      label: `GamesPopup`
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
    onHandleClick(true)
    dispatch(setGamePopupShowed(true))
  }

  useEffect(() => {
    const handler = (event: { target: any }) => {
      if (!menuRef.current.contains(event.target)) {
        setIsOpen(false)
        onHandleClick(true)
      }
    }
    document.addEventListener("mousedown", handler) 
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  },[])

  return (
    <>
    {isOpen && (
    <div 
      id="elangExtension"
      className={isDarkModeInYoutube || isNetflix ?
         'overflow-hidden border-none rounded-lg p-16px bg-gray-600 text-white':
         'overflow-hidden border-none rounded-lg p-16px bg-white text-gray-600'
        }    
      ref={menuRef}
    >   
    <div className='mb-3 flex flex-row items-center relative text-left'>   
      <div className='mr-4 relative'>
        {isNetflix || isDarkModeInYoutube
          ? <PhoneDarkIcon />
          : <PhoneLightIcon />
        }
        <div className='absolute rounded-full bg-yellow-800 w-13px h-13px'
            style={
              { top: '-5px', right: '3px'}
              }>
          </div>
      </div>
          <div style={{fontSize: '14px', lineHeight: '20px'}}>
            {playWithWords.play}
            <span className="font-bold">{playWithWords.bold}</span>
            {locale === 'en' && <span>{playWithWords.signs}</span>}
          </div>    
        </div>
        <Button
          className={`2xl:h-44 font-sans border-0`}
          type="primary"
          text={playWithWords.buttonDonwload}
          onClick={(e) => {
            handleToggle(e)
          }}
         />
          <div style={
            isYoutube ?
             {bottom: '-16px', right: '42px'} :
             {bottom: '-15px', right: '50px'}
            }
            className='absolute overflow-hidden'>
              {isDarkModeInYoutube || isNetflix ?
              <ArrowBottomBlack /> :
              <ArrowBottom />            
            }            
          </div>
         </div> 
    )}
    </>
  )
}

export default GamePopUp
