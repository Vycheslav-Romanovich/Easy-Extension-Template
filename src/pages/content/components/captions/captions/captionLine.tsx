import React  from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { IPaymentData, PhraseVocabularyElement, SubtitleColors, WordVocabularyElement } from '../../../../../constants/types'
import { RootState } from '../../../../background/store/reducers'
import { getService } from '../../../../../utils/url'
import { useTranslation } from '../../../../../locales/localisation'
import { setCheckListDate } from '../../../../background/helpers/checkListSetUp'

import Highlight from './highlightWords'
import clsx from 'clsx'
import { useLanguageContext } from '../../../../../context/LanguageContext'
import firebase from 'firebase/auth'
import { getLinkToWebsite } from '../../../../background/helpers/websiteLink'
import { generateStringArray } from '../../../../../utils/normalizeTerm'
import { sendAmplitudeEvent } from '../../../../../utils/amplitude'
import TranslateIcon from '../../../../../assets/icons/navigation/translateSub.svg'
import {
  setAlwaysShowTranslationOnCoursera,
  setAlwaysShowTranslationOnNetflix,
  setAlwaysShowTranslationOnYt,
} from '../../../../common/store/settingsActions'
import { getLanguageName } from '../../../../../constants/supportedLanguages'

type PropsType = {
  text: Array<string>
  type: 'main' | 'translation'
  onMouseLeave?: React.MouseEventHandler
  onMouseEnter?: React.MouseEventHandler
  select?: boolean
  id?: string | undefined
}

