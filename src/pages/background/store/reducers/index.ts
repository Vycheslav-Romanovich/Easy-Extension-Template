import { combineReducers } from 'redux'
import settingsReducer from './settingsReducer'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  settings: settingsReducer,
})

export default rootReducer
