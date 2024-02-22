import { combineReducers } from '@reduxjs/toolkit'
import settingsSlice from './settingsSlice'
import authSlice from './authSlice'
import { getActionsMapping } from '../actionsMapping'

const rootReducer = combineReducers({
  settings: settingsSlice.reducer,
  auth: authSlice.reducer,
})

const slices = [settingsSlice, authSlice]

const allActionsFromSlices = slices.flatMap(slice => Object.values(slice.actions))

export const mappings = getActionsMapping(allActionsFromSlices)

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer
