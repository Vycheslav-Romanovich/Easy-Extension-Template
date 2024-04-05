import { SubtitleLine } from '../constants/types'

export const removeDuplicate = (data: SubtitleLine[]) => {
  let needToRun = true

  while (needToRun) {
    needToRun = false
    data.forEach((subtitle, index) => {
      if (index >= data.length - 1) {
        return
      }

      const nextSubtitle = data[index + 1]

      if (nextSubtitle.text.includes(data[index].text)) {
        nextSubtitle.text = nextSubtitle.text.replace(data[index].text, '').trim()
        needToRun = true
      }

      if (nextSubtitle.text.length === 0) {
        data[index].endTime = nextSubtitle.endTime
        data.splice(index + 1, 1)
        needToRun = true
      }
    })
  }
  return data
}

export const cleanUpText = (text: string) => {
  return text
    .replace(/<\d+:\d+:\d+.\d+><c>/g, '')
    .replace(/<\/c>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/&lrm;/g, '')
    .replace(/&rlm;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&amp;/g, '')
    .replace(/>>/g, '')
    .replace(/\n/g, ' ')
    .replace(/(\<(\/?[^>]+)>)/g, '')
    .trim()
}
