import React from 'react'
import { RootState } from '../../../background/store/reducers'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSubtitleFontSizeOnYt,
  setSubtitleFontSizeOnNetflix,
  setSubtitleFontSizeOnCoursera
} from '../../../common/store/settingsActions'
import { getService } from '../../../../utils/url'
import { setCheckListDate } from '../../../background/helpers/checkListSetUp'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

type PropType = {
  settings?: string
}

const FontSizeSelector: React.FC<PropType> = ({ settings }) => {
  const dispatch = useDispatch()
  const service = getService()
  const subtitleFontSizeOnYt = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnYt)
  const subtitleFontSizeOnNetflix = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnNetflix)
  const subtitleFontSizeOnCoursera = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnCoursera)

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const increaseFontHandler = () => {
    setCheckListDate('size')
    if (isYoutube && subtitleFontSizeOnYt < 46) {
      dispatch(setSubtitleFontSizeOnYt(subtitleFontSizeOnYt + 2))
    }
    if (isNetflix && subtitleFontSizeOnNetflix < 46) {
      dispatch(setSubtitleFontSizeOnNetflix(subtitleFontSizeOnNetflix + 2))
    }
    if (isCoursera && subtitleFontSizeOnCoursera < 46) {
      dispatch(setSubtitleFontSizeOnCoursera(subtitleFontSizeOnCoursera + 2))
    }
    sendAmplitudeEvent('subs_size_change', { action: 'bigger' })
  }
  const decreaseFontHandler = () => {
    setCheckListDate('size')
    if (isYoutube && subtitleFontSizeOnYt > 12) {
      dispatch(setSubtitleFontSizeOnYt(subtitleFontSizeOnYt - 2))
    }
    if (isNetflix && subtitleFontSizeOnNetflix > 12) {
      dispatch(setSubtitleFontSizeOnNetflix(subtitleFontSizeOnNetflix - 2))
    }
    if (isCoursera && subtitleFontSizeOnCoursera > 12) {
      dispatch(setSubtitleFontSizeOnCoursera(subtitleFontSizeOnCoursera - 2))
    }
    sendAmplitudeEvent('subs_size_change', { action: 'smaller' })
  }
  const buttonStyle = {
    width: 24,
    height: 20,
    marginLeft: 4,
  }

  const notSelectedClassName =
    settings === 'youtube'
      ? 'flex justify-center items-center text-gray-100 dark:text-white cursor-pointer bg-gray-330 rounded hover:bg-gray-325 active:bg-gray-330 ring-blue-400 ring-inset'
      : `dark:text-white text-gray-100 cursor-pointer bg-gray-330 rounded hover:bg-gray-325 active:bg-gray-330 ring-blue-400 ring-inset`

  return (
    <div className="flex justify-between items-center select-none">
      <div className={notSelectedClassName} style={buttonStyle} onClick={decreaseFontHandler}>
        <span style={{ fontSize: 10 }}>A-</span>
      </div>
      <div className={notSelectedClassName} style={buttonStyle} onClick={increaseFontHandler}>
        <span style={{ fontSize: 14 }}>A+</span>
      </div>
    </div>
  )
}

export default FontSizeSelector
