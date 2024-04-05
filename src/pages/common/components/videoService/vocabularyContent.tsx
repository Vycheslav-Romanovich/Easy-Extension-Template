import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  PhraseVocabularyElement,
  PopupData,
  WordHistoryElement,
  WordVocabularyElement,
} from '../../../../constants/types'
import { RootState } from '../../../background/store/reducers'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import { setCheckListDate } from '../../../background/helpers/checkListSetUp'
import {
  dataFromGoogleApiFromPopup,
  getPharesDescriptionFromPopap,
  getWordDescriptionFromPopap,
} from '../../../background/helpers/requestForPopap'
import { setCountOfNewWordsAtVocabulary, setWordsToPractice, removeWordsToPractice} from '../../store/vocabularyActions'
import { TermItem } from './TermItem'

type PropsType = {
  activeTab: 'saved' | 'translationHistory' | 'practice'
  darkMode: boolean
  content: Array<WordHistoryElement> | Array<WordVocabularyElement | PhraseVocabularyElement> | any
  removeElement: (item: WordHistoryElement | WordVocabularyElement | PhraseVocabularyElement) => void
  isPopUp?: boolean
}

const VocabularyContent: React.FC<PropsType> = ({ activeTab, content, removeElement, darkMode, isPopUp }) => {
  const dispatch = useDispatch()

  const userUid = useSelector<RootState, string>((state) => state.auth.user.uid)
  const learningLang = useSelector<RootState, string>((state) => state.settings.learningLang)
  const localLang = useSelector<RootState, string>((state) => state.settings.localLang)
  const countOfNewWords = useSelector<RootState, number>((state) => state.vocabulary.countOfNewWords)
  const courseraVideoId = useSelector<RootState, string>((state) => state.video.courseraVideoId)
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const practiceWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.practiceWords)

  const updateVocAfterAdd = () => {
    dispatch(setCountOfNewWordsAtVocabulary(countOfNewWords + 1))
  }

  const addItemToVocabulary = (item: WordVocabularyElement | PhraseVocabularyElement | WordHistoryElement) => {
    setCheckListDate('vocabulary')
    if (userUid && item) {
      if (item.phrase) {
        getPharesDescriptionFromPopap(item.phrase, userUid, item.link, updateVocAfterAdd, item.translate, courseraVideoId)
      }
      if (item.word) {
        dataFromGoogleApiFromPopup(item.word, learningLang, localLang).then((data: PopupData | undefined) => {
          data && item.word && getWordDescriptionFromPopap(item.word, userUid, item.link, updateVocAfterAdd, data, item.translate, undefined, courseraVideoId)
        })
      }
    }
  }

  const addItemToPractice = (item: WordVocabularyElement) => {
    if (userUid && item) {
        dispatch(setWordsToPractice(item))
      }
  }

  const removeItemToPractice = (item: WordVocabularyElement) => {
    if (userUid && item) {
        dispatch(removeWordsToPractice(item))
      }
  }

  useEffect(() => {
    sendAmplitudeEvent('vocabulary_open', { location: 'player' })
  }, [])
  
  return (
    <>
      {content.length ?
        content
          .sort((item1: any, item2: any) => item2.timestamp - item1.timestamp)
          .map((item: any) => {
            // let isWordSaved = false
            // if (activeTab === 'translationHistory') {
            //   vocabularyWords.forEach((savedItem) => {
            //     if (savedItem.word === item.word) {
            //       isWordSaved = true
            //     }
            //   })
            // }
            
            return (
              <TermItem item={item}
                        activeTab={activeTab}
                        // isWordSaved={isWordSaved}
                        darkMode={darkMode}
                        addItemToVocabulary={addItemToVocabulary}
                        removeElement={removeElement}
                        key={item.word}
                        addItemToPractice={addItemToPractice}
                        removeItemToPractice={removeItemToPractice}
                        isPopUp={isPopUp}
              />
            )
          }) : null}
    </>
  )
}

export default VocabularyContent
