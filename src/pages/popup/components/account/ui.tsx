import React, { useEffect, useState } from 'react'
import Discoverer from '../../../../assets/icons/achievements/discoverer.svg'
import { Achievement } from '../achievement/Achievement'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../background/store/reducers'
import { User } from 'firebase/auth'
import { SettingOption } from './setting-option/settingOption'
import { Dropdown } from './setting-option/dropDown'
import { getLanguageName, interfacesLanguages, supportedLanguages } from '../../../../constants/supportedLanguages'
import { setInterfaceLang, setLearningLang, setLocalLang } from '../../../common/store/settingsActions'
import { getLinkToWebsite } from '../../../background/helpers/websiteLink'
import { useLanguageContext } from '../../../../context/LanguageContext'
import { ComeBack } from '../comeBack'
import { ConfirmBlock } from '../confirmBlock'
import { deleteAccount, signOutStore } from '../../../common/store/authActions'
import { ButtonUnderline } from '../../../common/components/buttonUnderline'
import { useTranslation } from '../../../../locales/localisation'
// import ga from '../../../../utils/ga'
import { sendAmplitudeEvent } from '../../../../utils/amplitude'
import Button from '../../../common/components/button'


export const Account: React.FC = () => {
  const dispatch = useDispatch()
  const { locale } = useLanguageContext()
  const strings = useTranslation()
  const menu = strings.popup.menu
  const user = useSelector<RootState, User>((state) => state.auth.user)
  const learningLang = useSelector<RootState, string>((state) => state.settings.learningLang)
  const localLang = useSelector<RootState, string>((state) => state.settings.localLang)
  const interfaceLang = useSelector<RootState, string>((state) => state.settings.interfaceLang)

  const [showAchievements, setShowAchievements] = useState<boolean>(false)
  const [showSignOut, setShowSignOut] = useState<boolean>(false)
  const [showDelete, setShowDelete] = useState<boolean>(false)
  const [isProgressShow, setIsProgressShow] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<string>('');
  const [imageFeedBack, setImageFeedBack] = useState('');

  const listFeedBackImages = {
    en: '../../../../assets/images/settings/Banner_EN.svg',
    ru: '../../../../assets/images/settings/Banner_RU.svg',
    de: '../../../../assets/images/settings/Banner_DE.svg',
    es: '../../../../assets/images/settings/Banner_ES.svg',
    pl: '../../../../assets/images/settings/Banner_PL.svg',
    tr: '../../../../assets/images/settings/Banner_TR.svg',
    ja: '../../../../assets/images/settings/Banner_JA.svg',
    ko: '../../../../assets/images/settings/Banner_KO.svg',
    uk: '../../../../assets/images/settings/Banner_UK.svg',
    fr: '../../../../assets/images/settings/Banner_FR.svg',
    zhHans: '../../../../assets/images/settings/Banner_zhHans.svg',
    zhHant: '../../../../assets/images/settings/Banner_zhHant.svg',
  };

  const handleChangelearningLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLearningLang(event.target.value))
    sendAmplitudeEvent('learn_language_change', {
      location: 'main',
      learn_language: getLanguageName(event.target.value, 'en')
    })
  }

  const handleChangelocalLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLocalLang(event.target.value))
    sendAmplitudeEvent('native_language_change', {
      location: 'main',
      native_language: getLanguageName(event.target.value, 'en')
    })
  }

  const handleChangeInterfaceLang = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setInterfaceLang(event.target.value))
  }

  const handleOpenFeedBack = () => {
    getLinkToWebsite(locale, 'account/support') 
    sendAmplitudeEvent('go_to_support')
  }

  const provider = user && user.providerData[0]?.providerId;

  const isLoginNotEmailProvider =
    provider?.includes('google') || provider?.includes('facebook') || provider?.includes('apple');


  // const checkLogin = () => {
  //   const user = getAuth().currentUser;
  //   const email = user?.email || '';

  //   if (!isLoginNotEmailProvider && user) {
  //     const credentials = EmailAuthProvider.credential(email, password);

  //     reauthenticateWithCredential(user ,credentials)
  //       .then(() => {
  //         dispatch(deleteAccount());
  //         sendAmplitudeEvent('delete_account')
  //       })
  //       .catch((error) => {
  //         console.error(error.code);
  //         if (error.code === 'auth/wrong-password') {
  //           setErrors(menu.errors.wrongPassword);
  //         } else if (error.code === 'auth/too-many-requests') {
  //           setErrors(menu.errors.accessTemporarilyDisabled);
  //         } else if (error.code === 'auth/user-not-found') {
  //           setErrors(menu.errors.userNotFound);
  //         } else if (error.code === 'auth/invalid-email') {
  //           setErrors(errors);
  //         } else {
  //           setErrors(errors);
  //         }
  //       });
  //     // ga('elangExtension.send', 'account-event', 'Account - Delete');
  //   } else {
  //     const authGoogleProvider = !!provider?.includes('google');
  //     const authFacebookProvider = !!provider?.includes('facebook');
  //     const authAppleProvider = !!provider?.includes('apple');

  //     if (authGoogleProvider) {
  //       reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider())
  //         .then(() => {
  //           dispatch(deleteAccount());
  //           sendAmplitudeEvent('delete_account')
  //         })
  //         .catch((error: any) => {
  //           console.error(error);
  //         });
  //     } else if (authFacebookProvider) {
  //       user?.reauthenticateWithPopup(new firebase.auth.FacebookAuthProvider())
  //         .then(() => {
  //           dispatch(deleteAccount());
  //           sendAmplitudeEvent('delete_account')
  //         })
  //         .catch((error: any) => {
  //           console.error(error);
  //         });
  //     } else if (authAppleProvider) {
  //       user?.reauthenticateWithPopup(new firebase.auth.OAuthProvider('apple.com'))
  //         .then(() => {
  //           dispatch(deleteAccount());
  //           sendAmplitudeEvent('delete_account')
  //         })
  //         .catch((error: any) => {
  //           console.error(error);
  //         });
  //     }
  //   }
  // }

  useEffect(()=>{  
    setImageFeedBack(Object.entries(listFeedBackImages).filter(([key]) => key === locale)[0][1])
  },[locale])

  return (
    <div className='min-h-[434px]'>
      {!showAchievements && !isProgressShow && !showSignOut && !showDelete
        ?
        <div className='flex h-[54px] justify-between items-center px-[46px]'>
          <h2 className='text-[18px] font-semibold text-gray-800'>{menu.menuItems.item1}</h2>
          <ButtonUnderline text={menu.account.edit} onClickHandler={() => {
            getLinkToWebsite(locale, 'account/settings')
            sendAmplitudeEvent('go_to_account')
          }} />
        </div>
        :
        <ComeBack onClickHandler={() => {
          setShowAchievements(false)
          setIsProgressShow(false)
          setShowSignOut(false)
          setShowDelete(false)
        }} />
      }


      {!showAchievements && !isProgressShow && !showSignOut && !showDelete &&
        <div className='flex flex-col gap-[6px]'>
          <section className='flex flex-col min-h-[380px] bg-[#FFFFFF] px-[29px] py-[26px] gap-[26px]'>
            <div className='flex flex-col justify-between gap-[24px]'>
              <SettingOption
                text={menu.account.iLearn}
                options={
                  <Dropdown
                    value={learningLang}
                    onChange={handleChangelearningLang}
                    options={supportedLanguages}
                  />
                }
              />

              <SettingOption
                text={menu.account.translateInto}
                options={
                  <Dropdown
                    value={localLang}
                    onChange={handleChangelocalLang}
                    options={supportedLanguages}
                  />
                }
              />

              <SettingOption
                text={menu.account.interfaceLanguage}
                options={
                  <Dropdown
                    value={interfaceLang}
                    onChange={handleChangeInterfaceLang}
                    options={interfacesLanguages}
                  />
                }
              />
            </div>
            <div>
            <img src={imageFeedBack} alt="feedBackImage" />
              <Button  
                type="primary"
                className="rounded min-w-[245px] max-w-[316px] absolute bottom-[150px] left-[43px]"
                text={menu.account.writeToUs}
                onClick={handleOpenFeedBack}
              />
            </div>
          </section>
        </div>
      }

      {showAchievements &&
        <div className='flex flex-col bg-[#FFFFFF] px-[46px] py-[16px] gap-[16px]'>
          <h2 className='text-[16px] font-bold text-gray-800'>{menu.achievements.title}</h2>

          <div className='flex justify-between'>
            <Achievement title={menu.achievements.discoverer} ImageIco={Discoverer} />
            <Achievement title={menu.achievements.netflexer} ImageIco={Discoverer} />
            <Achievement title={menu.achievements.designer} ImageIco={Discoverer} />
            <Achievement title={menu.achievements.pioneer} ImageIco={Discoverer} />
          </div>
        </div>
      }

      {/* {showSignOut &&
        <ConfirmBlock title={menu.account.signOut}
                      confirmText={menu.account.signOut}
                      text={menu.account.sureLogOut}
                      onConfirm={() => {
                        dispatch(signOut());
                      }}
                      onBack={() => {
                        setShowSignOut(false)
                      }}
        />
      }

      {showDelete &&
        <ConfirmBlock title={menu.account.deleteAccount}
                      confirmText={menu.account.deleteAccount}
                      text={menu.account.confirmDelete}
                      errors={errors}
                      isLoginNotEmailProvider={isLoginNotEmailProvider}
                      setPassword={setPassword}
                      setErrors={setErrors}
                      onConfirm={checkLogin}
                      onBack={() => {
                        setShowDelete(false)
                      }}
        />
      } */}
    </div>
  )
}
