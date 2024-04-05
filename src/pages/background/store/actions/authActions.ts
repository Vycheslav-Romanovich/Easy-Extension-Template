import {
  DELETE_ACCOUNT,
  SIGN_OUT,
  UPDATE_USER_INFO,
  SET_PAID_SUBSCRIPTION,
  SET_FREE_DOUBLE_SUBS,
  SET_FREE_TRANSLATED,
  SET_SUBSCRIPTION_DATA,
  SET_LEARNING_LANG,
  SET_LOCAL_LANG,
  CHECK_MYWORDS_INSTALL,
  SET_LAST_TRANSLATED_WORD,
} from '../../../../constants/constants'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers'
import { app } from '../../index'
import { getAuth, signOut, User } from "firebase/auth"
import { getDatabase, ref, onValue, update } from 'firebase/database'
import { IHistoryTranslatedWords } from '../../../../constants/types'
import { auth } from '../../index'
// import ga from '../../../../utils/ga'
import { IPaymentData } from '../../../../constants/types'
import { setCheckListDate } from '../../helpers/checkListSetUp'
import { processedString } from '../../helpers/firebase'

export type actionsTypes =
  | SignOutActionType
  | UpdateUserInfoActionType
  | DeleteAccountActionType
  | setPaidSubscriptionType
  | freeDoubleSubsType
  | freeTranslatedType
  | paidSubscriptionDataType
  | setLearningLangActionType
  | setLocalLangActionType
  | checkMyWordsInstallAccountType
  | lastTranslatedWordType
type ThunkType = ThunkAction<Promise<void>, RootState, unknown, actionsTypes>

// Sign Out
type SignOutActionType = {
  type: typeof SIGN_OUT
  payload: {
    error: string | null
  }
}

export const signOutStore = (isSignOutFromWeb?: boolean): ThunkType => {
  return async (dispatch) => {
    const user = getAuth(app).currentUser as User
    const database = getDatabase();
    if (isSignOutFromWeb) {
      update(ref(database, `users/${user.uid}/popUpSync`),{ isSignOutFromWeb: false})
    } else {
      update(ref(database, `users/${user.uid}/popUpSync`),{ isSignOutFromWeb: true})
    }
    signOut(auth)
      .then(() => {
        dispatch({ type: SIGN_OUT, payload: { error: 'success' } })
      })
      .catch((error: any) => {
        console.error(error)
        dispatch({ type: SIGN_OUT, payload: { error: error.code } })
      })
  }
}

// Update User Info
type UpdateUserInfoActionType = {
  type: typeof UPDATE_USER_INFO
  payload: {
    user: User
  }
}

type setLearningLangActionType = {
  type: typeof SET_LEARNING_LANG
  payload: { learningLang: string }
}

type setLocalLangActionType = {
  type: typeof SET_LOCAL_LANG
  payload: { localLang: string }
}

type checkMyWordsInstallAccountType = {
  type: typeof CHECK_MYWORDS_INSTALL
  payload: { isGameInstall: boolean }
}

export const updateUserInfo = (): ThunkType => {
  return async (dispatch) => {
    const user = getAuth(app).currentUser as User
    dispatch({ type: UPDATE_USER_INFO, payload: { user: user } })

    if (user) {
      // ga('elangExtension.set', 'dimension2', 'Registered');
      setCheckListDate('account');

      checkGameInstall(user.uid, dispatch);

      chrome.storage.local.get(['translatedHistory'], (result) => {
        if (result.translatedHistory) {
          const obj = {}
          result.translatedHistory.forEach((element: IHistoryTranslatedWords) => {
            (obj as any)[processedString(element.word)] = element
          });
          const database = getDatabase();
           update(ref(database, `users/${user.uid}/translateHistory`), obj)
          .then(() => {
            chrome.storage.local.set({
              translatedHistory: [],
            })
          });
        }
      });
    }

    if (!user) {
      chrome.storage.sync.get(['elangLaguagesPair'], (settings) => {
        if (Object.keys(settings).length !== 0) {
          const params = settings.elangLaguagesPair
          dispatch({ type: SET_LOCAL_LANG, payload: { localLang: params.localLang } })
          dispatch({ type: SET_LEARNING_LANG, payload: { learningLang: params.learningLang } })
        }
      });

      // ga('elangExtension.set', 'dimension2', 'Unregistered');
    }
  }
}

