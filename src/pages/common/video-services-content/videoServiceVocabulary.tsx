import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { getService } from '../../../utils/url'
import { PhraseVocabularyElement, WordHistoryElement, WordVocabularyElement } from '../../../constants/types'
import { deletePhraseFromVacabulary, deleteWordFromVacabulary } from '../../background/store/actions/vocabularyActions'
import { useTranslation } from '../../../locales/localisation'
import VocabularyContent from '../components/videoService/vocabularyContent'
import { deleteWordFromHistory } from '../../background/helpers/firebase'
import { useFullScreenContex } from '../../../context/FullScreenContext'
import { sendAmplitudeEvent } from '../../../utils/amplitude'
import ZeroWordsBanner from '../../../assets/images/vocabulary/zeroWordsBanner.svg'
import ZeroHistoryBanner from '../../../assets/images/vocabulary/zeroHistoryBanner.svg'
import VocabularyFooter from '../components/vocabularyFooter'
import PracticeMainWindow from '../components/practise/practiceMainWindow'
import { produceData } from '../../../utils/normalizeTerm'

type PropType = {
  isFullscreenModeOnYt?: boolean
  isWidescreenModeYt?: boolean
  isPopUp?: boolean
}

const VideoServiceVocabulary: React.FC<PropType> = ({ isFullscreenModeOnYt, isWidescreenModeYt, isPopUp }) => {
  const service = getService()
  const strings = useTranslation()
  const { youtube } = strings.options.navigation
  const { vocabulary } = strings.popup.menu

  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube)
  const userUid = useSelector<RootState, string>((state) => state.auth.user.uid)
  const courseraVideoId = useSelector<RootState, string>((state) => state.video.courseraVideoId)
  const lastPracticed = useSelector<RootState, number>((state) => state.vocabulary.lastPracticed)
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const phrases = useSelector<RootState, Array<PhraseVocabularyElement>>((state) => state.vocabulary.phrases)
  const translateHistoryData = useSelector<RootState, Array<WordHistoryElement>>((state) => state.settings.translateHistoryData)
  const localLang = useSelector<RootState, string>((state) => state.settings.localLang)

  const [activeTab, setActiveTab] = useState<'saved' | 'translationHistory'| 'practice'>('translationHistory')
  const [masteredWordsCount, setMasteredWordsCount] = useState<number>(0)
  const [isPracticeStart, setIsPracticeStart] = useState<boolean>(false)

  const { isFullScreen } = useFullScreenContex()

  const isNetflix = service === 'netflix'
  const isYoutube = service === 'youtube'

  const tabButton = 'text-center cursor-pointer basis-2/4 py-[6px]'
  const activeTabButton = 'font-bold rounded-[100px] text-white bg-blue-400'

  const removeElementFromVocabulary = (deletedElement: WordVocabularyElement | PhraseVocabularyElement): void => {
    deletedElement.word && deleteWordFromVacabulary(deletedElement.word, userUid, courseraVideoId)
    deletedElement.phrase && deletePhraseFromVacabulary(deletedElement.phrase, userUid, courseraVideoId)
    sendAmplitudeEvent('delete_saved_word', { location: 'player' })
  }

  const removeElementFromHistory = (deletedElement: WordHistoryElement | WordVocabularyElement | PhraseVocabularyElement): void => {
    deletedElement.word && deleteWordFromHistory(deletedElement.word, userUid)
    sendAmplitudeEvent('delete_translated_word', { location: 'player' })
  }

  const practiceWordsClick = (value: boolean) => {
    setIsPracticeStart(value)
    setActiveTab('practice') 
  }

  const onExitPractice = () => {
    setActiveTab('saved')
    setIsPracticeStart(false)
  }

  useEffect(() => {
    let count = 0
    vocabularyWords.forEach(item => {
      item.memoryScale === 5 && count++
    })
    setMasteredWordsCount(count)
  }, [vocabularyWords])

  useEffect(() => {
    const yesterdayDate = produceData(new Date(+new Date() - 24*3600*1000), 'en')
    const nowDate = produceData(new Date(), 'en')
    const lastPracticedDate = produceData(new Date(lastPracticed), 'en')

    // If last practice not today and not yesterday
    if (!(yesterdayDate === lastPracticedDate || nowDate === lastPracticedDate)) {
      if(localStorage.getItem('countPracticeFree') === null || localStorage.getItem('countPracticeFree') === undefined) {
        localStorage.setItem('countPracticeFree', '0')
      }
      else {
        localStorage.setItem('countPracticeFree', '0')
      }
    }

    if (lastPracticedDate !== nowDate) {
      if(localStorage.getItem('countPracticeFree') === null || localStorage.getItem('countPracticeFree') === undefined) {
        localStorage.setItem('countPracticeFree', '0')
      }
      else {
        localStorage.setItem('countPracticeFree', '0')
      }
    }
  }, [])

  return (
    <>
      {(activeTab === 'saved' || activeTab === 'translationHistory') && !isPracticeStart &&
        <div
        style={{ height: '100%', padding: '10px 16px' }}
        className={`scrollbar scrollbar-width-yt scrollbar-track-radius-full
          ${
            isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen
              ? 'scrollbar-thumb-gray-400 scrollbar-track-gray-20'
              : 'scrollbar-thumb-blue-350 scrollbar-track-gray-200'
          }
          flex flex-col
        `}
      >
        {/* <nav
          className={`flex ${
            isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen
              ? 'text-gray-400 bg-gray-600'
              : 'bg-gray-200 text-gray-300'
          }  rounded-[100px] text-[14px] leading-[20px] select-none p-[2px]`}
        >
          <div
            className={`${tabButton} ${activeTab === 'translationHistory' && activeTabButton}`}
            onClick={() => 
              { 
                setActiveTab('translationHistory')
                sendAmplitudeEvent('context', { native_language: localLang })
              }}
          >
            {youtube.context}
          </div>
          <div 
            className={`${tabButton} ${activeTab === 'saved' && activeTabButton}`} 
            onClick={() => 
              {
                setActiveTab('saved')
                sendAmplitudeEvent('favorite', { native_language: localLang })
              }}
          >
            {youtube.favorite}
          </div>
        </nav> */}

        {activeTab === 'saved' && vocabularyWords.length === 0 &&
          <div 
            className="p-4"
            style={{ margin: 'auto' }}>
              <ZeroWordsBanner />
          </div>
        }

        {activeTab === 'translationHistory' && translateHistoryData.length === 0 && 
          <div 
            className="p-4"
            style={{ margin: 'auto' }}>
              <ZeroHistoryBanner />
          </div>
        }

        <VocabularyContent
          activeTab={activeTab}
          content={activeTab === 'saved' ? [...phrases, ...vocabularyWords] : translateHistoryData}
          removeElement={activeTab === 'saved' ? removeElementFromVocabulary : removeElementFromHistory}
          darkMode={isNetflix || isDarkModeInYoutube || (isYoutube && (isFullscreenModeOnYt || isWidescreenModeYt)) || isFullScreen}
          isPopUp={isPopUp}
        />

        {activeTab === 'translationHistory' && translateHistoryData.length === 0 &&
        <div className="flex flex-col justify-center items-center ">
          <p className="text-[14px] text-blue-400 font-normal leading-[20px]">
            {vocabulary.emptyHistory1}
          </p>
          <p className="text-[14px] text-blue-400 font-normal leading-[20px]">
            {vocabulary.emptyHistory2}
          </p>
        </div>
      }
      </div>}

      {activeTab === 'saved' && <VocabularyFooter
        vocabularyWordsCount={vocabularyWords.length}
        translateHistoryCount={translateHistoryData.length}
        practiceWordsClick={practiceWordsClick}
      />}
      {activeTab === 'practice' && isPracticeStart &&
      <PracticeMainWindow 
      isFullscreenModeOnYt={isFullscreenModeOnYt} 
      isWidescreenModeYt={isWidescreenModeYt} 
      practiceWords={practiceWordsClick} 
      onExit={onExitPractice} />}
    </>
  )
}

export default VideoServiceVocabulary
