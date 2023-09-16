import { DarkModeType } from '../../../../constants/types'
import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  language: chrome.i18n.getMessage('locale_code') ?? 'en',
  darkMode: DarkModeType.asSystem as DarkModeType,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      chrome.runtime.sendMessage({
        msg: 'language_update',
        data: {
          language: action.payload.language,
        },
      });
      state.language = action.payload.language;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload.darkMode;
    },
  },
});

export const { setLanguage, setDarkMode } = settingsSlice.actions;

export default settingsSlice;
