import {
  DELETE_ACCOUNT,
  SIGN_OUT,
  UPDATE_USER_INFO,
  SET_PAID_SUBSCRIPTION,
  SET_FREE_DOUBLE_SUBS,
  SET_FREE_TRANSLATED,
  SET_LAST_TRANSLATED_WORD,
  SET_SUBSCRIPTION_DATA
} from '../../../../constants/constants'
import { actionsTypes } from '../actions/authActions'

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

export type InitialStateType = typeof initialState

export default (state = initialState, action: actionsTypes): InitialStateType => {

  switch (action.type) {
    case DELETE_ACCOUNT:
      return {
        ...state,
        user: null,
        errors: { ...state.errors, deleteaccount: action.payload.error },
      }
    case UPDATE_USER_INFO:
      return {
        ...state,
        user: action.payload.user,
        loading: false,
      }
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        errors: { ...state.errors, signout: action.payload.error },
      }
    case SET_PAID_SUBSCRIPTION:
      return {
        ...state,
        isPaidSubscription: action.payload.isPaidSubscription,
      }
    case SET_FREE_DOUBLE_SUBS:
      return {
        ...state,
        freeDoubleSubs: action.payload.freeDoubleSubs,
      }
    case SET_FREE_TRANSLATED:
      return {
        ...state,
        freeTranslated: action.payload.freeTranslated,
      }
    case SET_SUBSCRIPTION_DATA:
      return {
        ...state,
        paymentData: action.payload.paymentData,
      }
      case SET_LAST_TRANSLATED_WORD:
      return {
        ...state,
        lastTranslatedWord: action.payload.lastTranslatedWord,
      }
    default:
      return state
  }
}
