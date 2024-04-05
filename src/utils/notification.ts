import { notificationType } from "../constants/types"

export const showNotification = (data: notificationType): void => {

  chrome.runtime.sendMessage({
    component: data.typeNotification,
    notificationId: data.notificationId,
    options: {
      title: data.options.title,
      message: data.options.message,
      iconUrl: data.options.iconUrl,
      type: data.options.type
    }
  });
}
