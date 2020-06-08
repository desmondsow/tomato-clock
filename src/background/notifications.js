import browser from "webextension-polyfill";

import { NOTIFICATION_ID, TIMER_TYPE } from "../utils/constants";

export default class Notifications {
  constructor(settings) {
    this.settings = settings;

    this.notificationSound = new Audio(
      "/assets/sounds/Portal2_sfx_button_positive.mp3"
    );

    this.setListeners();
  }

  createBrowserNotification(timerType) {
    let message = "";

    switch (timerType) {
      case TIMER_TYPE.TOMATO:
        message = "Your Tomato timer is done! It is time to take a short break.";
        break;
      case TIMER_TYPE.SHORT_BREAK:
        message = "Your short break is done! It is time to work.";
        break;
      case TIMER_TYPE.LONG_BREAK:
        message = "Your long break is done! It is time to work.";
        break;
      default:
        message = "Your timer is done!";
        break;
    }

    browser.notifications.create(NOTIFICATION_ID, {
      type: "basic",
      iconUrl: "/assets/images/tomato-icon-64.png",
      title: "Tomato Clock",
      message,
    });

    this.settings.getSettings().then((settings) => {
      if (settings.isNotificationSoundEnabled) {
        this.playNotificationSound()
      }
    });
  }

  playNotificationSound() {
    this.notificationSound.play()
  }

  stopNotificationSound() {
    this.notificationSound.pause()
  }

  setListeners() {
    browser.notifications.onClicked.addListener((notificationId) => {
      if (notificationId === NOTIFICATION_ID) {
        browser.notifications.clear(notificationId);
      }
    });
  }
}
