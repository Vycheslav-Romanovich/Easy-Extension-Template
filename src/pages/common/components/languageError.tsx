import React from 'react'

import Exclamation from '../../../assets/icons/youtube/exclamation.svg'

type PropsType = {
  text: string
}

const LanguageError: React.FC<PropsType> = ({ text }) => {
  return (
    <div style={{ top: '30px' }} className="flex items-center justify-center absolute ml-9">
      <Exclamation />
      <p style={{ fontSize: '10px', lineHeight: '16px', marginLeft: '5px', marginBottom: 0, marginTop: 0 }} className="text-gray-300">
        {text}
      </p>
    </div>
  )
}

export default LanguageError
