import React, { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import Hint from '../../../../assets/images/settings/hint.svg'
import HintHover from '../../../../assets/images/settings/hintHover.svg'
import { makeStyles } from "@material-ui/core/styles";

type PropsType = {
  className?: string
  title?: string
  text?: string
  sizeText?: number
  options?: React.ReactNode
  isHint?: boolean
  tooltipText?: string
}

const SettingOptionYouTube: React.FC<PropsType> = ({ className, text, options, sizeText, isHint, tooltipText }) => {
  const [isHover, setIsHover] = useState<boolean>(false)

  const useStyles = makeStyles(() => ({
    customTooltip: {
      backgroundColor: "rgba(30, 30, 30, 1)"
    },
    customArrow: {
      color: "rgba(30, 30, 30, 1)"
    }
  }));

  const classes = useStyles();

  return (
    <div className={`${className} w-full last:mb-0`} onClick={(e) => {
      e.stopPropagation()
    }}>
      <div className="flex justify-between items-center">
        <div className="flex text-lg text-white ml-9 font-sans select-none" style={{ fontSize: `${sizeText}px` }}>
          {text}
          {isHint ?
              <Tooltip
                classes={{
                  tooltip: classes.customTooltip,
                  arrow: classes.customArrow
                }}
                title={
                <div style={{ display: 'flex', alignItems: 'center', padding: '6px 9px', width: '140px', borderRadius: '3px', fontSize: '12px', fontWeight: 300, textAlign: 'center', lineHeight: '16px' }}>
                  {tooltipText}
                </div>
              }
                placement="top"
                arrow
              >
                <span
                  onMouseOver={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className="flex items-center justify-center ml-1 cursor-pointer"
                >
                  {isHover ? <HintHover /> : <Hint />}
                </span>
              </Tooltip> : null
          }
        </div>
        <div className='mr-7 font-sans'>
          {options}
        </div>
      </div>
    </div>
  )
}

export default SettingOptionYouTube
