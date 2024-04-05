import LocalizedStrings from 'react-localization'
import { ru } from './languages/ru/ru'
import { en } from './languages/en/en'
import { de } from './languages/de/de'
import { es } from './languages/es/es'
import { tr } from './languages/tr/tr'
import { pl } from './languages/pl/pl'
import { ja } from './languages/ja/ja'
import { ko } from './languages/ko/ko'
import { uk } from './languages/uk/uk'
import { fr } from './languages/fr/fr'
import { zhHans } from './languages/zh-Hans/zh-Hans'
import { useLanguageContext } from '../context/LanguageContext';

type langsObject<T> = {
  [key: string]: T
}

export const useTranslation = () => {
  const { locale } = useLanguageContext()
  let translation
  const interfaceLanguage:langsObject<any> = {'ru': ru, 'en': en, 'de': de, 'es': es, 
  'tr': tr, 'pl': pl, 'ja': ja, 'ko': ko, 'uk': uk, 'fr': fr, 'zhHans': zhHans}
  const translationLang = interfaceLanguage[locale]

  if(translationLang !== undefined) {
    translation = new LocalizedStrings({translationLang})
  } else {
    translation = new LocalizedStrings({en})
  }

  translation.setLanguage(locale)
  return translation
}