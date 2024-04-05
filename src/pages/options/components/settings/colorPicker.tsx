import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { SubtitleColors } from '../../../../constants/types'
import { setSubtitleColorOnYt, setSubtitleColorOnNetflix, setSubtitleColorOnCousera } from '../../../common/store/settingsActions'
import ColoredCell from './coloredCell'
import { getService } from '../../../../utils/url'
import { setCheckListDate } from '../../../background/helpers/checkListSetUp'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

type PropType = {
  onClick?: (event: React.MouseEvent) => void
  classNameOn?: string
  settings: string
}

const ColorPicker: React.FC<PropType> = ({ settings }) => {
  const subtitleColorOnYt = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnYt)
  const subtitleColorOnNetflix = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnNetflix)
  const subtitleColorOnCoursera = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnCoursera)
  const dispatch = useDispatch()
  const service = getService()
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const handleColorChange = (color: SubtitleColors) => {
    setCheckListDate('size')

    if (color === '#FFFFFF') {
      sendAmplitudeEvent('subs_color_change', { subs_color: 'White' })
    } else if (color === '#18E0D4') {
      sendAmplitudeEvent('subs_color_change', { subs_color: 'Blue' })
    } else if (color === '#EFA30E') {
      sendAmplitudeEvent('subs_color_change', { subs_color: 'Orange' })
    } else if (color === '#faff15') {
      sendAmplitudeEvent('subs_color_change', { subs_color: 'Yellow' })
    } else if (color === '#4F6EFD') {
      sendAmplitudeEvent('subs_color_change', { subs_color: 'Pink' })
    }

    if (color !== undefined && subtitleColorOnYt !== color && isYoutube) {
      dispatch(setSubtitleColorOnYt(color))
    }
    if (color !== undefined && subtitleColorOnNetflix !== color && isNetflix) {
      dispatch(setSubtitleColorOnNetflix(color))
    }
    if (color !== undefined && subtitleColorOnCoursera !== color && isCoursera) {
      dispatch(setSubtitleColorOnCousera(color))
    }
  }

  return (
    <div className="flex justify-between items-center select-none">
      <ColoredCell
        selectedColor={
          (isYoutube && subtitleColorOnYt) || (isNetflix && subtitleColorOnNetflix) || (isCoursera && subtitleColorOnCoursera) || '#FFFFFF'
        }
        color="#FFFFFF"
        handleColorChange={handleColorChange}
        className="border border-gray-200"
        settings={settings}
      />
      <ColoredCell
        selectedColor={
          (isYoutube && subtitleColorOnYt) || (isNetflix && subtitleColorOnNetflix) || (isCoursera && subtitleColorOnCoursera) || '#FFFFFF'
        }
        color="#4F6EFD"
        handleColorChange={handleColorChange}
        settings={settings}
      />
      <ColoredCell
        selectedColor={
          (isYoutube && subtitleColorOnYt) || (isNetflix && subtitleColorOnNetflix) || (isCoursera && subtitleColorOnCoursera) || '#FFFFFF'
        }
        color="#faff15"
        handleColorChange={handleColorChange}
        settings={settings}
      />
      <ColoredCell
        selectedColor={
          (isYoutube && subtitleColorOnYt) || (isNetflix && subtitleColorOnNetflix) || (isCoursera && subtitleColorOnCoursera) || '#FFFFFF'
        }
        color="#EFA30E"
        handleColorChange={handleColorChange}
        settings={settings}
      />
      <ColoredCell
        selectedColor={
          (isYoutube && subtitleColorOnYt) || (isNetflix && subtitleColorOnNetflix) || (isCoursera && subtitleColorOnCoursera) || '#FFFFFF'
        }
        color="#18E0D4"
        handleColorChange={handleColorChange}
        settings={settings}
      />
    </div>
  )
}

export default ColorPicker
