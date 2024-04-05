import React from 'react'
import { useSelector } from 'react-redux'
import MenuPhone from '../../../assets/icons/menu/menuPhone.svg'

import { RootState } from '../../background/store/reducers'
import { OnClickHandler } from '../../../constants/types'
import { getService } from '../../../utils/url'

import { useTranslation } from '../../../locales/localisation'

import Cross from '../../../assets/icons/menu/smallCross.svg'

type PropType = {
  fontSize: string
  lineHeight: string
  onClick?: OnClickHandler
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  position: 'videoSubs' | 'menu' | 'popup'
  isTextCorrection?: boolean
  goToPracticeWords?: (value: boolean) => void
  closeWindow?: (value: boolean) => void
}

const playJoystick: React.FC<PropType> = ({
  fontSize,
  lineHeight,
  onClick,
  isFullscreenModeOnYt,
  isWidescreenModeYt,
  position,
  isTextCorrection,
  goToPracticeWords,
  closeWindow,
}) => {
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)

  const strings = useTranslation()
  const menu = strings.popup.menu

  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'

  return (
    <div
      className={`${
        isTextCorrection
          ? position === 'popup'
            ? 'bg-[#FFFFFF]'
            : 'bg-blue-100'
          : isNetflix || (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt || isDarkModeInYoutube))
            ? `bg-gray-700 border-none`
            : `bg-gray-100 border-elang`
      } flex flex-row items-center relative px-7 py-3 gap-[40px]`}
    >
      <div className={`${position === 'popup' && 'mx-[10px]'} relative`}>
        {/*{position === 'popup' ? (
          isNetflix || (isYouTube && (isFullscreenModeOnYt || isWidescreenModeYt || isDarkModeInYoutube)) ? (
            <DarkPopupPhone />
          ) : (
            <PopupPhone />
          )
        ) : null}*/}
        {position === 'menu' && <MenuPhone />}
        {position === 'videoSubs' && <MenuPhone />}
        {position === 'popup' && <MenuPhone />}
        <div
          className='absolute rounded-full bg-yellow-800 w-13px h-13px'
          style={
            position === 'popup'
              ? { top: '-3px', right: '3px', width: 10, height: 10 }
              : position === 'menu'
                ? { top: '-5px', right: '3px' }
                : position === 'videoSubs'
                  ? { top: '-5px', right: '3px' }
                  : {}
          }
        ></div>
      </div>

      <div className='flex flex-col gap-[6px]'>
        <h3 className='text-[16px] font-bold'>
          {menu.practice.mobile}
        </h3>

        <p
          className={`${isNetflix || (isDarkModeInYoutube && isYouTube) ? `text-white` : `text-gray-400`}`}
          style={{ fontSize: `${fontSize}`, lineHeight: `${lineHeight}` }}
        >
          {position === 'popup' && menu.playWithWords.text}
          {position === 'menu' ? (isTextCorrection ? menu.playWithWords.navigationText : menu.playWithWords.text) : null}
        </p>

        <span
          className='text-blue-400 text-[14px] cursor-pointer mr-1 no-underline hover:underline font-bold'
          onClick={(e) => {
            onClick && onClick(e)
            goToPracticeWords && goToPracticeWords(true)
          }}
        >
          {menu.practice.download}
        </span>
      </div>

      {position === 'menu' || position === 'popup' && (
        <div
          onClick={() => {
            closeWindow && closeWindow(true)
          }}
          className='absolute w-18 h-18 cursor-pointer z-20 right-[12px] top-1.5'
        >
          <Cross />
        </div>
      )}
    </div>
  )
}

export default playJoystick
