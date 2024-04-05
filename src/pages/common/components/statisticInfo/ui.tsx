import React from 'react'
import { InfoBlock } from './infoBlock'

type Props = {
  iconLeft: React.ReactNode;
  iconRight: React.ReactNode;
  infoLeft: number;
  infoRight: number;
  titleLeft: string;
  titleRight: string;
  descriptionLeft: string;
  descriptionRight: string;
  darkMode: boolean;
  isPractice?: boolean
  tooltipTextLeft?: string
  tooltipTextRight?: string
}

export const StatisticsInfo: React.FC<Props> = (props) => {
  const borderColor = props.darkMode ? '#989898' : '#F1F1F1'
  return (
    <div
      style={{ borderTop: `${props.isPractice ? '':`1px solid ${borderColor}`} `}}
      className={`flex w-full ${props.isPractice && (props.darkMode ? 'bg-transparent':'bg-blue-100')}`}
    >
      <InfoBlock icon={props.iconLeft}
                 info={props.infoLeft}
                 title={props.titleLeft}
                 description={props.descriptionLeft}
                 darkMode={props.darkMode}
                 isPractice={props.isPractice}
                 tooltipText={props.tooltipTextLeft}
      />
      {!props.isPractice &&(<span style={{ borderRight: `1px solid ${borderColor}`, height: '59px' }}></span>)}
      <InfoBlock icon={props.iconRight}
                 info={props.infoRight}
                 title={props.titleRight}
                 description={props.descriptionRight}
                 darkMode={props.darkMode}
                 isPractice={props.isPractice}
                 tooltipText={props.tooltipTextRight}
      />
    </div>
  )
}
