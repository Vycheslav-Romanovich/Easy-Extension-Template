import React, { useState } from 'react'
import './toggle.css'
import clsx from 'clsx'
import { getService } from '../../../../utils/url'

type PropType = {
  value: boolean
  onClick?: (event: React.MouseEvent) => void
  classNameOn?: string
  classNameOff?: string
  dotClassNameOn?: string
  dotClassNameOff?: string
  textClassNameOn?: string
  textClassNameOff?: string
  size?: 'md' | 'lg'
  imageOnDot?: React.ReactNode
  isNetflixDouble?: boolean
  onBoarding?: boolean | null | undefined
  playerMainBtn?: boolean
}

const Toggle: React.FC<PropType> = ({
  value,
  onClick,
  dotClassNameOn = '',
  dotClassNameOff = '',
  classNameOn = 'bg-brand-300',
  classNameOff = 'bg-gray-300',
  textClassNameOn = 'fill-current text-brand-300',
  textClassNameOff = 'fill-current text-gray-400',
  size= 'md',
  imageOnDot,
  isNetflixDouble,
  onBoarding,
  playerMainBtn,
}) => {
  const [isHover, setIsHover] = useState(false)
  const isCoursera = getService() === 'coursera'

  const dotClassName = clsx(
    `dot text-center absolute bg-white rounded-full shadow ${isCoursera ? value ? 'top-0 inset-5' : 'top-0 inset-1px' : value ? '-top-px inset-4px' : 'inset-1px left-0'} transition flex justify-center items-center select-none`,
    {
      'w-20px h-20px': size === 'md',
      'w-30px h-30px bottom-[1px]': size === 'lg',
    },
    value && dotClassNameOn,
    !value && dotClassNameOff
  )

  const dotClassNameNetflixDouble = clsx(
    'dot bg-white rounded-full m-1 flex items-center justify-center select-none',
    value && dotClassNameOn,
    !value && dotClassNameOff
  )

  const bgClassName = clsx(
    'my-0.5 rounded-full shadow-inner',
    {
      'w-55px h-23px': size === 'lg',
      'w-36px h-16px': size === 'md',
    },
    value && isHover ? '!bg-blue-800' : value && !isHover ? classNameOn : !value && isHover ? 'bg-gray-10' : classNameOff
  )

  const bgClassNameNetflixDouble = clsx('rounded-full border-2 border-solid border-white flex justify-end items-center')

  const textClassName = clsx('flex justify-center items-center relative', value && textClassNameOn, !value && textClassNameOff)

  return (
    <label onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={`flex items-center cursor-pointer`}>
      <div
        className="relative"
        onClick={onClick}
        style={
          isNetflixDouble
            ? {
                marginBottom: 5,
                marginLeft: 10,
              }
            : {}
        }
      >
        <input checked={value} id="toogleA" type="checkbox" onChange={() => null} className="sr-only" disabled={value === undefined} />
        {isNetflixDouble ? (
          <div
            className={bgClassNameNetflixDouble}
            style={{
              width: 32,
              height: 16,
            }}
          >
            <div
              className={dotClassNameNetflixDouble}
              style={{
                width: 14,
                height: 14,
                transition: 'transform 0.5s',
                transform: value ? '' : 'translate(-14px,0)',
              }}
            >
              <div className={textClassName}>{imageOnDot}</div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`${bgClassName} ${
                isCoursera && playerMainBtn ? 'mt-[6px]' : playerMainBtn && `mt-[2px] ${value && 'hover:bg-blue-800'}`
              }`}
              style={playerMainBtn ? { width: '36px', height: '16px' } : isCoursera ? { height: 16, width: 35 } : {}}
            />
            <div
             style={
               playerMainBtn
                ? { width: '20px', height: '20px' }
                : playerMainBtn && !isCoursera
                ? { top: 0 }
                : onBoarding
                ? { transition: 'transform 0.8s'}
                : isCoursera
                ? { width: 20, height: 20}
                : {}
              }
              className={`${dotClassName} ${isCoursera && playerMainBtn ? 'top-[4px]' : playerMainBtn && 'top-[0px]'}`}
            >
              {imageOnDot ? (
                <div className={textClassName}>{imageOnDot}</div>
              ) : (
                <div
                  style={playerMainBtn ? { fontSize: '8px' } : {}}
                  className={`${textClassName} ${isCoursera && playerMainBtn ? 'top-0' : playerMainBtn && 'top-[1px]'}`}
                >
                  <span style={{ textShadow: 'none' }}>{value ? 'ON' : 'OFF'}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </label>
  )
}

export default Toggle
