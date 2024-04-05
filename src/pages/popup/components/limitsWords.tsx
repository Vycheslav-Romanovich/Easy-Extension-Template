import React from 'react'
import Button from '../../common/components/button'
import { useTranslation } from '../../../locales/localisation'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { IPaymentData } from '../../../constants/types'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import SecondFreePopup from '../../../assets/images/secondFreePopup.svg'

type PropsType = {
  className?: string
  onClick?: () => void
  isPhrase?: boolean
}

const LimitsWords: React.FC<PropsType> = ({ className, onClick, isPhrase }) => {
  const paymentData = useSelector<RootState, IPaymentData>((state) => state.auth.paymentData)
  const strings = useTranslation()
  const { limit20Words, popupFreeTrial } = strings.priceForPopup

  return (
    <div
      className={`${className} flex flex-col items-center dark:bg-gray-700`}
      style={className ? {} : { paddingLeft: 16, paddingRight: 16, paddingTop: 30 }}
    >
      <p className={`text-gray-400 dark:text-white ${isPhrase && 'mt-0'}`} style={{ fontSize: 16, lineHeight: '20px', marginBottom: 12 }}>
        {!paymentData?.isSubscriptionFinished ? popupFreeTrial.textB : limit20Words.text}
      </p>
      <SecondFreePopup className={`${isPhrase ? 'mt-[10px]' :'mt-[20px]'} mb-[30px]`}/>
      <Button
        type="secondary"
        text={!paymentData?.isSubscriptionFinished ? popupFreeTrial.button : limit20Words.button}
        className={isPhrase ? '' : 'mb-[14px]'}
        onClick={() => {
          onClick && onClick()
          sendAmplitudeEvent('go_to_Premium', { location: 'translation' })
        }}
      />
    </div>
  )
}

export default LimitsWords
