import React, { useEffect, useState } from 'react'
import Toggle from '../../common/components/toggle/toggle'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../background/store/reducers'
import { setSearchWithSubtitles } from '../../common/store/settingsActions'
import ClosedCaptionsIcon from '../../../assets/icons/toggle/closedCaptionsIcon.svg'
import { Tooltip } from '@material-ui/core'
import Fade from '@material-ui/core/Fade'
import { useTranslation } from '../../../locales/localisation'
import useStyles from '../../common/styles/tooltipSyle'
import { getVideoId } from '../../../utils/url'
import OnBoardingForSearchSubtitleBtn from '../../common/components/onBoarding/onBoardingForSearchSubtitleBtn'
import { sendAmplitudeEvent } from '../../../utils/amplitude'

let searchWithSubtitles = false
let searchQuery = ''

const SearchWithSubtitlesToggle: React.FC<{ onBoarding?: boolean | null , setOnBoarding?: any, }> = ({onBoarding, setOnBoarding}) => {
  const searchWithSubtitlesTemp = useSelector<RootState, boolean>((state) => state.settings.searchWithSubtitles)
  searchWithSubtitles = searchWithSubtitlesTemp
  const dispatch = useDispatch()
  const strings = useTranslation()
  const tooltip = strings.tooltip.youtube
  const classes = useStyles()
  const [isActiveElement, setIsActiveElement] = useState<boolean>(false)

  let originalSuggestionsList
  const originalInput = document.querySelector("#search[type='text']")
  const originalSearchBtn = document.querySelector('#search-icon-legacy')
  const originalInputContainer: HTMLElement | null = document.querySelector('#container.style-scope.ytd-searchbox')

  if (originalInputContainer) {
    originalInputContainer.style.border = '1px solid var(--ytd-searchbox-legacy-border-color)'
  }

  const handleSearchBtnClick = () => {
    if (searchQuery.length === 0) {
      return
    }
    if (searchWithSubtitles) {
      chrome.runtime.sendMessage({ component: "newTab", url: `https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIoAQ%253D%253D` });
      // window.open(`https://www.youtube.com/results?search_query=${searchQuery}&sp=EgIoAQ%253D%253D`, '_self')
    }
  }

  const addInputValueToSearch = (e: Event) => {
    if (e.target === null) return
    // @ts-ignore
    const inputValue = e.target.value
    searchQuery = inputValue
    originalSuggestionsList = document.querySelector('.gstl_50.sbdd_a')

    if (!originalSuggestionsList) return
    originalSuggestionsList.addEventListener('click', (e) => {
      suggestionListListenerHandler(e, inputValue)
    })
  } 

  useEffect(() => {
    const header = document.querySelector(".style-scope.ytd-rich-grid-renderer")
    header && header.setAttribute('style','z-index: 1500')
  }, [getVideoId()])

  useEffect(() => {
   
    if (!originalInput) {
      return
    }

    // listener for suggestion list which appears when input is empty
    originalInput.addEventListener('click', (e) => {
      if (e.target === null) return

      // @ts-ignore
      const inputValue = e.target.value
      originalSuggestionsList = document.querySelector('.gstl_50.sbdd_a')
      if (originalSuggestionsList) {
        originalSuggestionsList.addEventListener('click', (e) => {
          suggestionListListenerHandler(e, inputValue)
        })
      }
    })

    //listener for input to take current input value
    originalInput.addEventListener('input', (e) => {
      addInputValueToSearch(e)
    })

    //listener for input to take focus on input
    originalInput.addEventListener('focus', (e) => {
      addInputValueToSearch(e)
    })

    //listener for input to mouse move on input
    originalInput.addEventListener('mouseenter', (e) => {
      addInputValueToSearch(e)
    })

    //listener for input to take values from appeared list of suggestions
    originalInput.addEventListener('keyup', (e) => {
      const firstOption = document.querySelector('.sbsb_c.gsfs')
      const currentOption = document.querySelector('.sbsb_c.gsfs.sbsb_d')
      let currentOptionText

      if (firstOption === null) return
      // @ts-ignore
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!currentOption) {
          if (firstOption.querySelector('.sbpqs_a')) {
            // @ts-ignore
            currentOptionText = firstOption.querySelector('.sbpqs_a').innerText
            searchQuery = currentOptionText
          } else {
            // @ts-ignore
            currentOptionText = firstOption.querySelector('.sbqs_c').innerText
            searchQuery = currentOptionText
          }
        } else if (currentOption.querySelector('.sbpqs_a')) {
          // @ts-ignore
          currentOptionText = currentOption.querySelector('.sbpqs_a').innerText
          searchQuery = currentOptionText
        } else {
          // @ts-ignore
          currentOptionText = currentOption.querySelector('.sbqs_c').innerText
          searchQuery = currentOptionText
        }
      }

      // @ts-ignore
      if (e.key === 'Enter') {
        searchQuery = currentOptionText
      }
    })

    // add event listeners for youtube inputs
    if (originalSearchBtn) {
      originalSearchBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        handleSearchBtnClick()
      }, true)
    }

    originalInput.addEventListener('keydown', (e) => {
      // @ts-ignore
      e.key === 'Enter' && handleSearchBtnClick()
    })

    document.body.addEventListener('keydown', (e) => {
      e.key === 'Enter' && handleSearchBtnClick()
    })
  }, [])

  const suggestionListListenerHandler = (e: any, inputValue: string) => {
    const target = e.target
    let optionText
    const _saveOptionValue = (optionValue: string) => {
      searchQuery = optionValue

      searchWithSubtitles
        ? window.open(`https://www.youtube.com/results?search_query=${optionValue}&sp=EgIoAQ%253D%253D`, '_self')
        : window.open(`https://www.youtube.com/results?search_query=${optionValue}`, '_self')
    }

    if (target.querySelector('.sbpqs_a')) {
      optionText = target.querySelector('.sbpqs_a').innerText
      _saveOptionValue(optionText)
    } else if (target.classList.contains('sbqs_c')) {
      optionText = target.innerText
      _saveOptionValue(optionText)
    } else {
      optionText = target.innerText
      _saveOptionValue(inputValue + optionText)
    }
  }

  // @ts-ignore
  const handleToggleClick = (e?: MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!originalInput) return

    if (e?.target?.id === 'toogleA') {
      sendAmplitudeEvent('search_with_subs', {
        action: searchWithSubtitles ? 'off' : 'on'
      })
    }

    //@ts-ignore
    searchQuery = originalInput.value
    dispatch(setSearchWithSubtitles(!searchWithSubtitles))
  }

  useEffect(() => {
    if(onBoarding && isActiveElement) {
      handleToggleClick()
    }
  }, [onBoarding, isActiveElement])

  const setIsOnBoardingActive = (value: boolean) => {
    setIsActiveElement(value)
  }

  return (
    <div className={`relative font-inter ${onBoarding && 'z-0'}`} >
      { onBoarding && <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          height: '100vh',
          backgroundColor: 'rgba(95, 99, 104, 0.3)',
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      />}
      <Tooltip

        title={tooltip.searchWitchSubtitles}
        TransitionComponent={Fade}
        enterDelay={500}
        classes={{ tooltip: classes.tooltipUpper, arrow: classes.arrow }}
        arrow
      >
        <div
          onClick={(e) => handleToggleClick(e)}
          id="search-icon-legacy"
          style={{ zIndex: 10000, marginLeft: 6, marginRight: 6 }}
          className="elang_search_with_subtitle_toggle mx-2 border-r flex justify-center items-center box-border border-r-0 rounded-none w-28 h-full style-scope ytd-searchbox"
        >
          <Toggle imageOnDot={<ClosedCaptionsIcon />} value={searchWithSubtitles} onBoarding={onBoarding}/>
        </div>
      </Tooltip>
      {onBoarding && 
        <OnBoardingForSearchSubtitleBtn onBoarding={onBoarding} setOnBoarding={setOnBoarding} setElementActive={setIsOnBoardingActive}/>
      }
    </div>
  )
}

export default React.memo(SearchWithSubtitlesToggle)
