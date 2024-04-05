import React, { useEffect } from 'react'
import './loader.css'

import { useState } from 'react'
import { getService } from '../../../../utils/url'

import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { WayToOpenTextTranslation } from '../../../../constants/types'

const Loader: React.FC<{ position: boolean | undefined; checkedPhrase: string; isDarkMode: boolean, domRectWidth: number | undefined }> = ({
  position,
  checkedPhrase,
  isDarkMode,
  domRectWidth
}) => {
  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'
  const isCoursera = getService() === 'coursera'

  const wayToOpenTextTranslation = useSelector<RootState, WayToOpenTextTranslation>((state) => state.settings.wayToOpenTextTranslation)

  const [loaderStyle, setLoaderStyle] = useState<any>(null)
  const [isIconTranslate, setIsIconTranslate] = useState<boolean>(wayToOpenTextTranslation === 'withButton' && !isYoutube && !isNetflix && !isCoursera)

  const wordLoadingStyle = {
    position: 'absolute',
    top: position ? isIconTranslate ? 68 : 34 : -60,
    left: isIconTranslate ? -66 - (domRectWidth ? domRectWidth / 2 : 0) : -66,
  }
  const phraseLoadingStyle = {
    position: 'absolute',
    top: position ? isIconTranslate ? 68 : 34 : -60,
    left: isIconTranslate ? -66 - (domRectWidth ? domRectWidth / 2 : 0) : -66,
  }

  useEffect(() => {
    if (checkedPhrase) {
      setLoaderStyle(phraseLoadingStyle)
    } else {
      setLoaderStyle(wordLoadingStyle)
    }
  }, [checkedPhrase])

  return (
    <div id="#eLangLoading" className={`eLang-loader-container ${isDarkMode ? 'eLang-loader-container-dark' : ''}`} style={loaderStyle}>
      <div className={`${isDarkMode ? 'eLang-loader-dark' : 'eLang-loader'}`}></div>
    </div>
  )
}

export default Loader
