// @ts-ignore
import { createBackgroundStore } from 'redux-webext'
// @ts-ignore
import createChromeStorage from 'redux-persist-chrome-storage'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import reducer from './reducers'
import thunkMiddleware from 'redux-thunk'
import { SET_DARK_MODE, SET_LANGUAGE } from '../../../constants/constants'
import { setDarkMode, setLanguage } from './actions/settingsActions'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

// Redux persist
const storage = createChromeStorage(chrome, 'sync')

const settingsReducerConfig = {
  key: 'root',
  storage: storage,
}

const persistedRootReducer = persistReducer(settingsReducerConfig, reducer)

// Redux Web Ext
const store1 = createStoreWithMiddleware(persistedRootReducer)

export const store = createBackgroundStore({
  store: store1,
  actions: {
    [SET_LANGUAGE]: setLanguage,
    [SET_DARK_MODE]: setDarkMode,
  },
})


// @ts-ignore
export const persistor = persistStore(store1)
