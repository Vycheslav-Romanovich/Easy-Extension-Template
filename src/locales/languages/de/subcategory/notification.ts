export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'Benachrichtigungsereignis',
    options: {
      type: 'basic',
      title: 'Ihr Wortschatz füllt sich auf 💪',
      message: 'Üben Sie weiter, damit Sie keine Münzen verlieren!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'Benachrichtigungsereignis',
    options: {
      type: 'basic',
      title: 'Sie haben 5 Wörter entdeckt 🥳',
      message: 'Lassen Sie sie nicht entkommen!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'Benachrichtigungsereignis',
    options: {
      type: 'basic',
      title: '5 neue Wörter übersetzt! 👏',
      message: 'Testen Sie Ihr Wortwissen im Übungsbereich mit unserer App',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
}
