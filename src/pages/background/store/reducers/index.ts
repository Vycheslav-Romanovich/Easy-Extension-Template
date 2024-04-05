import { combineReducers } from 'redux'
import authReducer from './authReducer'
import videoReducer from './videoReducer'
import settingsReducer from './settingsReducer'
import vocabularyReducer from './vocabularyReducer'
import { actionsTypes } from '../actions/authActions'

export type RootState = ReturnType<typeof rootReducer>

const appReducer = combineReducers({
  auth: authReducer,
  video: videoReducer,
  settings: settingsReducer,
  vocabulary: vocabularyReducer,
})
//eslint-disable-next-line
const rootReducer = (state: any, action: actionsTypes) => {
  return appReducer(state, action)
}

export default rootReducer
