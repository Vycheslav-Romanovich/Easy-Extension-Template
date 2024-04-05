import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { setOffExtension, setOpenPractise } from '../../common/store/settingsActions'
import { getLinkToWebsite } from '../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../context/LanguageContext'

import { useTranslation } from '../../../locales/localisation'

import Toggle from '../../common/components/toggle/toggle'
import Logo from '../../../assets/icons/considerSigningUpCard/logo.svg'
import Catoff from '../../../assets/icons/menu/catOff.svg'
import CatOffBg1 from '../../../assets/icons/menu/catOffBg1.svg'
import CatOffBg2 from '../../../assets/icons/menu/catOffBg2.svg'

import { Navigation } from './navigation'
import { Account } from './account'
import { Vocabulary } from './vocabulary'
import { Practice } from './practice'
import { Premium } from './premium'
import { Products } from './products'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import { ActiveServiceTab } from '../../../constants/types'
import { setActiveServiceTab } from '../../common/store/videoActions'
import { clearWordsToPractice } from '../../common/store/vocabularyActions'

export type ActiveNavigation = 'Account' | 'Vocabulary' | 'Practice' | 'Premium' | 'Products'

const Menu: React.FC = () => {
  const { locale } = useLanguageContext()
  const dispatch = useDispatch()

  const strings = useTranslation()
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const isPracticeActiveFromState = useSelector<RootState, ActiveServiceTab>((state) => state.video.activeTab)

  const [isGameLinkShow, setIsGameLinkShow] = useState<boolean>(false)
  const [active, setActive] = useState<ActiveNavigation>('Vocabulary')
  const [isPracticeActive, setIsPracticeActive] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.sync.get(['closeGameLink'], (result) => {
      if (Object.keys(result).length) {
        setIsGameLinkShow(true)
      }
    })
  }, [])

  useEffect(() => {
    dispatch(setOpenPractise(true))
    dispatch(clearWordsToPractice())//clearWordsPractice
  }, [])

  useEffect(() => {
    if (active === 'Vocabulary') {
      dispatch(setActiveServiceTab('vocabulary'))
      sendAmplitudeEvent('vocabulary_open', { location: 'main' })
    }

    if (active === 'Products') {
      sendAmplitudeEvent('products_open', { location: 'main' })
    }
    dispatch(clearWordsToPractice())//clearWordsPractice
  }, [active])

  useEffect(() => {
    if (isPracticeActiveFromState === 'practise') {
      setActive('Practice')
    }
    if (isPracticeActiveFromState === 'premium') {
      setActive('Premium')
    }
  }, [isPracticeActiveFromState])

  return (
    <div className='flex flex-col max-h-[600px] w-[402px] bg-gray-100'>
      <div className='flex justify-between align-center dark:bg-gray-500 px-7 py-4 border-b-[1px] border-gray-960'>
        <div className='flex items-center'>
          <Logo />
          <div
            className='text-blue-400 dark:text-blue-400 ml-3 mr-5 font-bold text-3xl 2-3xl:text-4xl 2-3xl:mb-10 dark:bg-gray-500'>
            {strings.popup.considerSigningUpCard.companyName}
          </div>
        </div>
        <Toggle
          value={offExtension}
          classNameOn='bg-blue-400'
          textClassNameOn='text-blue-400'
          onClick={(e) => {
            e.preventDefault()
            if (offExtension) {
              sendAmplitudeEvent('extension_toggle', { action: 'off', location: 'main' })
            } else {
              sendAmplitudeEvent('extension_toggle', { action: 'on', location: 'main' })
            }
            dispatch(setOffExtension(!offExtension))
            chrome.storage.sync.set({ offExtension: !offExtension })
          }}
          size='lg'
        />
      </div>
   

      {offExtension && <>
        <div className={` scrollbar overflow-y-scroll scrollbar-width-popup scrollbar-track-radius-full scrollbar-thumb-blue-400 scrollbar-track-gray-100`}>
          {active === 'Account' && <Account />}
          {active === 'Vocabulary' && <Vocabulary />}
          {active === 'Products' && <Products />}
          {active === 'Premium' && <Premium />}
        </div>

        {!isPracticeActive && <Navigation active={active} setActive={setActive}/>}
      </>}

      {!offExtension && (
        <div
          className='overflow-hidden relative pt-2 pb-6 flex justify-between bg-gray-100 dark:bg-gray-700 items-start select-none hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-960'>
          <CatOffBg1 className='absolute top-[-40px] right-[120px]' />
          <CatOffBg2 className='absolute top-[-40px] right-[70px]' />
          <div className='flex justify-center align-center w-full h-full z-10'>
            <Catoff className='mt-2 -m-2' />
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu
