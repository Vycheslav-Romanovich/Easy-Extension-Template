import { combineReducers } from '@reduxjs/toolkit'
import settingsSlice from './settingsSlice'
import { getActionsMapping } from '../actionsMapping'

const rootReducer = combineReducers({
  settings: settingsSlice.reducer,
})

const slices = [settingsSlice]

const allActionsFromSlices = slices.flatMap(slice => Object.values(slice.actions))

export const mappings = getActionsMapping(allActionsFromSlices)

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer
