import React from 'react'
import LightningIcon from '../../../assets/icons/menu/lightningTiny.svg'
import { useTranslation } from '../../../locales/localisation'

const PremiumEndingSoonCard = () => {
  const strings = useTranslation()
  const premiumEndSoon = strings.popup.menu.premiumEndSoon

  return (
    <div
      style={{ height: 94, background: 'linear-gradient(92.38deg, #4F6EFD -4.52%, #2644D2 75.72%)' }}
      className="w-full px-5 select-none"
    >
      <div className="pt-5 text-white">{premiumEndSoon.title}</div>
      <div className="mt-2.5 flex items-baseline justify-between text-white">
        <div className="text-base">3 {premiumEndSoon.days}</div>
        <div className="flex items-center underline cursor-pointer">
          <div className="mr-1.5">
            <LightningIcon />
          </div>
          {premiumEndSoon.subscribe}
        </div>
      </div>
    </div>
  )
}

export default PremiumEndingSoonCard
