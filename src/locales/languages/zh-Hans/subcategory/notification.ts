export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '你的单词库正在充实 💪',
      message: '保持练习，不要失去任何硬币！',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '你发现了5个单词 🥳',
      message: '不要让它们溜走！',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '翻译了5个新单词！👏',
      message: '在我们的应用中，在练习区域测试你的词汇智慧',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  },
};
