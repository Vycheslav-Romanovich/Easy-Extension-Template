import React from 'react'

import { ICheckList } from '../../../../constants/types'
import ProgressOpenCard from './progressOpenCard'

type PropsType = {
  checkList: Array<ICheckList>
}

const FullProgressCard: React.FC<PropsType> = ({ checkList }) => {
  return (
    <section className="block flex-col justify-center items-start pt-4 bg-gray-980 px-[26px]">
      <div>
        {checkList.map((item, index) => {
          return (
            <div key={index} className={`${index && 'mt-4'} ${index === checkList.length - 1 && 'pb-[25px]'}`}>
              <ProgressOpenCard text={item.text} keyValue={item.keyValue} isDone={item.isDone} animation={item.animation} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FullProgressCard