const CaptionLine: React.FC<PropsType> = ({ text, type, onMouseEnter, onMouseLeave, select, id }) => {
  const subtitleColorOnYt = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnYt)
  const subtitleColorOnCoursera = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnCoursera)
  const subtitleColorOnNetflix = useSelector<RootState, SubtitleColors>((state) => state.settings.subtitleColorOnNetflix)
  const subtitleFontSizeOnYt = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnYt)
  const subtitleFontSizeOnNetflix = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnNetflix)
  const subtitleFontSizeOnCoursera = useSelector<RootState, number>((state) => state.settings.subtitleFontSizeOnCoursera)
  const backgroundSubOnYt = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnYt)
  const backgroundSubOnNetflix = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnNetflix)
  const backgroundSubOnCoursera = useSelector<RootState, boolean>((state) => state.settings.backgroundSubOnCoursera)
  const vocabularyPhrases = useSelector<RootState, Array<PhraseVocabularyElement>>((state) => state.vocabulary.phrases)
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const autoPauseOnHover = useSelector<RootState, boolean>((state) => state.settings.autoPauseOnHover)
  const alwaysShowTranslationOnYt = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnYt)
  const alwaysShowTranslationOnNetflix = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnNetflix)
  const alwaysShowTranslationOnCoursera = useSelector<RootState, boolean>((state) => state.settings.alwaysShowTranslationOnCoursera)
  const localLanguage = useSelector<RootState, string>((state) => state.settings.localLang)

  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)
  const freeDoubleSubs = useSelector<RootState, boolean>((state) => state.auth.freeDoubleSubs)
  const paymentData = useSelector<RootState, IPaymentData>((state) => state.auth.paymentData)

  const service = getService()
  const dispatch = useDispatch()
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const strings = useTranslation()
  const { locale } = useLanguageContext()
  const limitPart1 = strings.youtubeVocSubs.premium.limitPart1
  const limitPart1NotPremium = strings.youtubeVocSubs.notPremium.limitPart1
  const limitLink = strings.youtubeVocSubs.premium.link
  const limitLinkNotPremium = strings.youtubeVocSubs.notPremium.link
  const limitPart2 = strings.youtubeVocSubs.premium.limitPart2
  const limitPart2NotPremium = strings.youtubeVocSubs.notPremium.limitPart2

  let style = {
    color: '#EDEEF2' as SubtitleColors,
    fontSize:
      isNetflix
        ? subtitleFontSizeOnNetflix - 2
        : isYoutube
          ? subtitleFontSizeOnYt - 2
          : isCoursera
            ? subtitleFontSizeOnCoursera - 2
            : undefined,
    marginTop: '8px',
    fontWeight: 400,
  }

  if (type === 'main') {
    style = {
      color: isNetflix ? subtitleColorOnNetflix : isYoutube ? subtitleColorOnYt : isCoursera ? subtitleColorOnCoursera : '#FFFFFF',
      fontWeight: 700,
      fontSize:
        isNetflix
          ? subtitleFontSizeOnNetflix
          : isYoutube
            ? subtitleFontSizeOnYt
            : isCoursera
              ? subtitleFontSizeOnCoursera
              : undefined,
      marginTop: '0',
    } 
  }

  const className = clsx(`${type ==='main' && 'flex items-center justify-center'} text-center ${type === 'translation' && 'captionsBefore'}`)

  const getRandomIntInclusive = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const handleClickDualSubs = () => {
    const videoElement = document.querySelector('video')

    if (isNetflix) {
      dispatch(setAlwaysShowTranslationOnNetflix(!alwaysShowTranslationOnNetflix))
      if (!alwaysShowTranslationOnNetflix) {
        setCheckListDate('subs')
      }
    }

    if (isYoutube) {
      dispatch(setAlwaysShowTranslationOnYt(!alwaysShowTranslationOnYt))
      if (!alwaysShowTranslationOnYt) {
        setCheckListDate('subs')
      }
    }

    if (isCoursera) {
      dispatch(setAlwaysShowTranslationOnCoursera(!alwaysShowTranslationOnCoursera))
      if (!alwaysShowTranslationOnCoursera) {
        setCheckListDate('subs')
      } 
    }

    if (!alwaysShowTranslationOnYt || !alwaysShowTranslationOnCoursera || !alwaysShowTranslationOnNetflix) {
      isYoutube || isCoursera ? videoElement?.pause() : window.dispatchEvent(new CustomEvent('elangPauseNetflixVideo'))
    }
    else if (alwaysShowTranslationOnYt || alwaysShowTranslationOnCoursera || alwaysShowTranslationOnNetflix) {
    isYoutube || isCoursera ? videoElement?.play() : window.dispatchEvent(new CustomEvent('elangPlayNetflixVideo'))
    }

    //for analytics
    const onOff = (!alwaysShowTranslationOnYt || !alwaysShowTranslationOnCoursera || !alwaysShowTranslationOnNetflix) ? 'on' : 'off'
    sendAmplitudeEvent('translate_subs_toggle', {language: getLanguageName(localLanguage, 'en'), action: onOff})
  }

  return (
    <div style={style} className={className} id="eLangSubsWrapper">
      <span
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        onPointerMove={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
        }}
        id={id ? id : undefined}
        className={`${select ? 'select-text cursor-text' : 'select-none cursor-default'} px-[4px]`}
        style={
          (isNetflix && !backgroundSubOnNetflix) || (isYoutube && !backgroundSubOnYt) || (isCoursera && !backgroundSubOnCoursera)
            ? { textShadow: '0px 0px 2px rgba(0, 0, 0, 0.65' }
            : {}
        }
      >
        {!isPaidSubscription && !freeDoubleSubs && type === 'translation' ? (
          <span className="text-14px">
            {!paymentData?.isSubscriptionFinished ? limitPart1NotPremium : limitPart1}
            <span
              className="cursor-pointer text-brand-300"
              onClick={() => {
                const event = {
                  category: 'Plans',
                  action: 'OpenSubscription',
                  label: `From Free Limit`,
                }
                chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
                user ? getLinkToWebsite(locale, 'account/plans') : getLinkToWebsite(locale, 'signup')
                user && sendAmplitudeEvent('go_to_Premium', { location: 'double_subs' })
              }}
            >
              {!paymentData?.isSubscriptionFinished ? limitLinkNotPremium : limitLink}
            </span>
            {!paymentData?.isSubscriptionFinished ? limitPart2NotPremium : limitPart2}
          </span>
        ) : autoPauseOnHover && isPaidSubscription ? (
          text.map((el, i) => {
            if (el) {
              return (
                <Highlight
                  key={i}
                  source={el}
                  target={generateStringArray(vocabularyWords, vocabularyPhrases)}
                >
                  {(spanElement: string) => (
                    <span
                      id={id} key={getRandomIntInclusive(0, 1000000)}
                      style={{ color: (subtitleColorOnYt || subtitleColorOnNetflix || subtitleColorOnCoursera) === '#FFFFFF' ? '#4F6EFD' : '#A4B4FF' }}
                    >
                      {spanElement}
                    </span>
                  )}
                </Highlight>
              )
            }
          })
        ) : (
          text
        )}
      </span>
      {type === 'main' ? 
      <div 
        className="ml-[10px] cursor-pointer text-gray-200 hover:text-blue-400" 
        onClick={handleClickDualSubs}
      >
        <TranslateIcon/> 
      </div>
      : null}
    </div>
  )
}

export default CaptionLine
