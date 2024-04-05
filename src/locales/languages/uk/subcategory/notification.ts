export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Ваш словник заповнюється 💪',
      message: 'Продовжуйте вправлятися, щоб не втрачати жодної монети!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Ви відкрили 5 слів 🥳',
      message: 'Не дайте їм втекти!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Перекладено 5 нових слів!👏',
      message: 'Перевірте свою мудрість слів в області практики з нашим додатком',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
};

