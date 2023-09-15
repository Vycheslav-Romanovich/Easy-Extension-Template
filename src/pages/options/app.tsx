import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../background/store/reducers'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const language = useSelector<RootState, string>((state) => state.settings.language)

  return (
    <div className='w-full h-full p-2'>
      <h1 className='text-lg font-bold'>Options page</h1>

      <div className='flex justify-between items-center w-1/3'>
        <span>Ui language</span>
        <span>{language}</span>
      </div>
    </div>
  )
}

export default App
