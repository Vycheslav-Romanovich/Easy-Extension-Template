import React from 'react'

type PropsType = {
  source: string
  target: Array<string>
  children: (value: string) => void
}

type HighlightElement = {
  callback: any
  offset: number
  lengthVal: number
}


const Highlight: React.FC<PropsType> = ({ source, target, children }) => {
  const escapeRegex = (value: string) => {
    if (value) {
      return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    } else {
      return ''
    }
  }
  const punctuation = ['.', ',', ';', ':', '?', '!', '"', ')', '(', ' ']

  const compareEndSymbol = (offset: number, val: string): boolean => {
    let isExist = false
    punctuation.forEach((el) => {
      if (source.charAt(offset + val.length) === el) {
        isExist = true
      }
    })

    return isExist
  }

  const compareStartSymbol = (offset: number): boolean => {
    let isExist = false
    punctuation.forEach((el) => {
      if (source.charAt(offset - 1) === el) {
        isExist = true
      }
    })

    return isExist
  }

  const highlightWord = (source: any, target: Array<string>, callback: any) => {
    const highlightSub: any = []
    const spanElements: Array<HighlightElement> = []

    if (!source) return highlightSub
    if (!target.length) return source

    const regex: Array<RegExp> = []
    target.forEach((element) => {
      regex.push(new RegExp(escapeRegex(element), 'gi'))
    })

    regex.forEach((element: RegExp) => {
      source.replace(element, (val: string, offset: number) => {

        if (offset + val.length === source.length) {
          spanElements.push({ callback: callback(val), offset: offset, lengthVal: val.length })
        }

        if (
          (compareEndSymbol(offset, val) || offset + val.length + 1 === source.length) &&
          (offset - 1 === -1 || compareStartSymbol(offset))
        ) {
          spanElements.push({ callback: callback(val), offset: offset, lengthVal: val.length })
        }
      })
    })

    const mainElements: any = []
    spanElements.forEach((item) => {
      spanElements.filter((el) => {
        if (
          item.callback.props.children.includes(el.callback.props.children) &&
          item.lengthVal !== el.lengthVal &&
          el.lengthVal <= item.lengthVal
        ) {
          mainElements.push(el)
        }
      })
    })

    const filteredSpanElements = spanElements.filter(function (x) {
      return mainElements.indexOf(x) < 0
    })

    let lastOffset = 0
    filteredSpanElements
      .sort((a, b) => (a.offset > b.offset ? 1 : -1))
      .forEach((el) => {
        highlightSub.push(source.substr(lastOffset, el.offset - lastOffset), el.callback)
        lastOffset = el.offset + el.lengthVal
      })

    highlightSub.push(source.substr(lastOffset))

    return highlightSub
  }

  return highlightWord(source, target, children)
}

export default Highlight
