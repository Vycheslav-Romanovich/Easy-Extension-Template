import React, { useState } from 'react'
import MyWordsModal from '../../../common/components/myWordsModal'
import PlayJoystick from '../../../popup/components/playJoystick'

const GameModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const goToPracticeWords = (value: boolean) => {
    setIsOpen(value)
  }
  const sendAnalyticsEvent = () => {
    const event = {
        category: 'Games',
        action: 'GamesGoTo',
        label: `Translation`
      }
      chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }
  return (
    <>
        <PlayJoystick     
            position='menu'
            fontSize={`14px`}
            lineHeight={`20px`}
            goToPracticeWords={goToPracticeWords}
            onClick={sendAnalyticsEvent}
            isTextCorrection={true}
            />  
        <MyWordsModal
            isOpen={isOpen}
            onCancel={() => {
            setIsOpen(false)
            }}
            >
        </MyWordsModal>
    </>
  )
}

export default GameModal