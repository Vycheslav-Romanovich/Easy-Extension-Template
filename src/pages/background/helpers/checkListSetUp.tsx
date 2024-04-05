export const setCheckListDate = (point: string): void => {
  chrome.storage.sync.get(['userCheckList'], (result) => {
    if (result.userCheckList === undefined) {
      const userCheckList = { [point]: true }
      chrome.storage.sync.set({ userCheckList })
    } else {
      if (result.userCheckList[point] === undefined) {
        const userCheckList = Object.assign(result.userCheckList, { [point]: true })
        chrome.storage.sync.set({ userCheckList })
      }
    }
  })
}

export const checkTextComplited = (word: string, learningLanguageCode: string): boolean | undefined => {
  if (learningLanguageCode === 'zh-Hans' || learningLanguageCode === 'zh-Hant') {
    return checkSelectionСontainer(word.match(/([\u4e00-\u9fa5])/g))
  } else if (learningLanguageCode === 'ja') {
    return checkSelectionСontainer(word.match(/([\u0800-\u4e00])/g))
  } else {
    return checkSelectionСontainer(word.split(/\s+/))
  }
}

export const checkTextSymbolsLength = (word: string, learningLanguageCode: string): number => {
  if (learningLanguageCode === 'zh-Hans' || learningLanguageCode === 'zh-Hant') {
    return word.match(/([\u4e00-\u9fa5])/g)!.length;
  } else if (learningLanguageCode === 'ja') {
    return word.match(/([\u0800-\u4e00])/g)!.length
  } else {
    return word.split(/\s+/).join('').length;
  }
}

const checkSelectionСontainer = (regex: Array<string> | null) => {
  if (regex !== null) {
    if (regex.length < 5) {
      return true
    } else {
      return false
    }
  }
}
