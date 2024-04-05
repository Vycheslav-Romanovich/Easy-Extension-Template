import React from 'react'
import { Link } from '../../options/router'
import { useTranslation } from '../../../locales/localisation'
import TriangleIcon from '../../../assets/icons/settings/triangleBot.svg'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { useLanguageContext } from '../../../context/LanguageContext'
import firebase from 'firebase'
import { getLinkToWebsite } from '../../background/helpers/websiteLink'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

  type PropsType = {
    tooltipMessage: 'account' | 'premium',
    isHighlightTooltip?: boolean
  }

  const PopupTooltip: React.FC<PropsType> = ({ tooltipMessage, isHighlightTooltip }) => {
    const strings = useTranslation()
    const { locale } = useLanguageContext()
    const { userNotLogin, updateToPremium } = strings.tooltip
    const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

    const goToPremiumPage = () => {
      user ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
      user && sendAmplitudeEvent('go_to_Premium', { location: 'words_highlighting' })
    }

    return (
      <div 

          className={`flex flex-col items-center absolute`} 
          style={locale === 'en' ?
            isHighlightTooltip ? { right:0, top: -33 } : {width: 200, left: 'calc(50% - 100px)', top: -43} 
            : 
            isHighlightTooltip ? { right:0, top: -33 } : { width: 352, left: 'calc(50% - 176px)', top: -43}
          }>
        <div className="text-center text-white bg-gray-600 shadow-popup" style={{ fontSize: 12, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', paddingTop: 6, paddingBottom: 6, paddingLeft: 16, paddingRight: 16, borderRadius: 2 }}>
          {tooltipMessage === 'account' 
            && 
            <>
              <Link
                className={`text-blue-350 dark:text-blue-300 cursor-pointer ml-1`}
                style={{ color: '#637CF2', textDecoration: 'none', fontSize: 12 }}
                onClick={() => {
                  getLinkToWebsite(locale, 'signin')
                }}
              >
                {userNotLogin.textPart1}
              </Link>
              &nbsp;
              {userNotLogin.textPart2}
              &nbsp;
              <Link
                className={`text-blue-400 dark:text-blue-300 cursor-pointer ml-1 no-underline`}
                style={{ color: '#637CF2', textDecoration: 'none', fontSize: 12 }}
                onClick={() => getLinkToWebsite(locale, 'signup')}
              >
                {userNotLogin.textPart3}
              </Link>
            </>
          }
          {tooltipMessage === 'premium' 
            && 
            <>
              <Link
                className={`text-blue-400 dark:text-blue-300 cursor-pointer ml-1 no-underline`}
                style={{ color: '#637CF2', textDecoration: 'none', fontSize: 12 }}
                onClick={goToPremiumPage}
              >
                {updateToPremium.premiumLink}
              </Link>
            </>
          }
          &nbsp;
          {userNotLogin.textPart4}
        </div>
        <TriangleIcon className={`${isHighlightTooltip && 'self-end'}`} style={ isHighlightTooltip ? {marginRight: 24} : {}}/>
     </div>
    )
  }
  
  export default PopupTooltip