export const notification = {
  1: {
    notificationId: 'fire',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: 'あなたの単語バンクが充実しています 💪',
      message: '練習を続けて、コインを失わないようにしましょう！',
      iconUrl: '/assets/icons/notifications/fire.svg',
    },
  },
  2: {
    notificationId: 'cat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '5つの単語を発見しました 🥳',
      message: 'それらを見逃さないようにしましょう！',
      iconUrl: '/assets/icons/notifications/cat.svg',
    },
  },
  3: {
    notificationId: 'progressCat',
    typeNotification: 'notificationEvent',
    options: {
      type: 'basic',
      title: '5つの新しい単語を翻訳しました！👏',
      message: 'アプリの練習エリアで単語の知識を試してみてください',
      iconUrl: '/assets/icons/notifications/catProgress.svg',
    },
  }
}

