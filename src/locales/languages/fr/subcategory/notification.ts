export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Votre banque de mots se remplit 💪',
      message: 'Continuez à pratiquer pour ne pas perdre de pièces !',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Vous avez découvert 5 mots 🥳',
      message: 'Ne les laissez pas s\'échapper !',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '5 nouveaux mots traduits ! 👏',
      message: 'Testez votre sagesse des mots dans la zone de pratique avec notre application',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
}

