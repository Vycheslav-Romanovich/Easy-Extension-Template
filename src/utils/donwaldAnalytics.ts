import { app } from '../pages/background'

// export const copyUsers = () => {
//   return app
//     .database()
//     .ref(`users`)
//     .once('value')
//     .then(pushToNewCollection)
// }
//
// const pushToNewCollection = (res: any) => {
//   app
//     .database()
//     .ref('userAnalytics')
//     .set(res.val()).then(() => {console.log('copy')})
// }

// export const parseUsers = () => {
//   if (app.database().ref('users')) {
//     app
//       .database()
//       .ref('users')
//       .once('value')
//       .then((res) => {
//         const allUsers = []
//         const primeUsers = []
//         const values = res.val()
//         const result = Object
//           .entries(values)
//           .map(entry => ({[entry[0]]: entry[1]}))
//         for (let i = 0; i < result.length; i++) {

//           for (const key in result[i]) {
//             if (result[i][key].paidSubscription) {
//               primeUsers.push(`${result[i][key].settings?.learningLang} - ${result[i][key].settings?.localLang}`)
//             }
//             if (result[i][key]) {
//               allUsers.push(`${result[i][key].settings?.learningLang} - ${result[i][key].settings?.localLang}`)
//             }
//           }
//         }

//         const allUs = {}
//         allUsers.forEach(el => {
//           if (allUs[el]) {
//             allUs[el] += 1
//           } else {
//             allUs[el] = 1
//           }
//         })

//         const primeUse = {}
//         primeUsers.forEach(el => {
//           if (primeUse[el]) {
//             primeUse[el] += 1
//           } else {
//             primeUse[el] = 1
//           }
//         })

//         console.log('primeUsers\n', `Number of users: ${primeUsers.length}\n`, primeUse)
//         console.log('allUsers\n', `Number of users: ${allUsers.length}\n`, allUs)
//       })
//   }
//   return
// }

// export const removeUsersAnalytics = () => {
//   return app
//     .database()
//     .ref('userAnalytics')
//     .remove()
//     .then(() => {console.log('remove done!')})
// }

// Записываем ключю всех пользователей в массив
// const allUsers: string[] = []
// const getUser = app
//   .database()
//   .ref('users')
//   .once('value')
//   .then((res) => {
//     const values = res.val()
//     const result = Object
//       .entries(values)
//       .map(entry => ({[entry[0]]: entry[1]}))
//
//     for (let i = 0; i < result.length; i++) {
//       for (const key in result[i]) {
//         allUsers.push(key)
//       }
//     }
//   })
//Можем удалить любое поле у всех пользователей
// export const removeTranslateHistory = () => {
//   console.log('allUsers', allUsers)
//   console.log('getUser', getUser)
//   const removeHistory = allUsers.map((item: string) => {
//     app
//       .database()
//       .ref(`users/${item}/translateHistory`)
//       .remove()
//       .then(() => {console.log('remove done!')})
//   })
//   return removeHistory
// }

// window.copyUser = copyUsers
// window.parseUsers = parseUsers
// window.removeTranslateHistory = removeTranslateHistory
// window.removeUsersAnalytics = removeUsersAnalytics

// Для вызова в консоли использовать:
// Если запуск будет с dev ветки, нужно изменить в 'src/pages/background/index.ts' c let firebaseConfig = firebaseConfigDev на let firebaseConfig = firebaseConfigProd
// Email: sfdsf@gmail.com
// Password: 123456

