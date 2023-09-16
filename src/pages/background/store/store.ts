// @ts-ignore
import { createBackgroundStore } from 'redux-webext'
// @ts-ignore
import createChromeStorage from 'redux-persist-chrome-storage'
import { persistReducer, persistStore } from 'redux-persist'
import reducer, { mappings } from './slices'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

const storage = createChromeStorage(chrome, 'sync')

const reducerConfig = {
  key: 'root',
  storage: storage,
}

const persistedRootReducer = persistReducer(reducerConfig, reducer)

// Using configureStore from RTK
const store1 = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware({
    thunk: true,
    serializableCheck: false,
  }),
})

export const store = createBackgroundStore({
  store: store1,
  actions: mappings,
})

export const persistor = persistStore(store1)
