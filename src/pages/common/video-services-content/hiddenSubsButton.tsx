import React, { useState } from 'react'
import { useTranslation } from '../../../locales/localisation'
import { setSubsShowOnYt } from '../store/settingsActions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'

type PropsType = {
  goToSubtitles: () => void;
}

const HiddenSubsButton: React.FC<PropsType> = ({ goToSubtitles }) => {
  const dispatch = useDispatch()
  const strings = useTranslation()
  const { subtitleHidden } = strings.youtubeVocSubs.subtitles

  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)

  const [isHover, setIsHover] = useState<boolean>(false)

  const showYtSubtitles = () => {
    dispatch(setSubsShowOnYt(true))
    goToSubtitles();
  }

  return (
    <div
      id="elangHiddenSubsButton"
      onClick={showYtSubtitles}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`${
        !isDarkModeInYoutube && 'bg-gray-100'
      } border font-inter border-solid border-gray-950 flex justify-between items-center cursor-pointer rounded-8 !h-[41px] !mb-[12px]`}
    >
      <p
        className={`pl-20px !text-[14px] ${
          isHover ? `${isDarkModeInYoutube ? 'text-blue-300' : 'text-blue-400'}` : `${isDarkModeInYoutube ? 'text-white' : 'text-gray-600'}`
        }`}
      >
        {subtitleHidden}
      </p>
      <div className="pr-20px">
        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="8.48535"
            y1="16.0711"
            x2="15.5564"
            y2="9.00007"
            stroke={isHover ? `${isDarkModeInYoutube ? '#738BFB' : '#4F6EFD'}` : `${isDarkModeInYoutube ? '#fff' : '#5F6368'}`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="8.4852"
            y1="16.0713"
            x2="1.41413"
            y2="9.00022"
            stroke={isHover ? `${isDarkModeInYoutube ? '#738BFB' : '#4F6EFD'}` : `${isDarkModeInYoutube ? '#fff' : '#5F6368'}`}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default HiddenSubsButton
