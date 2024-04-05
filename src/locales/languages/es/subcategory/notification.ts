export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '¡Tu banco de palabras se está llenando 💪',
      message: '¡Sigue practicando para no perder ninguna moneda!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '¡Has descubierto 5 palabras 🥳',
      message: '¡No dejes que se te escapen!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '¡5 palabras nuevas traducidas!👏',
      message: 'Prueba tu sabiduría con palabras en el área de práctica con nuestra aplicación',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
  },
  }
}