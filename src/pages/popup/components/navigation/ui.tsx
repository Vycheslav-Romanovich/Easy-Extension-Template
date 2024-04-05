import React from 'react'
// import ga from '../../../../utils/ga'
import ProfileIcon from '../../../../assets/icons/menu/profile.svg'
import DictionaryIcon from '../../../../assets/icons/menu/dictionary.svg'
import PractiseIcon from '../../../../assets/icons/menu/practise.svg'
import LightningIcon from '../../../../assets/icons/menu/lightning.svg'
import { useTranslation } from '../../../../locales/localisation'
import { useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { WordVocabularyElement } from '../../../../constants/types'
import { NavigationTab } from './navigationTab/navigatuinTab'
import { ActiveNavigation } from '../menu'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'

interface Props {
  setActive: (active: ActiveNavigation) => void;
  active: ActiveNavigation;
}

export const Navigation: React.FC<Props> = ({active, setActive}) => {
  const strings = useTranslation()
  const menuItems = strings.popup.menu.menuItems
  const vocabularyWords = useSelector<RootState, Array<WordVocabularyElement>>((state) => state.vocabulary.vocabularyWords)
  const isFinishedPractice = useSelector<RootState, boolean>((state) => state.video.isFinishedPractice)
  const isOpenPractise = useSelector<RootState, boolean>((state) => state.settings.isOpenPractise)
  const isPaidSubscription = useSelector<RootState, boolean>((state) => state.auth.isPaidSubscription)

  const goToPractise = () => {
    const event = {
      category: 'Training',
      action: 'TrainingAccept',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  const hiddenPractiseModal = () => {
    goToPractise()
    chrome.storage.sync.set({ showPractise: true })
    const event = {
      category: 'Training',
      action: 'TrainingHide',
    }
    chrome.runtime.sendMessage({ component: 'sendAnalyticsEvent', event })
  }

  return (
    <div className="flex w-full bg-gray-100 border-t-[1px] border-gray-960"
    style={{display: !isOpenPractise? 'none' : 'flex'}}>
      <NavigationTab
        title={menuItems.item1}
        active={active === 'Account'}
        onClick={() => {
          // ga('elangExtension.send', 'event', 'Account', 'Open', 'From Bar')
          setActive('Account')
        }}
        image={<ProfileIcon />}
      />

      <NavigationTab
        title={menuItems.item2}
        active={active === 'Vocabulary'}
        onClick={() => {
          // ga('elangExtension.send', 'event', 'Vocabulary', 'Open', 'From Bar')
          setActive('Vocabulary')
        }}
        image={<DictionaryIcon />}
      />

      <NavigationTab
        title={menuItems.item7}
        active={active === 'Products'}
        onClick={() => {
          // ga('elangExtension.send', 'event', 'Products', 'Open', 'From Bar')
          setActive('Products')
          hiddenPractiseModal()
          sendAmplitudeEvent('go_to_our_products', { location: 'main' })
        }}
        image={<PractiseIcon />}
      />

      {isPaidSubscription ? null :
      <NavigationTab
        title={menuItems.item4}
        active={active === 'Premium'}
        onClick={() => {
          // ga('elangExtension.send', 'event', 'Plans', 'OpenSubscriptionMenu', 'From Bar')
          setActive('Premium')
        }}
        image={<LightningIcon />}
      />}
    </div>
  )
}
