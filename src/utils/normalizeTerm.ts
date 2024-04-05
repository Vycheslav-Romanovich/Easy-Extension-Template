import { PhrasesObj, PhraseVocabularyElement, WordHistoryElement, WordsObj, WordVocabularyElement } from '../constants/types'
import { HistoryObj } from '../pages/background/store/actions/settingsActions'

export const declination = (length: number, checkLanguageRu: boolean, emptyVocabulary: any) => {
  const num = length % 10
  if (checkLanguageRu) {
    if (
      length === 5 ||
      length === 6 ||
      length === 7 ||
      length === 8 ||
      length === 9 ||
      length === 10 ||
      length === 11 ||
      length === 12 ||
      length === 13 ||
      length === 14 ||
      length === 15 ||
      length === 16 ||
      length === 17 ||
      length === 18 ||
      length === 19 ||
      length === 20
    )
      return emptyVocabulary.term2
    if (num === 1) return emptyVocabulary.term
    if (num === 2 || num === 3 || num === 4) return emptyVocabulary.term1
    if (num === 5 || num === 6 || num === 7 || num === 8 || num === 9) return emptyVocabulary.term2
  } else {
    if (length === 1) {
      return emptyVocabulary.term
    } else {
      return emptyVocabulary.term1
    }
  }
}

export const generateWordArr = (data: HistoryObj | {[key: string] : Array<WordHistoryElement>}): Array<WordHistoryElement> => {
  const date = new Date()
  const shortDate = date.toLocaleDateString();
  let array: Array<WordHistoryElement>;
  if(Array.isArray(Object.values(data)[0])) {
    array = Object.values(data)[0];
  } else {
    array = Object.values(data);
  }

  return array.map((item: WordHistoryElement) => {
      if (item.cardWordShow === undefined) {
        item.cardWordShow = false
      }
      item.checkedForDelete = false
      return item
    })
    .filter((item) => new Date(item.timestamp).toLocaleDateString() === shortDate)
}

export const generateGeneralWordArray = (
  data: WordsObj | PhrasesObj
): Array<PhraseVocabularyElement> | Array<WordVocabularyElement> => {
  const vocabularyData = Object.values(data).map((item) => {
    if (item.cardWordShow === undefined) {
      item.cardWordShow = false;
    }
    item.checkedForDelete = false;
    return item;
  });

  return vocabularyData;
};


export const generateStringArray = (words: Array<WordVocabularyElement>, phrases: Array<PhraseVocabularyElement>):Array<string> => {
  const stringArrayData = [...words, ...phrases].map((item) => {
    if (item.word) {
      return item.word
    } 
    if(item.phrase) {
      return item.phrase
    }

    return ''
  });

  return stringArrayData;
}

export const produceData = (date: Date, locale: string) => {
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
