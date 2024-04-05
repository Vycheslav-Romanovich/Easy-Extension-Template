import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../../context/LanguageContext'
import { ButtonUnderline } from '../../../common/components/buttonUnderline'
import { useTranslation } from '../../../../locales/localisation'
import ServiceProductsPanel from '../../../common/video-services-content/videoServiceProductsPanel'


export const Products: React.FC = () => {
  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const { premium, products } = strings.popup.menu

  const isOpenPractise = useSelector<RootState, boolean>((state) => state.settings.isOpenPractise)   

  return (
    <>
      {isOpenPractise &&
      <div className='flex h-[54px] justify-between items-center px-[46px]'>
        <h2 className='text-[18px] font-semibold text-gray-800'>{products.title}</h2>

        <ButtonUnderline text={premium.details} onClickHandler={() => {
          getLinkToWebsite(locale, 'account/products')
        }} />
      </div>}

      <div className={`flex flex-col justify-between bg-[#FFFFFF] ${!isOpenPractise?'min-h-[531px]': 'min-h-[380px]'}`}>
        <ServiceProductsPanel isFullscreenModeOnYt={false} isWidescreenModeYt={false} isPopUp />
      </div>
    </>
  )
}
