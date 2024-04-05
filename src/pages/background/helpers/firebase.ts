import { getAuth, User} from 'firebase/auth'
import { getDatabase, ref, onValue, get, update, remove } from 'firebase/database'
import { SettingsAccountType, WordHistoryElement, WordVocabularyElement } from '../../../constants/types'
import { app } from '..'

export const processedString = (data: string): string => {
  const regExp = /[.,/#!$%^&*;:{}\\[\]=\-_`~()]/g
  return data?.replace(regExp, '').replace(/\s/g, '').toLocaleLowerCase()
}

export const getSettingsAccount = async (): Promise<SettingsAccountType> => {
  const currentUser = getAuth(app).currentUser as User
  const path = `users/${currentUser.uid}/settings`
  const database = getDatabase();
  const dbRef = ref(database, path)
  const data: Promise<SettingsAccountType> = 
  get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const res = snapshot.val()
        if (res === null) return {}

        return res
      } else return {}
    })
    .catch((error) => {
      console.error(error)
    })

  return data
}

export const observerDB = (callback: (data: any) => void, path?: string) => {
  const currentUser = getAuth(app).currentUser as User;
  const database = getDatabase();
  const dbRef = ref(database,`users/${currentUser.uid}${path ? '/' + path : ''}`)

  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val()
    callback(data)
  })

  return unsubscribe
}

export const setWithButton = (uid: string) => {
  const database = getDatabase();
  update(ref(database,`users/${uid}/settings`),{wayToOpenTextTranslation: 'withButton'});
}

export const updateHistoryWord = async (word: WordHistoryElement, uid: string) => {
  const database = getDatabase();
  await update(ref(database, `users/${uid}/translateHistory/${processedString(word.word)}`), {...word,
    isPracticeWord: true});
}

export const updateVocabularyWord = async (word: WordVocabularyElement, uid: string, isPracticeWord: boolean) => {
  const database = getDatabase();
  await get(ref(database,`users/${uid}/vocabulary/${processedString(word.word)}`))
  .then(async (snap) => {
    if (!snap.val()) {
      throw new Error('no word to update')
    }

    if (snap.val() && processedString(snap.val().word) === processedString(word.word)) {
      await update(ref(database,`users/${uid}/vocabulary/${processedString(word.word)}`),{ isPracticeWord: isPracticeWord })
    }
  })
}

export const deleteWordFromHistory = (word: string, uid: string): void => {
  const database = getDatabase();
  remove(ref(database,`users/${uid}/translateHistory/${processedString(word)}`))
}

export const deleteWordFromVocabulary = async (word: string, uid: string): Promise<any> => {
  const database = getDatabase();
  return remove(ref(database,`users/${uid}/vocabulary/${processedString(word)}`))
}

export const setTermsCount = (termsCount: number, uid: string) => {
  const database = getDatabase();
  update(ref(database,`users/${uid}/practiceInfo`),{ termsCountDaily: termsCount })
}

export const setLastPractice = (lastPracticed: number, uid: string) => {
  const database = getDatabase();
  update(ref(database,`users/${uid}/practiceInfo`),{ lastPracticed: lastPracticed })
}

export const setStreak = (streak: number, uid: string) => {
  const database = getDatabase();
  update(ref(database,`users/${uid}/practiceInfo`),{ streak: streak  })
}
