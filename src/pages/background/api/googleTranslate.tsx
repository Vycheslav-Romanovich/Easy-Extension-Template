import React, { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getService } from '../../../utils/url'
import { RootState } from '../store/reducers'

import PopUpTranslate from '../../popup/PopUpTranslateB'
import { PopupData } from '../../../constants/types'

import Loader from '../../common/components/loader/loader'
import ShortTranslatePopup from '../../popup/shortTranslatePopup'
import { checkTextComplited } from '../helpers/checkListSetUp'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import { getLanguageName } from '../../../constants/supportedLanguages'

type PropsType = {
  word: string | undefined
  selectedPhrase: string | undefined
  uid: string | null
  link: string
  position: boolean | undefined
  selectionWidth?: number | undefined
  selectionHeight?: number | undefined
  domRectWidth?: number | undefined
  isVideoWord: string | undefined
  popupObject: PopupData | undefined
  translate: string
}
export const ShowTranslatePopUpWithDate: React.FC<PropsType> = ({
  word,
  selectedPhrase,
  uid,
  link,
  position,
  selectionWidth,
  selectionHeight,
  domRectWidth,
  isVideoWord,
  popupObject,
  translate,
}) => {
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const learningLanguageCode = useSelector<RootState, string>((state) => state.settings.learningLang)
  const [translationPrase, setTranslationPrase] = useState<string>('')
  const [translateSingleWord, setTranslateSingleWord] = useState<string>('')
  const [checkedWord, setCheckedWord] = useState<string>('')
  const [checkedPhrase, setCheckedPhrase] = useState<string>('')
  const isNetflix = getService() === 'netflix'
  const isYoutube = getService() === 'youtube'
  const isCoursera = getService() === 'coursera'

  useEffect(() => {
    if(word) checkTextComplited(word, learningLanguageCode) ? setCheckedWord(word) : setCheckedPhrase(word)
  }, [])

  useEffect(() => {
    if(checkedPhrase) {
      setTranslationPrase(translate)
    }
    if(checkedWord) {
      setTranslateSingleWord(translate)
    }
  }, [checkedPhrase, translate, checkedWord])

  //for analytic
  useEffect(() => {
    if (checkedWord) {
      if (isNetflix || isYoutube || isCoursera) {
        sendAmplitudeEvent('subs_translate_word', {
          language: getLanguageName(learningLanguageCode, 'en'),
          resource: `${getService()}`,
        })
      } else {
        let symbolsCount: '0-4' | '5-10' | '11+' = '0-4'
        const wordLength = checkedWord.length
        switch (true) {
          case (wordLength > 0 && wordLength <= 4):
            symbolsCount = '0-4'
            break
          case (wordLength >= 5 && wordLength <= 10):
            symbolsCount = '5-10'
            break
          case (wordLength >= 11):
            symbolsCount = '11+'
            break
          default: break
        }
        sendAmplitudeEvent('text_translate_word', {
          language: getLanguageName(learningLanguageCode, 'en'),
          symbols: symbolsCount
        })
        /*if (wayToOpenTextTranslation === 'withButton') {
          const event = {
            category: 'TextTranslation',
            action: 'TranslationPopUp',
            label: `Langname: ${learningLanguageCode}/${localLanguageCode}, HMSymbols: ${checkedWord.length}, button: true`,
          }
          chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
        } else {
          const event = {
            category: 'TextTranslation',
            action: 'TranslationPopUp',
            label: `Langname: ${learningLanguageCode}/${localLanguageCode}, HMSymbols: ${checkedWord.length}, button: false`,
          }
          chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
        }*/
      }
    }

    if (checkedPhrase) {
      if (isNetflix || isYoutube || isCoursera) {
        sendAmplitudeEvent('subs_translate_phrase', {
          language: getLanguageName(learningLanguageCode, 'en'),
          resource: `${getService()}`,
        })
      } else {
        let symbolsCount: '0-25' | '26-50' | '51-100' | '101-150' | '151+' = '0-25'
        const phraseLength = checkedPhrase.length
        switch (true) {
          case (phraseLength > 0 && phraseLength <= 25):
            symbolsCount = '0-25'
            break
          case (phraseLength >= 26 && phraseLength <= 50):
            symbolsCount = '26-50'
            break
          case (phraseLength >= 51 && phraseLength <= 100):
            symbolsCount = '51-100'
            break
          case (phraseLength >= 101 && phraseLength <= 150):
            symbolsCount = '101-150'
            break
          case (phraseLength >= 151):
            symbolsCount = '151+'
            break
          default: break
        }
        sendAmplitudeEvent('text_translate_phrase', {
          language: getLanguageName(learningLanguageCode, 'en'),
          symbols: symbolsCount
        })
        // "immediately" | "withButton"
        /*if (wayToOpenTextTranslation === 'withButton') {
          const event = {
            category: 'TextTranslation',
            action: 'PhraseTranslationPopUp',
            label: `HMWords: ${checkedPhrase.split(' ').length}, HMSymbols: ${
              checkedPhrase.split(' ').join('').length
            }, Langname: ${learningLanguageCode}/${localLanguageCode}, button: true`,
          }
          chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
        } else {
          const event = {
            category: 'TextTranslation',
            action: 'PhraseTranslationPopUp',
            label: `HMWords: ${checkedPhrase.split(' ').length}, HMSymbols: ${
              checkedPhrase.split(' ').join('').length
            }, Langname: ${learningLanguageCode}/${localLanguageCode}, button: false`,
          }
          chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
        }*/
      }
    }
  }, [translate])

  return (
    <>
        <PopUpTranslate
          uid={uid}
          selectedPhrase={selectedPhrase}
          isPhrase={translationPrase ? true : false || checkedPhrase ? true : false}
          item={translationPrase ? checkedPhrase : checkedWord}
          translate={translationPrase ? translationPrase : isVideoWord ? isVideoWord : translateSingleWord}
          link={link}
          position={position}
          selectionWidth={selectionWidth}
          selectionHeight={selectionHeight}
          requestProps={popupObject}
          domRectWidth={domRectWidth}
          transcription={popupObject?.transcription}
          isLoading={(checkedWord && translateSingleWord && popupObject?.word) || (checkedPhrase && translationPrase) || isVideoWord ? false : true}
          isCheckedPhrase={checkedPhrase.length!=0}
        />
    </>
  )
}
