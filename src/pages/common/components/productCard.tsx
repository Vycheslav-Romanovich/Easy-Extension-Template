import React from 'react'
import Ios from '../../../assets/icons/products/iOS.svg'
import Android from '../../../assets/icons/products/android.svg'

type PropsType = {
  iosLink?: string
  androidLink?: string
  imageQr: any
  description: string
  bg: string
  isDark: boolean
  isPopUp?:boolean
}

const ProductCard: React.FC<PropsType> = ({ iosLink, androidLink, imageQr, description, bg, isDark, isPopUp }) => {
  return (
    <div style={{ background: bg }} className="flex items-center justify-center w-[370px] rounded-[8px]">
      <div className='flex flex-row gap-[16px] items-center p-[21px]'>
        <div className='flex'>
            <div className='flex flex-col gap-[14px]'>
              <p className={`text-[14px] ${isDark ? isPopUp ? 'text-gray-800' : 'text-white' : 'text-gray-800'} font-medium leading-[21px]`}>{description}</p>
              <div className='flex flex-row gap-[14px]'>
                {androidLink && <Android className='cursor-pointer' onClick={()=>{window.open(androidLink,'_blank')}} />}
                {iosLink && <Ios className='cursor-pointer' onClick={()=>{window.open(iosLink,'_blank')}} />}
              </div>
            </div>
        </div>
        <div className='flex items-center justify-center'>
          {imageQr}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
