export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Ваш банк слов пополняется 💪',
      message: 'Продолжайте тренироваться, чтобы не потерять монеты!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Вы узнали 5 слов 🥳',
      message: 'Не позвольте им ускользнуть!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Переведено 5 новых слов!👏',
      message: 'Проверьте свою словесную мудрость на практике с помощью нашего приложения',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
  },
  }
}
