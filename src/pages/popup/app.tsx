import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../background/store/reducers'
import Main from './pages/main'
import ConsiderSigningUpCard from './components/considerSigningUpCard'
import firebase from 'firebase/auth'

const App = () => {
  const user = useSelector<RootState, firebase.User>((state) => state.auth.user)

  return <div style={{width: '402px', maxHeight: '600px'}} id="elangExtension">{!user || (user && (!user.uid || user.isAnonymous)) ? <ConsiderSigningUpCard /> : <Main />}</div>
}

export default App
