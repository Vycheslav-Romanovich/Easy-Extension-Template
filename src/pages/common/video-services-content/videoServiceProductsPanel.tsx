import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import ProductCard from '../components/productCard'

import QrEnglishCards from '../../../assets/images/qrCodes/qrEnglishCards.svg'
import QrEnglishCardsDark from '../../../assets/images/qrCodes/qrEnglishCardsDark.svg'
import QrListening from '../../../assets/images/qrCodes/qrListening.svg'
import QrListeningDark from '../../../assets/images/qrCodes/qrListeningDark.svg'
import QrSubTune from '../../../assets/images/qrCodes/qrSubTune.svg'
import QrSubTuneDark from '../../../assets/images/qrCodes/qrSubTuneDark.svg'
import QrMyWord from '../../../assets/images/qrCodes/qrMyWord.svg'
import QrMyWordDark from '../../../assets/images/qrCodes/qrMyWordDark.svg'
import { ENGLISH_CARDS_LINKS, ENGLISH_PODCASTS, SUBTUNE_LINKS, MY_WORD_LINKS } from '../../../constants/linksStores'
import firebase from 'firebase/auth'
import { getService } from '../../../utils/url'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { useTranslation } from '../../../locales/localisation'

type PropType = {
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  isMenuParent?: boolean
  isPopUp?: boolean
}

const ServiceProductsPanel: React.FC<PropType> = ({ isFullscreenModeOnYt, isWidescreenModeYt, isMenuParent, isPopUp }) => {
  const service = getService()
  const { isFullScreen } = useFullScreenContex()
  const strings = useTranslation()
  const { products } = strings.popup.menu

  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const positionOnboarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'

  const isDarkMode = isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen

  return (
    <div id='elangProductsList'
    className={`scrollbar scrollbar-width-yt scrollbar-track-radius-full relative
    flex flex-col h-full gap-[16px] items-center my-[16px] cursor-default
    ${
      isDarkMode
        ? 'scrollbar-thumb-gray-400 scrollbar-track-gray-20'
        : positionOnboarding === 1 || positionOnboarding === 2 || positionOnboarding === 3 || positionOnboarding === 4
        ? 'scrollbar-thumb-blue-350 scrollbar-track-[#5F6368] opacity-60'
        : 'scrollbar-thumb-blue-350 scrollbar-track-gray-200'
    }
  `}
    >
      {/* <div className={`flex shadow-history p-[17px] rounded-xl ${isNetflix || isDarkModeInYoutube || isYoutube || isFullScreen  ? 'w-[335px]' : 'w-[370px]'}`}>
        <p className='text-[18px] font-normal leading-7'>{products.topText}
          <span className='text-blue-400'>{products.topText1}</span>
        </p>
      </div> */}

      <ProductCard 
        iosLink={ENGLISH_CARDS_LINKS.store.appStore}
        androidLink={ENGLISH_CARDS_LINKS.store.googlePlayStore}
        imageQr={isDarkMode ? isPopUp ? <QrEnglishCards /> : <QrEnglishCardsDark /> : <QrEnglishCards />} 
        description={products.englishCards.description}
        isDark={isDarkMode}
        isPopUp={isPopUp}
        bg={`${isDarkMode ? isPopUp ?
          'linear-gradient(290deg, rgba(81, 14, 133, 0.30) 7.7%, rgba(135, 41, 146, 0.30) 20.35%, rgba(223, 83, 167, 0.30) 40.77%, rgba(243, 156, 176, 0.30) 67.48%, rgba(255, 199, 182, 0.30) 83.12%)' : 
          'linear-gradient(290deg, rgba(147, 31, 162, 0.70) 7.7%, rgba(229, 134, 193, 0.70) 40.77%, rgba(255, 208, 195, 0.70) 83.12%)' : 
          'linear-gradient(290deg, rgba(81, 14, 133, 0.30) 7.7%, rgba(135, 41, 146, 0.30) 20.35%, rgba(223, 83, 167, 0.30) 40.77%, rgba(243, 156, 176, 0.30) 67.48%, rgba(255, 199, 182, 0.30) 83.12%)'}`}
      />

      <ProductCard 
        iosLink={ENGLISH_PODCASTS.store.appStore}
        imageQr={isDarkMode ? isPopUp ? <QrListening /> : <QrListeningDark /> : <QrListening />} 
        description={products.listening.description}
        isDark={isDarkMode}
        isPopUp={isPopUp}
        bg={`${isDarkMode ? isPopUp ?
          'linear-gradient(295deg, rgba(168, 85, 247, 0.30) 18.19%, rgba(255, 255, 255, 0.30) 116.4%)' : 
          'linear-gradient(295deg, rgba(185, 116, 249, 0.70) 18.19%, rgba(250, 250, 250, 0.70) 116.4%)' : 
          'linear-gradient(295deg, rgba(168, 85, 247, 0.30) 18.19%, rgba(255, 255, 255, 0.30) 116.4%)'}`}
      />

      <ProductCard 
        iosLink={SUBTUNE_LINKS.store.appStore}
        imageQr={isDarkMode ? isPopUp ? <QrSubTune /> : <QrSubTuneDark /> : <QrSubTune />} 
        description={products.subTune.description}
        isDark={isDarkMode}
        isPopUp={isPopUp}
        bg={`${isDarkMode ? isPopUp ?
          'linear-gradient(108deg, rgba(107, 246, 255, 0.40) 4.64%, rgba(255, 227, 250, 0.40) 79.08%)' : 
          'linear-gradient(108deg, rgba(173, 249, 254, 0.70) 4.64%, rgba(255, 227, 250, 0.70) 79.08%)' : 
          'linear-gradient(108deg, rgba(107, 246, 255, 0.40) 4.64%, rgba(255, 227, 250, 0.40) 79.08%)'}`}
      />

      <ProductCard 
        iosLink={MY_WORD_LINKS.store.appStore}
        androidLink={MY_WORD_LINKS.store.googlePlayStore}
        imageQr={isDarkMode ? isPopUp ? <QrMyWord /> : <QrMyWordDark /> : <QrMyWord />} 
        description={products.myWord.description}
        isDark={isDarkMode}
        isPopUp={isPopUp}
        bg={`${isDarkMode ? isPopUp ?
          'linear-gradient(302deg, rgba(114, 237, 242, 0.40) -1.88%, rgba(81, 140, 229, 0.40) 73.3%, rgba(81, 96, 229, 0.40) 96.18%)' : 
          'linear-gradient(302deg, rgba(174, 244, 246, 0.70) -1.88%, rgba(86, 154, 244, 0.70) 73.3%, rgba(115, 126, 234, 0.70) 96.18%)' : 
          'linear-gradient(302deg, rgba(114, 237, 242, 0.40) -1.88%, rgba(81, 140, 229, 0.40) 73.3%, rgba(81, 96, 229, 0.40) 96.18%)'}`}
      />
    </div>
  )
}

export default ServiceProductsPanel
