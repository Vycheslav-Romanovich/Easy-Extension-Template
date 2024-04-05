import React, { FC } from 'react'
import ArrowRight from '../../../assets/icons/menu/arrowRight.svg'
import { ButtonUnderline } from '../../common/components/buttonUnderline'
import { useTranslation } from '../../../locales/localisation'

type Props = {
  onClickHandler: () => void;
  notRegistration?: boolean;
}

export const ComeBack: FC<Props> = ({onClickHandler, notRegistration}) => {
  const strings = useTranslation()
  const account = strings.popup.menu.account

  return (
    <div className={`flex ${notRegistration && 'justify-between'} items-center h-[72px] px-[26px]`}>
      {notRegistration &&(<p className="text-[18px] font-semibold">{strings.popup.menu.soonFeatures.textProgress}</p>)}
      <div className='flex items-center cursor-pointer gap-[12px]' onClick={onClickHandler}>
      {!notRegistration &&(<ArrowRight style={{transform: 'rotate(180deg)'}}/>)}
        <ButtonUnderline text={account.back} onClickHandler={onClickHandler} />
        {notRegistration &&(<ArrowRight />)}
      </div>
    </div>
  )
}
