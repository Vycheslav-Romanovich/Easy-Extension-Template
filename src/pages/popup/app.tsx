import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { RootState } from '../background/store/slices'
import strings from '../../locales/localisation'
import { proxyActions } from '../background/store/proxyActions'
import { EDarkMode } from '../../constants/types'
import { updateTheme } from '../../utils/updateTheme'
import { supportedLanguages } from '../../constants/supportedLanguages'

const App = () => {
  const language = useSelector<RootState, string>((state) => state.settings.language)
  const darkMode = useSelector<RootState, EDarkMode>((state) => state.settings.darkMode)
  updateTheme(darkMode)
  const dispatch = useDispatch()

  const handleLanguageChange = (e: any) => {
    dispatch(proxyActions.settings.setLanguage({ language: e.target.value }))
  }

  const handleThemeChange = (e: any) => {
    dispatch(proxyActions.settings.setDarkMode({ darkMode: e.target.value }))
  }

  return (
    <div className='smooth-theme-transition w-full h-full p-2 bg-white dark:bg-black text-black dark:text-white'>
      <h1 className='text-lg font-bold'>PopUp page</h1>

      <div className='flex justify-between items-center w-1/3'>
        <span>{strings.settings.language}</span>
        <select className='px-2 h-6 bg-white dark:bg-gray-700 border rounded' value={language} onChange={handleLanguageChange}>
          {supportedLanguages.map(language => (
            <option value={language.code}>{language.name}</option>
          ))}
        </select>
      </div>

      <div className='flex justify-between items-center w-1/3 gap-4'>
        <span>{strings.settings.theme}</span>
        <select className='px-2 h-6 bg-white dark:bg-gray-700 border rounded' value={darkMode} onChange={handleThemeChange}>
          <option value={EDarkMode.AlwaysLight}>Light</option>
          <option value={EDarkMode.AsSystem}>System</option>
          <option value={EDarkMode.AlwaysDark}>Dark</option>
        </select>
      </div>
    </div>
  )
}

export default App
