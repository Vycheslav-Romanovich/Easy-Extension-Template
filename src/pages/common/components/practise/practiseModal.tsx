import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from '../../../../locales/localisation'
import { RootState } from '../../../background/store/reducers'
import ProgressCat from '../../../popup/components/progress/progressCat'
import Button from '../button'
import Eye from '../../../../assets/icons/youtube/close-eyes.svg'
import { OnClickHandler, WordVocabularyElement } from '../../../../constants/types'

type PropsType = {
  onClick: OnClickHandler
  goToPractise: OnClickHandler
}

const PractiseModal: React.FC<PropsType> = ({ onClick, goToPractise }) => {
  const isDarkModeInYoutube = useSelector<RootState, boolean>((state) => state.settings.isDarkModeInYoutube);
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const practiceRound = useSelector<RootState, number>((state) => state.video.practiceRound);
  const isFinishedPractice = useSelector<RootState, boolean>((state) => state.video.isFinishedPractice);

  const strings = useTranslation();
  const { modalWithoutSub } = strings.practice;

  const [currentPracticeRound, setCurrentPracticeRound] = useState<number>(practiceRound);

  useEffect(() => {
    practiceRound === 0 || isFinishedPractice 
      ? setCurrentPracticeRound(practiceRound) 
      : setCurrentPracticeRound(practiceRound - 1)
  }, [])

  return (
    <div
      className={`${
        !isDarkModeInYoutube && '#ffffff'
      } font-inter p-[19px] mb-[20px] border border-solid border-gray-950 flex justify-between rounded-8`}
    >
      <ProgressCat count={Math.ceil(vocabularyWords.length / 10)} rating={currentPracticeRound} />

      <div className="flex flex-col">
        <p className={`text-[14px] ${isDarkModeInYoutube ? 'text-white' : 'text-gray-600'}  font-bold max-w-[200px]`}>{modalWithoutSub.title}</p>
        <div
          onClick={onClick}
          className="flex mt-[6px] items-center cursor-pointer hover:underline hover:text-blue-400 active:underline-offset-1"
        >
          <Eye />
          <p className="ml-[8px] text-brand-300 font-bold text-[14px]">{modalWithoutSub.hiddenBtn}</p>
        </div>
        <Button type="primary" text={modalWithoutSub.startBtn} className="w-[272px] mt-[12px]" onClick={(e) => {
          goToPractise && goToPractise(e)
        }} />
      </div>
    </div>
  )
}

export default PractiseModal
