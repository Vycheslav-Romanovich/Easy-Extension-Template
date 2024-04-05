import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'

import Checkmark from '../../../assets/icons/check-mark.svg'

type PropsType = {
  title: string
  textFree: string 
  features: string[]
  highLightMark: boolean
}

const ListFeatureOfExtension: React.FC<PropsType> = ({ title,textFree, features, highLightMark }) => {
  const offExtension = useSelector<RootState, boolean>((state) => state.settings.offExtension)

  return (
    <div className={`font-sans text-sm mt-[16px] ${offExtension ? 'text-gray-600' : 'text-gray-300'}`}>
      <div className="flex flex-row items-center">
        <p className="text-lg font-semibold mr-[8px]">{title}</p>
        <p className="text-[10px] font-normal">{textFree}</p>
      </div>
      <ul>
        {features.map((el, i) => (
          <li className="flex flex-row mt-2" key={i}>
            <div className={`${highLightMark ? 'text-blue-400' : 'text-gray-825'} mt-1`}>
              <Checkmark />
            </div>

            <span className="ml-10px">{el}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListFeatureOfExtension
