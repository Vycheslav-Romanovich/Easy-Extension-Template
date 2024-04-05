import React, { useState, useEffect } from 'react'
import { RootState } from '../../background/store/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { getService } from '../../../utils/url'
import {
  setSettingsYouTubeShown,
  setOffExtension,
  setSubsShowOnNetflix,
  setSubsShowOnYt,
  setPositionOnBoarding,
  setSubsShowOnCoursera,
} from '../../common/store/settingsActions'

import Warning from '../../../assets/icons/youtube/warning.svg'
import TriangleIcon from '../../../assets/icons/settings/triangleBot.svg'
import PlayerLogoOn from '../../../assets/icons/extensionToggle/playerLogoOn.svg'
import Setting from '../../../assets/icons/setting.svg'
import PlayerLogoOff from '../../../assets/icons/extensionToggle/playerLogoOff.svg'
import { useTranslation } from '../../../locales/localisation'

import OnBoarding from '../../common/components/onBoarding/onBoarding'
import Toggle from '../../common/components/toggle/toggle'

import { Tooltip } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import useStyles from '../../common/styles/tooltipSyle'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

const ExtensionToggle: React.FC<{
  styles?: any
  showTooltipNoSubs?: boolean
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
}> = ({ styles, showTooltipNoSubs, isFullscreenModeOnYt, isWidescreenModeYt }) => {
  const dispatch = useDispatch()
  const service = getService()
  const strings = useTranslation()
  const extensionOff = useSelector<RootState, boolean>((state) => state.settings.offExtension)
  const settingsShown = useSelector<RootState, boolean>((state) => state.settings.settingsYouTubeShown)
  const subsShowOnNetflix = useSelector<RootState, boolean>((state) => state.settings.subsShowOnNetflix)
  const subsShowOnCoursera = useSelector<RootState, boolean>((state) => state.settings.subsShowOnCoursera)
  const subsShowOnYt = useSelector<RootState, boolean>((state) => state.settings.subsShowOnYt)
  const position = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)
  const langErrors = useSelector<RootState, boolean>((state) => state.settings.langErrors)

  const [openedSubPanelHelper, setOpenedSubPanelHelper] = useState<boolean>(false)
  const [openedSubPanelClickHelper, setOpenedSubPanelClickHelper] = useState<boolean>(false)
  const [isHover, setIsHover] = useState<boolean>(false)

  const { isFullScreen } = useFullScreenContex()

  const { subtitles } = strings.youtubeVocSubs
  const { youtube } = strings.tooltip

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const classes = useStyles()
  const handleClick = () => {
    if (position === 4) {
      dispatch(setPositionOnBoarding(0))
      localStorage.setItem('watchingOnBoarding', 'true')
      if (isYoutube) {
        document.querySelectorAll('.onBoardingDisable').forEach((domElement) => domElement.remove());

        const relatedElement = document.querySelector('#related');
        const elangExtension = document.querySelector('#elangExtension.elang_youtube_window_wrapper');
        const below = document.querySelector('#below');

        relatedElement && relatedElement.removeAttribute('style');
        elangExtension && elangExtension.removeAttribute('style');
        below && below.removeAttribute('style');
      }
    }
    if (!settingsShown) {
      sendAmplitudeEvent('subs_settings_open', { way: 'mouse' })
    }

    if (isNetflix) {
      dispatch(setSubsShowOnNetflix(false))
      if (subsShowOnNetflix) {
        setOpenedSubPanelClickHelper(true)
      } else {
        setOpenedSubPanelClickHelper(false)
      }
    }
    if (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) {
      dispatch(setSubsShowOnYt(false))
      if (subsShowOnYt) {
        setOpenedSubPanelClickHelper(true)
      } else {
        setOpenedSubPanelClickHelper(false)
      }
    }

    if (isCoursera && isFullScreen) {
      dispatch(setSubsShowOnCoursera(false))
      if (subsShowOnCoursera) {
        setOpenedSubPanelClickHelper(true)
      } else {
        setOpenedSubPanelClickHelper(false)
      }
    }
    dispatch(setSettingsYouTubeShown(!settingsShown))
  }

  const turnOffExtension = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    if (extensionOff) {
      sendAmplitudeEvent('extension_toggle', { action: 'off', location: 'player' })
    } else {
      sendAmplitudeEvent('extension_toggle', { action: 'on', location: 'player' })
    }
    dispatch(setOffExtension(!extensionOff))
    chrome.storage.sync.set({ offExtension: !extensionOff })
  }

  // все эффекты ниже для закрытия настроек или панелей субтитра
  useEffect(() => {
    if (settingsShown && openedSubPanelClickHelper) {
      setOpenedSubPanelHelper(true)
    }
  }, [settingsShown, openedSubPanelClickHelper])

  useEffect(() => {
    if (!settingsShown && openedSubPanelHelper) {
      isYoutube && dispatch(setSubsShowOnYt(true))
      isNetflix && dispatch(setSubsShowOnNetflix(true))
      isCoursera && dispatch(setSubsShowOnCoursera(true))
    }
  }, [settingsShown, openedSubPanelHelper])

  useEffect(() => {
    subsShowOnYt && isYoutube && setOpenedSubPanelHelper(false)
    subsShowOnNetflix && isNetflix && setOpenedSubPanelHelper(false)
    subsShowOnCoursera && isCoursera && setOpenedSubPanelHelper(false)
  }, [subsShowOnYt, subsShowOnNetflix, subsShowOnCoursera])

  return (
    <div id="eLangSettingsButton" className="elang_toggle_extension font-inter h-full flex justify-center items-center relative">
      {isYoutube && showTooltipNoSubs ? (
        <div className="flex flex-col items-center !absolute !top-[-100%]">
          <div className="rounded-md bg-gray-600 font-sans text-white text-center flex items-center !h-[40px] !text-[14px] !leading-[20px] !whitespace-nowrap px-[10px] py-0">
            <span>{subtitles.empty}</span>
          </div>

          <TriangleIcon />
        </div>
      ) : null}
      {position === 4 && (
        <div
          className="fixed z-[100] bg-gray-290 inset-0"
          onClick={(e) => {
            e.stopPropagation()
          }}
        />
      )}
      {position === 4 && <OnBoarding />}

      <div
        className={`flex ${isNetflix && '!scale-[1.3, 1.3] !mb-[7px]'} ${
          isCoursera ? 'py-0 items-center !scale-[0.9]' : 'py-[3px]'
        } px-[5px] border-[2px] border-solid border-white rounded-[100px]`}
      >
        <Tooltip
          title={<div style={{ display: 'flex', alignItems: 'center' }}>{youtube.settings}</div>}
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="top"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <button
            style={{
              zIndex: 110,
              background: 'transparent',
              padding: 0,
              outline: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              height: '20px',
              marginRight: '9px',
              width: '20px',
            }}
            onClick={handleClick}
          >
            {langErrors ? (
              <div style={{ zIndex: 120 }} className={`absolute -right-[5px] -top-[5px]`}>
                <Warning />
              </div>
            ) : (
              <Setting className="absolute bottom-[11px] left-[12px]" />
            )}

            <div
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              className={`fill-current ${isHover ? 'text-blue-800' : 'text-blue-400'}`}
            >
              {extensionOff ? <PlayerLogoOn /> : <PlayerLogoOff />}
            </div>
          </button>
        </Tooltip>
        <Tooltip
          title={<div style={{ display: 'flex', alignItems: 'center' }}>{youtube.switcher}</div>}
          arrow
          TransitionComponent={Fade}
          enterDelay={500}
          placement="top"
          classes={{ tooltip: classes.tooltip, arrow: classes.arrow }}
        >
          <div>
            <Toggle
              value={extensionOff}
              onClick={(e) => {
                turnOffExtension(e)
              }}
              playerMainBtn
            />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default React.memo(ExtensionToggle)
