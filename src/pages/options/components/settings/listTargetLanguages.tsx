import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../../background/store/reducers'
import { setLocalLang, setShowTargetLanguages, setLearningLang } from '../../../common/store/settingsActions'
import { SubsLinksType } from '../../../content/services/netflix'

import CheckMark from '../../../../assets/icons/settings/check.svg'
import { getService } from '../../../../utils/url'

import { useStore } from 'effector-react'
import { subsStore } from '../../../content/store'
import { useTranslation } from '../../../../locales/localisation'
import { getLanguageCode } from '../../../../constants/supportedLanguages'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

type PropsType = {
  langType: string
}

const ListTargetLanguages: React.FC<PropsType> = ({ langType }) => {
  const dispatch = useDispatch()
  const subs = useStore(subsStore)
  const service = getService()
  const listRef = useRef(null)

  const netflixSubsLinks = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.netflixSubsLinks)
  const courseraSubsLinks = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.courseraSubsLinks)
  const youTubeLangKeys = useSelector<RootState, Array<SubsLinksType> | undefined>((state) => state.video.youTubeLangKeys)
  const localLanguageCode = useSelector<RootState, string>((state) => state.settings.localLang)
  const learnLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const showTargetLanguages = useSelector<RootState, boolean>((state) => state.settings.showTargetLanguages)
  const settingsShown = useSelector<RootState, boolean>((state) => state.settings.settingsYouTubeShown)

  const strings = useTranslation()
  const { card2 } = strings.options.settings.cards

  const [subLinks, setSubLinks] = useState<Array<SubsLinksType> | undefined>()
  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'
  const isCoursera = service === 'coursera'

  const [lang, setLang] = useState<string>('')

  const onClickHandler = (langKey: string) => {
    if (langType === 'localLang') {
      isNetflix
        ? dispatch(setLocalLang(langKey))
        : dispatch(setLocalLang(getLanguageCode(langKey)))
      chrome.runtime.sendMessage({
        component: 'sendAnalyticsCustomeEvent',
        event: { dimension: 'dimension4', value: `${learnLanguageCode}/${getLanguageCode(langKey)}` },
      })
    } else {
      isNetflix
        ? dispatch(setLearningLang(langKey))
        : dispatch(setLearningLang(getLanguageCode(langKey)))
      chrome.runtime.sendMessage({
        component: 'sendAnalyticsCustomeEvent',
        event: { dimension: 'dimension4', value: `${getLanguageCode(langKey)}/${localLanguageCode}` },
      })
    }

    dispatch(setShowTargetLanguages(!showTargetLanguages))
  }

  useEffect(() => {
    if (!settingsShown) {
      dispatch(setShowTargetLanguages(false))
    }
  }, [settingsShown])

  useEffect(() => {
    if (isNetflix && netflixSubsLinks) {
      setSubLinks(netflixSubsLinks)
    }
    if (isYoutube && youTubeLangKeys) {
      setSubLinks(youTubeLangKeys)
    }
    if (isCoursera && courseraSubsLinks) {
      setSubLinks(courseraSubsLinks)
    }
  }, [youTubeLangKeys, netflixSubsLinks, courseraSubsLinks])

  useEffect(() => {
    if (listRef.current) {
      //@ts-ignore
      listRef.current.scrollIntoViewIfNeeded(true)
    }
  }, [listRef, lang])

  useEffect(() => {
    langType === 'localLang' ? setLang(localLanguageCode) : setLang(learnLanguageCode)
  }, [])

  return (
    <ul
      className="border-setting w-full bg-gray-30 rounded-br-lg font-sans text-gray-100 scrollbar scrollbar-srettings scrollbar-thumb-gray-300 scrollbar-track-transparent scrollbar-track-radius-full"
      style={{
        listStyleType: 'none',
        overflow: 'auto',
        height: isCoursera ? 292 : 274,
        maxHeight: isCoursera ? 292 : 274,
        fontSize: 12,
        paddingTop: 18,
        paddingBottom: 10,
        paddingLeft: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      {
        subLinks?.map((subLinkObj: SubsLinksType, i) => (
          <li
            ref={(lang && lang === subLinkObj.langCode) || (lang && lang + '[cc]' === subLinkObj.langCode) ? listRef : undefined}
            className={`cursor-pointer flex hover:bg-gray-325 active:bg-gray-335 py-12 pl-36 ${lang === subLinkObj.langCode ? 'bg-gray-330' : ''}`}
            key={i}
            onClick={() => {
              onClickHandler(subLinkObj.langCode)
              if (langType === 'localLang') {
                sendAmplitudeEvent('native_language_change', {location: 'player', native_language: subLinkObj.langName})
              } else {
                sendAmplitudeEvent('learn_language_change', {location: 'player', learn_language: subLinkObj.langName})
              }
            }}
          >
            <div
              className="relative"
              style={lang === subLinkObj.langCode ? { display: 'block' } : { display: 'none' }}
            >
              <CheckMark className="absolute" style={{ marginTop: 2, left: -17 }} />
            </div>
            <span>
              {isYoutube
                ? subs.isAutoGenerated 
                  ? `${subLinkObj.langName} ${card2.items.item11.title}`
                  : subLinkObj.langName
                : subLinkObj.langName
              }
            </span>
          </li>
        ))
      }
    </ul>
  )
}

export default ListTargetLanguages
