import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../../context/LanguageContext'
import { ButtonUnderline } from '../../../common/components/buttonUnderline'
import { useTranslation } from '../../../../locales/localisation'
import VideoServiceVocabulary from '../../../common/video-services-content/videoServiceVocabulary'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'


export const Vocabulary: React.FC = () => {
  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const vocabulary = strings.popup.menu.vocabulary

  const isOpenPractise = useSelector<RootState, boolean>((state) => state.settings.isOpenPractise)  
  const localLang = useSelector<RootState, string>((state) => state.settings.localLang) 

  return (
    <>
      {isOpenPractise &&
      <div className='flex h-[54px] justify-between items-center px-[46px]'>
        <h2 className='text-[18px] font-semibold text-gray-800'>{vocabulary.title}</h2>

        <ButtonUnderline text={vocabulary.full} onClickHandler={() => {
          getLinkToWebsite(locale, 'account/vocabulary')
          sendAmplitudeEvent('view_full_vocabulary',{ native_language: localLang})
        }} />
      </div>}

      <div className={`flex flex-col justify-between bg-[#FFFFFF] ${!isOpenPractise?'min-h-[531px]': 'min-h-[380px]'}`}>
        <VideoServiceVocabulary isFullscreenModeOnYt={false} isWidescreenModeYt={false} isPopUp/>
      </div>
    </>
  )
}
