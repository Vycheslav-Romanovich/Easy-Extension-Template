import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { IPaymentData } from '../../../../constants/types'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../../context/LanguageContext'

import Visa from '../../../../assets/icons/payment/visaCard.svg'
import MasterCard from '../../../../assets/icons/payment/masterCard.svg'
import PayPal from '../../../../assets/icons/payment/payPal.svg'
import { ConfirmBlock } from '../confirmBlock'
import { ComeBack } from '../comeBack'
import { useTranslation } from '../../../../locales/localisation'
import { ListOfFeatures } from './listOfFeatures'
import { ButtonUnderline } from '../../../common/components/buttonUnderline'
import { sendReqFinishedSubscription } from '../../../background/helpers/requestForPopap'
import firebase from 'firebase/auth'
// import ga from '../../../../utils/ga'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import { produceData } from '../../../../utils/normalizeTerm'

export const Premium: React.FC = () => {
  const { locale } = useLanguageContext()
  const { uid } = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const paymentData = useSelector<RootState, IPaymentData>((state) => state.auth.paymentData)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const strings = useTranslation()
  const premium = strings.popup.menu.premium
  const provider = user && user.providerData[0]?.providerId;

  const [isRestSubscription, setIsRestSubscription] = useState<boolean>(false)
  const [isSubscriptionFinishTime, setIsSubscriptionFinishTime] = useState<boolean>(false)
  const [showCancelSubscription, setShowCancelSubscription] = useState<boolean>(false)

  const isLoginNotEmailProvider =
    provider?.includes('google') || provider?.includes('facebook') || provider?.includes('apple');

  const finishedSubscription = () => {
    sendReqFinishedSubscription({
      uid,
      subscriptionId: paymentData.subscriptionId,
    }).then((res) => {
      if (res.status === 200) {
        // ga('elangExtension.send', 'account-event', 'Account - SubscriptionCancelled');
        setShowCancelSubscription(false);
      }
    });
  };

  useEffect(() => {
    if (paymentData && paymentData.isSubscriptionFinished) {
      setIsRestSubscription(true);
    } else {
      setIsRestSubscription(false);
    }

    paymentData && setIsSubscriptionFinishTime(paymentData?.chargeDate - new Date().getTime() < 0)
  }, [paymentData]);
  
  return (
    <div className={`${showCancelSubscription &&'pb-[10px]'}`}>
      {!showCancelSubscription
        ? <div className='flex h-[54px] justify-between items-center px-[29px]'>
          <h2 className='text-[18px] font-semibold text-gray-800'>{!isSubscriptionFinishTime ? premium.subscriptionPlans : premium.title}</h2>

          <ButtonUnderline text={!isSubscriptionFinishTime ? premium.details : premium.manage} onClickHandler={() => {
            getLinkToWebsite(locale, 'account/plans')
            sendAmplitudeEvent('go_to_Premium', { location: 'main' })
          }} />
        </div>
        : <ComeBack onClickHandler={() => setShowCancelSubscription(false)} />
      }

      {!showCancelSubscription && !isSubscriptionFinishTime && paymentData && <div className='flex flex-col'>
        <section className='flex flex-col text-[14px] bg-[#FFFFFF] px-[46px] py-[22px] gap-[16px]'>

          <div className='flex flex-col gap-[16px] gap-[16px]'>
            <div className='flex justify-between gap-[35px]'>
              <span className='text-gray-400'>{premium.current}</span>
              <span className='text-gray-800 text-right'>{`${
                paymentData.subscriptionType.includes('Annual Subscription')
                  ? premium.premAnnual
                  : premium.premMonthly
              } ${+paymentData.isTrialPeriod ? `(${premium.trial})` : ''}`}
              </span>
            </div>

            <div className='flex justify-between gap-[35px]'>
              <span className='text-gray-400'>{premium.method}</span>
              <div className='flex items-center gap-[6px]'>
                <span>{premium.creditCard}</span>
                {paymentData.paymentMethodName === 'Visa' && <Visa className='rounded shadow-payment bg-[#FFF]' />}
                {paymentData.paymentMethodName === 'MasterCard' && <MasterCard className='rounded shadow-payment bg-[#FFF]' />}
                {paymentData.paymentMethodName === 'PayPal' && <PayPal className='rounded shadow-payment bg-[#FFF]' />}
              </div>
            </div>
          </div>
        {/* </section>

        <section className='flex flex-col text-[14px] bg-[#FFFFFF] px-[46px] py-[16px] gap-[16px]'> */}
          <div className='flex justify-between gap-[35px]'>
            <span className='text-gray-400'>{premium.autoRenews}</span>
            <span className='text-gray-800 whitespace-nowrap'>{produceData(new Date(paymentData?.chargeDate), locale)}</span>
          </div>

          <div className='flex justify-between gap-[35px]'>
            <span className='text-gray-400'>{premium.willCharged}</span>
            <span className='text-gray-800 whitespace-nowrap'>
              {paymentData.subscriptionType.includes('Annual Subscription')
                ? `${paymentData.orderPrice} ${paymentData.nextChargeCurrency}/${premium.year}`
                : `${paymentData.orderPrice} ${paymentData.nextChargeCurrency}/${premium.month}`
              }
              </span>
          </div>
        </section>
      </div>}

      {(!paymentData || isSubscriptionFinishTime) && <section className='flex flex-col text-[14px] px-[16px] pb-[16px] gap-[16px]'>
        <div className='flex flex-col gap-[26px]'>
        <ListOfFeatures type='premium'/>
        <ListOfFeatures type='base'/>
        </div>
      </section>}

      {showCancelSubscription &&
        <ConfirmBlock title={premium.cancelSubscription}
                      isLoginNotEmailProvider={isLoginNotEmailProvider}
                      confirmText={premium.cancelSubscription}
                      text={premium.textBeforeFinish}
                      onConfirm={finishedSubscription}
                      onBack={() => {
                        setShowCancelSubscription(false)
                      }}
        />
      }
    </div>
  )
}
