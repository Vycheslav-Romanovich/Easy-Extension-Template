import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../../../locales/localisation'
import FullProgressCard from './fullProgressCard'
import ProgressCat from './progressCat'
import { ICheckList } from '../../../../constants/types'

import PhraseAnimation from '../../../../assets/animations/Phrases.json'
import WordAnimation from '../../../../assets/animations/Word.json'
import VocabAnimation from '../../../../assets/animations/Vocab.json'
import ChangesAnimation from '../../../../assets/animations/Changes.json'
import SubsAnimation from '../../../../assets/animations/Subs.json'
import { ButtonUnderline } from '../../../common/components/buttonUnderline'

type Props = {
  isProgressShow: boolean,
  setIsProgressShow: (show: boolean) => void
}

const ProgressCard: React.FC<Props> = ({isProgressShow, setIsProgressShow}) => {
  const strings = useTranslation()
  const progressCard = strings.popup.menu.progressCard.shortCard
  const fullProgressCard = strings.popup.menu.progressCard.fullCard
  const completedCheckList = strings.popup.menu.progressCard.completedCheckList

  const defaultCheckList = [
    { keyValue: 'account', isDone: false, text: fullProgressCard.listItems.account, animation: '' },
    { keyValue: 'word', isDone: false, text: fullProgressCard.listItems.word, animation: WordAnimation },
    { keyValue: 'phrase', isDone: false, text: fullProgressCard.listItems.phrase, animation: PhraseAnimation },
    { keyValue: 'vocabulary', isDone: false, text: fullProgressCard.listItems.vocabulary, animation: VocabAnimation },
    { keyValue: 'subs', isDone: false, text: fullProgressCard.listItems.subs, animation: SubsAnimation },
    { keyValue: 'size', isDone: false, text: fullProgressCard.listItems.size, animation: ChangesAnimation },
  ]

  const [rating, setRating] = useState<number>(0)
  const [checkList, setCheckList] = useState<Array<ICheckList>>(defaultCheckList)

  useEffect(() => {
    chrome.storage.sync.get(['userCheckList'], (result) => {
      if (Object.keys(result).length !== 0) {
        if (Object.keys(result.userCheckList).length) {
          const resultCheCkList = defaultCheckList.map((item) => {
            if (Object.keys(result.userCheckList).includes(item.keyValue)) {
              item.isDone = true
              return item
            } else {
              return item
            }
          })

          setCheckList(
            resultCheCkList.sort((item1, item2) => {
              if (!item1.isDone) {
                return -1
              }
              if (item2.isDone) {
                return 1
              }
              return 0
            })
          )
          setRating(resultCheCkList.filter((item) => item.isDone).length)
        }
      }
    })
  }, [])

  return (
    <div>
      {!isProgressShow && 
      <section className="bg-[#e3eefd]">
        <div className="pt-[16px] pb-[24px] px-[15px] flex flex-col items-start justify-center select-none">
          <p className="text-sm font-bold text-gray-700">
            {rating === 6 ? completedCheckList.title : isProgressShow ? fullProgressCard.title : progressCard.title}
          </p>
          <div className="flex flex-row justify-between items-center w-full mt-[2px]">
          <p className="text-[12px] font-normal">
            {rating === 6
              ? completedCheckList.text
              : isProgressShow
              ? `${fullProgressCard.text}`
              : `${progressCard.text.firstPart} ${Math.trunc((100 / 6) * rating)}% ${progressCard.text.secondPart}`}
          </p>
          <div className="flex justify-between cursor-pointer z-20">
            {rating === 6 ? (
              <p className="text-sm font-bold text-blue-400 mr-2">
                {fullProgressCard.link.firstPart} {Math.trunc((100 / 6) * rating)}% {fullProgressCard.link.secondPart}
              </p>
            ) : (
              <div className="flex items-center">
                {isProgressShow ? (
                  <p className="text-sm font-bold text-blue-400 mr-2">
                    {fullProgressCard.link.firstPart} {Math.trunc((100 / 6) * rating)}% {fullProgressCard.link.secondPart}
                  </p>
                ) : (
                  <ButtonUnderline showArrow smallText text={progressCard.link} onClickHandler={() => setIsProgressShow(true)}/>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </section>}
      {isProgressShow && 
      <section className="flex items-center py-[16px] px-[26px] bg-[#FFF]">
         <ProgressCat count={6} rating={rating} isMenuItem={true} />
        <div className="ml-26px flex flex-col items-start justify-center select-none">
          {/* <p className="text-sm font-bold text-gray-700">
            {rating === 6 ? completedCheckList.title : isProgressShow ? fullProgressCard.title : progressCard.title}
          </p> */}
          <div className="mt-1.5 flex justify-between cursor-pointer w-278 z-20">
            {rating === 6 ? (
              <p className="text-sm font-bold text-blue-400 mr-2">
                {fullProgressCard.link.firstPart} {Math.trunc((100 / 6) * rating)}% {fullProgressCard.link.secondPart}
              </p>
            ) : (
              <div className="flex items-center">
                {isProgressShow ? (
                  <p className="text-sm font-bold text-blue-400 mr-2">
                    {fullProgressCard.link.firstPart} {Math.trunc((100 / 6) * rating)}% {fullProgressCard.link.secondPart}
                  </p>
                ) : (
                  <ButtonUnderline showArrow text={progressCard.link} onClickHandler={() => setIsProgressShow(true)}/>
                )}
              </div>
            )}
          </div>
          <p className="text-[12px] font-normal text-gray-400 mt-1.5">
            {rating === 6
              ? completedCheckList.text
              : isProgressShow
              ? `${fullProgressCard.text}`
              : `${progressCard.text.firstPart} ${Math.trunc((100 / 6) * rating)}% ${progressCard.text.secondPart}`}
          </p>
        </div>
      </section>}

      {isProgressShow && <FullProgressCard checkList={checkList} />}
    </div>
  )
}

export default ProgressCard
