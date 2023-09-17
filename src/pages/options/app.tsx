import React from 'react'
import { useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { RootState } from '../background/store/slices'
import { EDarkMode } from '../../constants/types'
import { updateTheme } from '../../utils/updateTheme'

const App = () => {
  const language = useSelector<RootState, string>((state) => state.settings.language)
  let darkMode = useSelector<RootState, EDarkMode>((state) => state?.settings?.darkMode)
  updateTheme(darkMode)

  return (
    <div className='smooth-theme-transition w-full h-full p-2'>
      <h1 className='text-lg font-bold'>Options page</h1>

      <div className='flex justify-between items-center w-1/3'>
        <span>Ui language</span>
        <span>{language}</span>
      </div>
    </div>
  )
}

export default App
