import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { setPositionOnBoarding } from '../../store/settingsActions'

const ButtonDots: React.FC = () => {
  const dispatch = useDispatch()
  const positionOnBoarding = useSelector<RootState, number>((state) => state.settings.positionOnBoarding)

  return (
    <div className='flex gap-x-36px mt-30px'>
      <div className={`w-12px h-12px rounded-full ${positionOnBoarding === 1 ? 'dark:bg-blue-960 bg-blue-400' : 'dark:bg-blue-460 bg-gray-400'} cursor-pointer`} onClick={()=> dispatch(setPositionOnBoarding( 1))} />
      <div className={`w-12px h-12px rounded-full ${positionOnBoarding === 2 ? 'dark:bg-blue-960 bg-blue-400' : 'dark:bg-blue-460 bg-gray-400'} cursor-pointer`} onClick={()=> dispatch(setPositionOnBoarding( 2))} />
      <div className={`w-12px h-12px rounded-full ${positionOnBoarding === 3 ? 'dark:bg-blue-960 bg-blue-400' : 'dark:bg-blue-460 bg-gray-400'} cursor-pointer`} onClick={()=> dispatch(setPositionOnBoarding( 3))} />
      <div className={`w-12px h-12px rounded-full ${positionOnBoarding === 4 ? 'dark:bg-blue-960 bg-blue-400' : 'dark:bg-blue-460 bg-gray-400'} cursor-pointer`} onClick={()=> dispatch(setPositionOnBoarding( 4))} />
    </div>
  )
}

export default ButtonDots