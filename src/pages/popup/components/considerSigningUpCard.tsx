import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { setOffExtension } from '../../common/store/settingsActions'

import { useTranslation } from '../../../locales/localisation'
import Toggle from '../../common/components/toggle/toggle'
import ListFeatureOfExtension from '../../common/components/listFeatureOfExtension'

import Logo from '../../../assets/icons/considerSigningUpCard/logo.svg'
import Catoff from '../../../assets/icons/menu/catOff.svg'
import CatOffBg1 from '../../../assets/icons/menu/catOffBg1.svg'
import CatOffBg2 from '../../../assets/icons/menu/catOffBg2.svg'
import Button from '../../common/components/button'
import { Link } from '../../options/router'
import ProgressCard from './progress/progressCard'
import { useLanguageContext } from '../../../context/LanguageContext'
import { getLinkToWebsite } from '../../background/helpers/websiteLink'
import { ComeBack } from './comeBack'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

const ConsiderSigningUpCard: React.FC = () => {
  const dispatch = useDispatch()
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)

  const [isProgressShow, setIsProgressShow] = useState<boolean>(false)

  const strings = useTranslation()
  const { locale } = useLanguageContext()

  const considerSigningUpCard = strings.popup.considerSigningUpCard

  return (
    <>
      <div className="flex flex-col relative bg-gray-100">
        {/* <CatOffBg1 className="absolute bottom-0 right-[-50px]" />
        <CatOffBg2 className="absolute bottom-0 right-[-120px]" /> */}

        <div className="flex flex-row items-center justify-between border-b border-gray-960 px-7 py-4">
          <div className="flex items-center">
            <Logo />
            <div className={`text-blue-400 ml-3 text-2xl font-bold`}>
              {considerSigningUpCard.companyName}
            </div>
          </div>

          <div>
            <Toggle
              size='lg'
              value={offExtension}
              classNameOn="bg-blue-400"
              textClassNameOn="text-blue-400"
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
            />
          </div>
        </div>

        {isProgressShow && offExtension && (
        <>
        <div className='max-h-[434px] scrollbar overflow-y-scroll scrollbar-width-popup scrollbar-track-radius-full scrollbar-thumb-blue-400 scrollbar-track-gray-100'>
        <ComeBack notRegistration onClickHandler={() => setIsProgressShow(false)} />
        <ProgressCard isProgressShow={isProgressShow} setIsProgressShow={setIsProgressShow} />
        </div>
        </>
        )}

        {offExtension && !isProgressShow && (
          <>
            <div className='px-[26px]'>
              <ListFeatureOfExtension
                title={strings.popup.menu.soonFeatures.title}
                textFree={strings.popup.menu.soonFeatures.textFree}
                features={strings.popup.menu.soonFeatures.features}
                highLightMark={true}
              />
              <div className="mt-5 mb-3 ml-[50px] flex relative">
                <Button
                  onClick={() => getLinkToWebsite(locale, 'signup')}
                  type="primary"
                  text={considerSigningUpCard.button}
                  className="!w-204 mr-[20px]"
                />
                <Link
                  onClick={() => getLinkToWebsite(locale, 'signin')}
                  className="hover:underline text-blue-400 cursor-pointer text-[14px] dark:text-blue-400 self-center font-bold"
                >
                  {considerSigningUpCard.button1}
                </Link>
              </div>
            </div>
            <ProgressCard isProgressShow={isProgressShow} setIsProgressShow={setIsProgressShow}/>
          </>
        )}
      </div>

      {!offExtension &&(
        <div className='max-h-[434px] scrollbar overflow-y-scroll scrollbar-width-popup scrollbar-track-radius-full scrollbar-thumb-blue-400 scrollbar-track-gray-100'>
        <div className="flex justify-center py-[10px] bg-white">
          <CatOffBg1 className="z-[1] absolute bottom-0 left-[40px]" />
          <CatOffBg2 className="z-[1] absolute bottom-0 right-[40px]" />
          <Catoff className="z-10"/>
        </div>
      </div>
      )}
    </>
  )
}

export default ConsiderSigningUpCard
