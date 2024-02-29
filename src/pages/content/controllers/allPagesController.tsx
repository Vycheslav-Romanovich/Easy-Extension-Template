import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { environment } from '../../../utils/environment'
import { RootState } from '../../background/store/slices'


const AllPagesController: React.FC = () => {
  const dispatch = useDispatch()
  const [previousUrl, setPreviousUrl] = useState('');

  const observer = new MutationObserver(function(mutations) {
    if(window.location.origin === environment.website || window.location.origin === 'http://localhost:3000'){
    if (location.href !== previousUrl) {
        setPreviousUrl(location.href);
      }
    }
  });
  const config = {subtree: true, childList: true};
  observer.observe(document, config);

  // Синхронизация аккаунтов с веб-сайтом website -> extension
  useEffect(() => {
    if (
      (window.location.origin === environment.website || window.location.origin === 'http://localhost:3000') &&
      (window.location.pathname === '/en/welcome/first-step' ||
        window.location.pathname === '/welcome/first-step' ||
        window.location.pathname === '/ru/welcome/first-step' ||
        window.location.pathname === '/ru/signin' ||
        window.location.pathname === '/signin' ||
        window.location.pathname === '/en/signin' ||
        window.location.pathname === '/ru/signup' ||
        window.location.pathname === '/signup' ||
        window.location.pathname === '/en/signup' ||
        window.location.pathname === '/ru/account/settings' ||
        window.location.pathname === '/en/account/settings' ||
        window.location.pathname === '/account/settings' ||
        window.location.pathname === '/en/welcome/second-step' ||
        window.location.pathname === '/welcome/second-step' ||
        window.location.pathname === '/ru/welcome/second-step' ||
        window.location.pathname === '/en/welcome/third-step' ||
        window.location.pathname === '/welcome/third-step' ||
        window.location.pathname === '/ru/welcome/third-step' ||
        window.location.pathname === '/en/welcome/second-step-abtest' ||
        window.location.pathname === '/welcome/second-step-abtest' ||
        window.location.pathname === '/ru/welcome/second-step-abtest')
    ) {
      const timer = setInterval(() => {
        const token = localStorage.getItem('customToken')
        if (token) {
          chrome.runtime.sendMessage({ component: 'INIT_FIREBASE', token: token })
          localStorage.removeItem('customToken')
          setTimeout(() => clearTimeout(timer), 1500)
        }
        if(token === null){
          clearTimeout(timer);
        }
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [previousUrl])


  return (
    <>
    
    </>
  )
}

export default AllPagesController
