import React from 'react'

import { sendAmplitudeEvent } from '../../../utils/amplitude'
import { useTranslation } from '../../../locales/localisation'

type PropsType = {
  word: string
  localLangCode: string
  isDarkMode: boolean
}

const LinkDictionary: React.FC<PropsType> = ({ word, localLangCode, isDarkMode }) => {
  const strings = useTranslation()
  const { viewIn } = strings.translatePopup

  let langCode: string = localLangCode
  if(localLangCode.includes('Hans')){
     langCode = localLangCode.replace('Hans','CN')
  }
  if(localLangCode.includes('Hant')){
    langCode = localLangCode.replace('Hant','TW')
  }

  const handleClickVocabulary=(text:string, typeVocabulary: string)=>{

    switch (typeVocabulary){
      case 'Cambridge':
        window.open(`https://dictionary.cambridge.org/dictionary/english/${text}`, '_blank')
        sendAmplitudeEvent('go_to_vocabulary', { vocabulary_name: typeVocabulary})
        break
      case 'Oxford':
        window.open(`https://www.oxfordlearnersdictionaries.com/definition/english/${text}`, '_blank')
        sendAmplitudeEvent('go_to_vocabulary', { vocabulary_name: typeVocabulary})
        break
      case 'Longman':
        window.open(`https://www.ldoceonline.com/dictionary/${text}`, '_blank')
        sendAmplitudeEvent('go_to_vocabulary', { vocabulary_name: typeVocabulary})
        break
      case 'Merriam':
        window.open(`https://www.merriam-webster.com/dictionary/${text}`, '_blank')
        sendAmplitudeEvent('go_to_vocabulary', { vocabulary_name: typeVocabulary})
        break
      case 'Google':
        window.open(`https://translate.google.com/?sl=auto&tl=${langCode}&text=${text}&op=translate`, '_blank')
        sendAmplitudeEvent('go_to_vocabulary', { vocabulary_name: typeVocabulary})
        break
      default:
        break
    }
  }

  return (
    <div style={{ borderTop: isDarkMode ? '1px solid #3E3F45' : '1px solid #EDEEF2', borderBottom:  isDarkMode ? '1px solid #3E3F45' : '1px solid #EDEEF2' }} className={`flex flex-col w-auto ${isDarkMode? 'bg-gray-700' : 'bg-white'} px-[16px] py-[10px] gap-[5px]`}>
      <div className='text-gray-10 text-[12px] leading-[16px]'>
        {viewIn}
      </div>
      <div className='flex flex-row gap-[10px]'>
        <div className='cursor-pointer' onClick={()=>handleClickVocabulary(word,'Cambridge')}>
          <div className='text-[12px] leading-[16px] dark:text-gray-100 text-gray-400 hover:text-blue-300'>Cambridge</div>
        </div>
        <div className='cursor-pointer' onClick={()=>handleClickVocabulary(word,'Oxford')}>
          <div className='text-[12px] leading-[16px] dark:text-gray-100 text-gray-400 hover:text-blue-300'>Oxford</div>
        </div>
        <div className='cursor-pointer' onClick={()=>handleClickVocabulary(word,'Longman')}>
          <div className='text-[12px] leading-[16px] dark:text-gray-100 text-gray-400 hover:text-blue-300'>Longman</div>
        </div>
        <div className='cursor-pointer' onClick={()=>handleClickVocabulary(word,'Merriam')}>
          <div className='text-[12px] leading-[16px] dark:text-gray-100 text-gray-400 hover:text-blue-300'>Merriam</div>
        </div>
        <div className='cursor-pointer' onClick={()=>handleClickVocabulary(word,'Google')}>
          <div className='text-[12px] leading-[16px] dark:text-gray-100 text-gray-400 hover:text-blue-300'>GoogleTranslate</div>
        </div>
      </div>
    </div>
  )
}

export default LinkDictionary