const checkGameInstall = (uid: string, dispatch: any) => {
  const database = getDatabase();
      const dbRef = ref(database, `users/${uid}${'/paidSubscription'}`)
      onValue(dbRef, (snapshot) => {
      const { feedback } = snapshot.val()
      feedback
        ? dispatch({ type: CHECK_MYWORDS_INSTALL, payload: { isGameInstall: feedback } })
        : dispatch({ type: CHECK_MYWORDS_INSTALL, payload: { isGameInstall: false } })
    })
}

// Update User Info
type DeleteAccountActionType = {
  type: typeof DELETE_ACCOUNT
  payload: {
    error: null | string
  }
}

export const deleteAccount = (): ThunkType => {
  return async (dispatch) => {
    const user = getAuth(app).currentUser as User
    const database = getDatabase();
      update(ref(database, `users/${user.uid}/popUpSync`),{ isDeleteAccountFromPopup: true})
      .then(() => {
        dispatch({ type: DELETE_ACCOUNT, payload: { error: null } })
      })
      .catch((error: any) => {
        console.error(error)
        dispatch({ type: DELETE_ACCOUNT, payload: { error: error.code } })
      })
  }
}

type setPaidSubscriptionType = {
  type: typeof SET_PAID_SUBSCRIPTION
  payload: {
    isPaidSubscription: boolean
  }
}

export const setPaidSubscription = (isPaidSubscription: boolean): ThunkType => {
  return async (dispatch) => {
    const user = getAuth(app).currentUser as User
    if (!user) {
      // ga('elangExtension.set', 'dimension3', 'Free')
    }
    dispatch({ type: SET_PAID_SUBSCRIPTION, payload: { isPaidSubscription } })
  }
}

type paidSubscriptionDataType = {
  type: typeof SET_SUBSCRIPTION_DATA
  payload: { paymentData: IPaymentData }
}

export const setPaidSubscriptionData = (paymentData: IPaymentData): ThunkType => {
  return async (dispatch) => {
    chrome.storage.sync.get(['isPaidSuccess'], (result) => {
      if (!result.isPaidSuccess && paymentData?.subscriptionType) {
        // ga('elangExtension.send', 'event', 'Account', 'SubscriptionPaid', paymentData?.subscriptionType)
        chrome.storage.sync.set({ isPaidSuccess: true })
      }
    })

    dispatch({ type: SET_SUBSCRIPTION_DATA, payload: { paymentData: paymentData } })

    if (paymentData?.chargeDate > Date.parse(new Date().toString())) {
      dispatch({ type: SET_PAID_SUBSCRIPTION, payload: { isPaidSubscription: true } })
      paymentData?.isTrialPeriod === '1' 
      // && ga('elangExtension.set', 'dimension3', 'Trial')
      paymentData?.isTrialPeriod === '0'
      // && ga('elangExtension.set', 'dimension3', 'Premium')
      // ga('elangExtension.set', 'dimension1', 'No limit')
    } else {
      dispatch({ type: SET_PAID_SUBSCRIPTION, payload: { isPaidSubscription: false } })
      // ga('elangExtension.set', 'dimension3', 'Free')
    }
  }
}

type freeDoubleSubs = {
  freeDoubleSubs: boolean
}

type freeDoubleSubsType = {
  type: typeof SET_FREE_DOUBLE_SUBS
  payload: {
    freeDoubleSubs: boolean
  }
}

export const setFreeDoubleSubs = ({ freeDoubleSubs }: freeDoubleSubs): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_FREE_DOUBLE_SUBS, payload: { freeDoubleSubs: freeDoubleSubs } })
  }
}

type freeTranslated = {
  freeTranslated: boolean
}

type freeTranslatedType = {
  type: typeof SET_FREE_TRANSLATED
  payload: {
    freeTranslated: boolean
  }
}

export const setFreeTranslated = ({ freeTranslated }: freeTranslated): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_FREE_TRANSLATED, payload: { freeTranslated: freeTranslated } })
  }
}

type lastTranslatedWord = {
  lastTranslatedWord: string
}

type lastTranslatedWordType = {
  type: typeof SET_LAST_TRANSLATED_WORD
  payload: {
    lastTranslatedWord: string
  }
}

export const setLastTranslatedWord = ({ lastTranslatedWord }: lastTranslatedWord): ThunkType => {
  return async (dispatch) => {
    dispatch({ type: SET_LAST_TRANSLATED_WORD, payload: { lastTranslatedWord: lastTranslatedWord } })
  }
}