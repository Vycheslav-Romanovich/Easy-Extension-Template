import React, { useEffect, useState } from 'react'
import TriangleIcon from '../../../assets/icons/settings/triangleBot.svg'
import { useLanguageContext } from '../../../context/LanguageContext'
import { Link } from '../../options/router'
import { setActiveServiceTab } from '../store/videoActions'
import { useDispatch } from 'react-redux'

type StyleType = {
  top?: number | string | undefined
  right?: number | string | undefined
  bottom?: number | string | undefined
  left?: number | string | undefined
  width?: number | string | undefined
}

type PropsType = {
  isHighlightTooltip?: boolean,
  title?: string,
  titleSecond?: string,
  isRight?: boolean
  isDone?: boolean
  isTop?: boolean
  isLangTooltip?: boolean
  withLink?: boolean
  icon?: React.ReactNode;
}

const PopupTooltipPrompt: React.FC<PropsType> = ({
  title,
  titleSecond,
  isHighlightTooltip,
  isTop,
  isRight,
  isDone,
  isLangTooltip,
  icon,
  withLink
}) => {
  const dispatch = useDispatch()
  const { locale } = useLanguageContext()

  const [titleWithLink, setTitleWithLink] = useState<string>('')
  const [linkTitle, setLinkTitle] = useState<string>('')

  let mainWidth: StyleType = locale === 'en'
    ? (isRight
      ? (isDone ? {top: '-20px', right: '-170px', width: 170} : isLangTooltip ? {top: '203px', right: '-270px', width: 270} : {width: 200})
      : isHighlightTooltip ? isTop ? { right: 30, top: -27 } : { right:0, top: -27 } : {width: 200, left: 'calc(50% - 100px)', top: -37})
    : (isRight
      ? (isDone ? {top: '-20px', right: '-200px', width: 200} : isLangTooltip ? {top: '213px', right: '-260px', width: 260} : {width: 200})
      : isHighlightTooltip ? isTop ? { right: 30, top: -27 } : { right:0, top: -27 } : { width: 352, left: 'calc(50% - 176px)', top: -37})

  if (icon) {
    mainWidth = { right:7, bottom: 60, width: 200 }
  }

  useEffect(() => {
    if (withLink && title) {
      const titleAsArray = title.split(' ')
      setLinkTitle(titleAsArray.splice(0, 1)[0])
      setTitleWithLink(titleAsArray.join(' '))
    }
  }, [])

  const goToPractise = () => {
    dispatch(setActiveServiceTab('practise'))
  }

  return (
    <div
      className={`flex ${isRight ? 'ml-2' : 'flex-col'} items-center absolute animate-fade font-normal`}
      style={mainWidth}
    >
      {isRight && <TriangleIcon style={{transform: 'rotate(90deg)', height: 18 , position: isLangTooltip && 'absolute', left: isLangTooltip && '-17px'}} />}
      <div className="text-center text-white bg-gray-600 shadow-popup" style={{ fontSize: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', flexWrap: 'wrap', paddingTop: 6, paddingBottom: 6, paddingLeft: 16, paddingRight: 16, borderRadius: 6 }}>
        <span className="flex justify-center">{icon}</span>
        {withLink
          ?
          <span>
            <Link
              className={`text-blue-350 dark:text-blue-300 cursor-pointer ml-1`}
              style={{ color: '#637CF2', textDecoration: 'none', fontSize: 12 }}
              onClick={goToPractise}
            >
              {linkTitle}
            </Link>
            &nbsp;
            {titleWithLink}
          </span>
        : <span className={isLangTooltip? 'text-[14px] leading-[20px] font-normal': ''}>
            {title}
          </span>}
        <span className={isLangTooltip? 'text-[14px] leading-[20px] text-blue-200 font-normal': ''}>{titleSecond}</span>
      </div>
      {!isRight && <TriangleIcon className={`${isHighlightTooltip && 'self-end'}`} style={ isHighlightTooltip ? {marginRight: 24} : {}}/>}
    </div>
  )
}

export default PopupTooltipPrompt