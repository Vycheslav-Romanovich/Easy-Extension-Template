import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { environment } from '../../../utils/environment'
import { User } from 'firebase/auth'
import { RootState } from '../../background/store/slices'


const AllPagesController: React.FC = () => {
  const dispatch = useDispatch()
  // eslint-disable-next-line
  const user = useSelector<RootState, User>((state) => state.auth.user)

  useEffect(() => {
    if (
      !user &&
      (window.location.origin === environment.website || window.location.origin === 'http://localhost:3000') &&
      (window.location.pathname === '/en/welcome/first-step' ||
        window.location.pathname === '/welcome/first-step' ||
        window.location.pathname === '/ru/welcome/first-step')
    ) {
      localStorage.removeItem('customToken')
    }
  }, [])

  // Синхронизация аккаунтов с веб-сайтом website -> extension
  useEffect(() => {
    if (
      !user &&
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
          chrome.runtime.sendMessage({ component: 'updateUserInfo', token: token })
          localStorage.removeItem('customToken')
          setTimeout(() => clearTimeout(timer), 1500)
        }
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [user])

  useEffect(() => {
    //remove account
    if (
      user &&
      (window.location.href.includes(environment.website) || window.location.href.includes('http://localhost:3000')) &&
      localStorage.getItem('removeAccount') === 'true'
    ) {
      // dispatch(deleteAccount())
      localStorage.removeItem('removeAccount')
    }
  }, [user])



  return (
    <>
    
    </>
  )
}

export default AllPagesController
