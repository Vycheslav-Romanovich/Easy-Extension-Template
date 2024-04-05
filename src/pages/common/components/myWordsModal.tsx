import React from 'react'
import ReactModal from 'react-modal'
import { OnClickHandler } from '../../../constants/types'
import OvalMenuBottom from '../../../assets/icons/menu/ovalMenuBottom.svg'
import Cross from '../../../assets/images/settings/blackCross.svg'
import Cat from '../../../assets/images/settings/cat.svg'
import ELang from '../../../assets/images/settings/eLangLogoWhite.svg'
import { useTranslation } from '../../../locales/localisation'
import PlayMarketBadge from '../../../assets/images/badge/playMarketBadge.svg'
import Mobile from '../../../assets/images/myWordsModal/simulatorModal.svg'
import MobileEn from '../../../assets/images/myWordsModal/simulatorModalEn.svg'
import AppStoreBadge from '../../../assets/images/badge/appStoreBadge.svg'
import QRCode from '../../../assets/images/qrCodes/qr_to_train_vocabulary.svg'
import { getService } from '../../../utils/url'
import { setGamePopupShowed } from '../store/settingsActions'
import { useDispatch } from 'react-redux'
import { useLanguageContext } from '../../../context/LanguageContext'

type PropsType = {
  isOpen: boolean
  onCancel?: OnClickHandler
}

const MyWordsModal: React.FC<PropsType> = ({
  isOpen,
  onCancel,
}) => {
  const { locale } = useLanguageContext();
  const checkLanguageRu = locale === 'ru';
  const strings = useTranslation()
  const myWordsModal = strings.popup.myWordsModal
  const dispatch = useDispatch()
  const service = getService()

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(95, 99, 104, 0.3)',
      zIndex: 9999,
    },
    content: {
      overflow: 'hidden',
      border: 'none',
      backgroundColor: '#FFFFFF',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      padding: '0',
      transform: 'translate(-50%, -50%)',
      width: '620px',
      height: '400px',
    },
  };

  const handleClickPlayMarket = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    chrome.runtime.sendMessage({ component: "newTab", url: 'https://play.google.com/store/apps/details?id=com.englishingames.easy5' });
    onCancel && onCancel(event)
  }

  const handleClickAppStore = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    chrome.runtime.sendMessage({ component: "newTab", url: 'https://apps.apple.com/by/app/elang-words-train-vocabulary/id1622786750' });
    onCancel && onCancel(event)
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      style={customStyles}
      ariaHideApp={false}
      id="elangExtension"
    >

      <div className="font-inter w-[620px] h-[400px] absolute bg-white shadow-qrcode rounded-md positionCenter z-[9999]">
        <div className="flex h-full">
          <div className="w-[50%] bg-gradient-to-r from-[#4F6EFD] to-[#81BBFF]">
            <div className="flex items-center ml-[12px] my-[12px]">
              <Cat className="mr-[12px]" alt="Cat" />
              <ELang alt="eLangLogo" />
            </div>
            {checkLanguageRu ? (
              <Mobile alt="Mobile" />
            ) : (
              <MobileEn alt="Mobile" />
            )}
          </div>

          <div style={{paddingLeft: '26px', paddingRight: '13px'}} className="w-[50%]">
            <OvalMenuBottom
              className="absolute bottom-0 right-0 z-1"
              alt="SimulatorBottom"
            />
            <div
              className="flex mt-[12px] justify-end	 cursor-pointer"
              onClick={(e) => {
                onCancel && onCancel(e);
                dispatch(setGamePopupShowed(''));
              }}
            >
              <Cross alt="Cross" />
            </div>
            <div className="w-[135px] h-[135px] shadow-qrcode mt-[10px] flex justify-start items-center">
              <QRCode />
            </div>
            <ul
              style={{fontSize: '14px', lineHeight: '20px', listStyle: 'none', padding: 0}}
              className={`flex flex-col font-normal text-sm mt-[16px] text-left`}
            >
              <li style={{fontWeight: 700, fontSize: '16px'}} className="text-blue-400 text-left leading-6">
                {myWordsModal.title}
              </li>
              <li style={{color: '#333333'}} className="mt-[14px]">{myWordsModal.itemList.firstStep}</li>
              <li style={{color: '#333333'}} className="text-left">{myWordsModal.itemList.secondStep}</li>
              <li style={{color: '#333333'}}>
                {myWordsModal.itemList.third.textStart}
                <b className="text-gray-90"> {myWordsModal.itemList.third.boldText}</b>
                <span className="text-gray-90"> {myWordsModal.itemList.third.textEnd}</span>
              </li>
            </ul>
            <div className="flex my-[24px]">
              <div className='cursor-pointer' onClick={(e) => handleClickPlayMarket(e)}>
                <PlayMarketBadge />
              </div>
              <div className='cursor-pointer ml-16px z-20' onClick={(e) => handleClickAppStore(e)}>
                <AppStoreBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}

export default MyWordsModal
