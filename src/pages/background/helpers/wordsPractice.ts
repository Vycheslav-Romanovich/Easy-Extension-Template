import { WordVocabularyElement } from '../../../constants/types'

export const shuffle = <T>(array: Array<T>): Array<T> => {
  for (let index = array.length - 1; index > 0; index--) {
    const jIndex = Math.floor(Math.random() * (index + 1))
    ;[array[index], array[jIndex]] = [array[jIndex], array[index]]
  }
  
  return array;
}

export const getRandomElements = (
  currentWord: WordVocabularyElement,
  translateHistory: Array<WordVocabularyElement>
): Array<WordVocabularyElement> => {
  const defaultTranslations = [currentWord]

  while (defaultTranslations.length !== 3) {
    if (defaultTranslations.length === 1) {
      const translationWithWord = translateHistory[getRandomValue(translateHistory)]
      if (translationWithWord.word !== defaultTranslations[0].word) {
        defaultTranslations.push(translationWithWord)
      }
    }

    if (defaultTranslations.length === 2) {
      const translationWithWords = translateHistory[getRandomValue(translateHistory)]
      if (translationWithWords.word !== defaultTranslations[0].word && translationWithWords.word !== defaultTranslations[1].word) {
        defaultTranslations.push(translationWithWords)
      }
    }
  }

  return defaultTranslations
}

export const getRandomValue = <T>(array: Array<T>): number => {
  return Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0
}
