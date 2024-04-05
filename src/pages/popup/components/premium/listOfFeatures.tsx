import React, { FC } from 'react'
import Button from '../../../common/components/button'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import OkItem from '../../../../assets/icons/menu/okItem.svg'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import { useTranslation } from '../../../../locales/localisation'
import { useLanguageContext } from '../../../../context/LanguageContext'

type Props = {
  type: 'base' | 'premium'
}

export const ListOfFeatures: FC<Props> = ({type}) => {
  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const premium = strings.popup.menu.premium

  const isBase = type === 'base'

  const data = isBase
    ? strings.popup.menu.plans.free.advantages
    : strings.popup.menu.plans.premium.advantages

  const handleClickPrem =()=> {
    if(!isBase){
      getLinkToWebsite(locale, 'account/plans')
      sendAmplitudeEvent('go_to_Premium', { location: 'main' })
    }
  }

  return (
    <div className='w-[372px] p-[24px_18px_17px_17px] flex flex-col gap-[16px] bg-[#FFFFFF] shadow-[0px_1px_10px_4px_rgba(95,99,104,0.07)] rounded-xl'>
      <div className='flex justify-between items-center ml-[25px]'>
        <div className='flex gap-[6px] cursor-default'>
          <h4 className={`text-[24px] font-bold ${isBase? 'text-blue-400' : 'text-red-700'}`}>
            {isBase ? premium.base : premium.premium}
          </h4>
          {/* <span className={`${isBase?'text-blue-400':'text-gray-300'} text-[10px] font-normal`}>{isBase ? `(${premium.active})` : `(${premium.free7})`}</span> */}
        </div>

        <span className={`${isBase ? 'text-[12px]' :'text-[16px]'} ${isBase ? 'font-normal' : 'font-bold'}`}>{isBase ? `${premium.free}` : `${premium.from} $3.95 / ${premium.month}`}</span>
      </div>

      <div className='flex flex-col gap-[6px]'>
        {data.map((item, index) => {
          return (
            <div key={index} className='flex items-baseline gap-[8px]'>
              <OkItem fill='#EE3A8A'/>
              <p className='text-gray-400'>{item.text}</p>
            </div>
          )
        })}
      </div>
      <Button 
        type={isBase?'secondaryDisabled':'primary'}
        text={isBase?premium.active:premium.startTrial}
        onClick={handleClickPrem}
      />
    </div>
  )
}
