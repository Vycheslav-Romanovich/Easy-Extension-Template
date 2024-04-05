export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Twoje słówka rosną w siłę 💪',
      message: 'Ćwicz dalej, aby nie stracić żadnych monet!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Odkryłeś 5 słówek 🥳',
      message: 'Nie pozwól, aby uciekły!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'Przetłumaczyłeś 5 nowych słówek!👏',
      message: 'Sprawdź swoją mądrość słownikową w obszarze ćwiczeń za pomocą naszej aplikacji',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
}
