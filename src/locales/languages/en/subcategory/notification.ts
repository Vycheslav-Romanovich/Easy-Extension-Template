export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Your word bank is filling up 💪',
      message: 'Keep practicing so you don`t lose any coins!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'You`ve discovered 5 words 🥳',
      message: 'Don`t let them slip away!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '5 new words translated!👏',
      message: 'Test your word wisdom in the practice area with our app',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
  },
  }
}
