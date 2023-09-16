import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { RootState } from '../background/store/slices'
import Button from '../common/components/button/button'
import strings from '../../locales/localisation'
import { proxyActions } from '../background/store/proxyActions'

const App = () => {
  const language = useSelector<RootState, string>((state) => state.settings.language)
  const dispatch = useDispatch()

  return (
    <div className='w-full h-full p-2'>
      <h1 className='text-lg font-bold'>PopUp page</h1>

      <div className='flex justify-between items-center w-1/3'>
        <span>{strings.settings.language}</span>
        <span>{language}</span>
      </div>

      <div className='flex justify-between items-center w-1/3 gap-4'>
        <Button text='English' onClick={() => {
          dispatch(proxyActions.settings.setLanguage({ language: 'en' }))
        }}
        />
        <Button text='Russian' onClick={() => {
          dispatch(proxyActions.settings.setLanguage({ language: 'ru' }))
        }}
        />
      </div>
    </div>
  )
}

export default App
