import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null as any,
  paymentData: null as any,
  loading: true as boolean,
  isPaidSubscription: false,
  freeDoubleSubs: true,
  freeTranslated: true,
  lastTranslatedWord: '' as string,
  errors: {
    emailRecovery: null as string | null,
    signup: null as string | null,
    signin: null as string | null,
    signout: null as string | null,
    deleteaccount: null as string | null,
    updatePassword: null as string | null,
  },
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { updateUserInfo } = authSlice.actions;

export default authSlice;
