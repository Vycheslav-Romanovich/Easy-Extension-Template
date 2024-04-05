import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useStore } from 'effector-react'
import { Tooltip } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'

import { getService } from '../../../utils/url'
import { subsStore } from '../store'
import useStyles from '../../common/styles/tooltipSyle'
import { RootState } from '../../background/store/reducers'
import {
  setAlwaysShowTranslationOnYt,
  setAlwaysShowTranslationOnNetflix,
  setAlwaysShowTranslationOnCoursera,
} from '../../common/store/settingsActions'

import Toggle from '../../common/components/toggle/toggle'

import TranslationIcon from '../../../assets/icons/toggle/translationIcon.svg'
import { useTranslation } from '../../../locales/localisation'
import { setCheckListDate } from '../../background/helpers/checkListSetUp'

import firebase from 'firebase/auth'

type PropType = {
  isNetflixDouble?: boolean
  handleClickForTooltipNoSubs?: any
}

const ShowTranslationToggle: React.FC<PropType> = ({ isNetflixDouble, handleClickForTooltipNoSubs }) => {
  const dispatch = useDispatch()
  const subs = useStore(subsStore)
  const classes = useStyles()
  const service = getService()
  const strings = useTranslation()
  const tooltip = strings.tooltip.youtube

  const alwaysShowTranslationOnYt = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const alwaysShowTranslationOnNetflix = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const alwaysShowTranslationOnCoursera = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const isNetflixVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isNetflixVideoHasFocus)
  const isCourseraVideoHasFocus = useSelector<RootState, boolean>((state) => state.settings.isCourseraVideoHasFocus)
  const isFocusOnYt = useSelector<RootState, boolean>((state) => state.settings.isYtVideoHasFocus)
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  // eslint-disable-next-line
  const handleClick = (event: any, eventKeyboard?: boolean) => {
    event.preventDefault()
    if (isNetflix) {
      dispatch(setAlwaysShowTranslationOnNetflix(!alwaysShowTranslationOnNetflix))
      if (!alwaysShowTranslationOnNetflix) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle(`On with R, ${getService()}`) : sendAnalyticsToTranslateToogle(`On, ${getService()}`)
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle(`Off with R, ${getService()}`)
          : sendAnalyticsToTranslateToogle(`Off, ${getService()}`)
      }
    }
    if (isYoutube) {
      if (!alwaysShowTranslationOnYt) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle(`On with R, ${getService()}`) : sendAnalyticsToTranslateToogle(`On, ${getService()}`)
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle(`Off with R, ${getService()}`)
          : sendAnalyticsToTranslateToogle(`Off, ${getService()}`)
      }
      if (subs.text) {
        dispatch(setAlwaysShowTranslationOnYt(!alwaysShowTranslationOnYt))
      } else {
        handleClickForTooltipNoSubs()
      }
    }

    if (isCoursera) {
      dispatch(setAlwaysShowTranslationOnCoursera(!alwaysShowTranslationOnCoursera))
      if (!alwaysShowTranslationOnCoursera) {
        setCheckListDate('subs')
        eventKeyboard ? sendAnalyticsToTranslateToogle(`On with R, ${getService()}`) : sendAnalyticsToTranslateToogle(`On, ${getService()}`)
      } else {
        eventKeyboard
          ? sendAnalyticsToTranslateToogle(`Off with R, ${getService()}`)
          : sendAnalyticsToTranslateToogle(`Off, ${getService()}`)
      }
    }
  }

  const sendAnalyticsToTranslateToogle = (label: string): void => {
    const event = {
      category: 'Settings',
      action: 'LDoubleSubs',
      label,
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  useEffect(() => {
    if (subs && subs.text) {
      const eventHandlerKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'KeyR' && !event.metaKey) {
          handleClick(event, true)
        }
      }

      document.addEventListener('keydown', eventHandlerKeyDown, true)

      return () => {
        document.removeEventListener('keydown', eventHandlerKeyDown, true)
      }
    }
  }, [subs, subs.text, alwaysShowTranslationOnYt, alwaysShowTranslationOnCoursera, alwaysShowTranslationOnNetflix])

  return (
    <div className="elang_ translation_toggle h-full font-inter flex justify-center items-center mr-2">
      {(isYoutube && !isFocusOnYt) || (isNetflix && !isNetflixVideoHasFocus) || (isCoursera && !isCourseraVideoHasFocus) ? null : (
        <Tooltip
          title={
            (isYoutube && alwaysShowTranslationOnYt) ||
            (isNetflix && alwaysShowTranslationOnNetflix) ||
            (isCoursera && alwaysShowTranslationOnCoursera)
              ? tooltip.offDoubleSubtitles
              : tooltip.onDoubleSubtitles
          }
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="top"
          interactive={!user}
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
          style={{ transform: isNetflix ? 'scale(1.5, 1.5)' : undefined }}
        >
          <div>
            <Toggle
              dotClassNameOn="bg-blue-350 justify-end"
              dotClassNameOff="bg-white"
              classNameOn="bg-gray-250 opacity-70"
              classNameOff="bg-gray-250 opacity-70"
              textClassNameOn="text-8px text-white"
              textClassNameOff="text-8px text-gray-670"
              onClick={handleClick}
              imageOnDot={<TranslationIcon />}
              value={
                isNetflix
                  ? alwaysShowTranslationOnNetflix
                  : isYoutube
                  ? alwaysShowTranslationOnYt
                  : isCoursera
                  ? alwaysShowTranslationOnCoursera
                  : false
              }
              isNetflixDouble={isNetflixDouble}
            />
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default React.memo(ShowTranslationToggle)
