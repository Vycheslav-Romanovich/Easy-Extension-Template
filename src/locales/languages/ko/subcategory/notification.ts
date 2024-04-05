export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '당신의 단어 은행이 채워지고 있어요 💪',
      message: '동전을 잃지 않도록 계속 연습하세요!',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '5개의 단어를 발견했어요 🥳',
      message: '그들이 떨어지지 않도록 주의하세요!',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '새로운 5개의 단어가 번역되었어요! 👏',
      message: '우리 어플에서 실력을 테스트하세요.',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
}
