import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../background/store/reducers'
import 'react-toastify/dist/ReactToastify.css'
import { setLanguage } from '../common/store/settingsActions'

const App = () => {
  const language = useSelector<RootState, string>((state) => state.settings.language)
  const dispatch = useDispatch()

  return (
    <div className='w-full h-full p-2'>
      <h1 className='text-lg font-bold'>PopUp page</h1>

      <div className='flex justify-between items-center w-1/3'>
        <span>Ui language</span>
        <span>{language}</span>
      </div>

      <div className='flex justify-between items-center w-1/3'>
        <button onClick={() => {
          dispatch(setLanguage('en'))
        }}
        >
          English
        </button>
        <button onClick={() => {
          dispatch(setLanguage('ru'))
        }}
        >
          Russian
        </button>
      </div>
    </div>
  )
}

export default App
