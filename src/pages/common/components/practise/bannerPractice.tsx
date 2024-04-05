import React from 'react'
import { useTranslation } from '../../../../locales/localisation'
import { getService } from '../../../../utils/url'
import QrFinish from '../../../../assets/images/vocabulary/qrFinish.svg'

const BannerPractice: React.FC = ( ) => {
  const strings = useTranslation()
  const { game } = strings.practice
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYouTube = service === 'youtube'
  const isCoursera = service === 'coursera'


  return (
    <div className='flex flex-row items-center justify-between bg-gray-100 rounded w-[346px] h-[104px] mb-[16px]'>
      <div className='flex items-center pl-[18px] py-[8px] w-[230px] text-[14px] text-gray-400 font-normal leading-5'>
      {game.textBanner}
      </div>
      <QrFinish className='mr-[8px]'/>
    </div>
  )
}

export default BannerPractice
