import browser from "webextension-polyfill";

import "bootstrap/dist/css/bootstrap.min.css";
import "./panel.css";

import {BADGE_BACKGROUND_COLOR_BY_TIMER_TYPE, RUNTIME_ACTION, TIMER_TYPE} from "../utils/constants";
import {
  getMillisecondsToTimeText,
  getSecondsInMilliseconds, getTimerStatusText,
  getTimerTypeMilliseconds,
} from "../utils/utils";
import Settings from "../utils/settings";

export default class Panel {
  constructor() {
    this.settings = new Settings();
    this.currentTimeText = document.getElementById("current-time-text");
    this.currentTimerStatus = document.getElementById("current-timer-status");

    this.dismissButton = document.getElementById("dismiss-button");

    this.timer = {};

    browser.runtime
        .sendMessage({
          action: RUNTIME_ACTION.GET_TIMER_TYPE,
        })
        .then((type) => {
          if (type) {
            return Promise.all([type,
              browser.runtime
                  .sendMessage({
                    action: RUNTIME_ACTION.GET_TIMER_SCHEDULED_TIME,
                  })
            ]);
          }
        }).then((results) => {
      if (results !== undefined) {
        console.log(results[0]);
        if (results.length === 2) {
          this.setDisplayTimer(results[0], results[1] - Date.now());
        } else if (results.length === 1) {
          this.setDisplayTimer(results[0], null);
        } else {
          this.setDisplayTimer(null, null);
        }
      }
    });

    this.setEventListeners();
  }

  setEventListeners() {
    document.getElementById("tomato-button").addEventListener("click", () => {
      this.setTimer(TIMER_TYPE.TOMATO);
      this.setBackgroundTimer(TIMER_TYPE.TOMATO);
    });

    document
      .getElementById("short-break-button")
      .addEventListener("click", () => {
        this.setTimer(TIMER_TYPE.SHORT_BREAK);
        this.setBackgroundTimer(TIMER_TYPE.SHORT_BREAK);
      });

    document
      .getElementById("long-break-button")
      .addEventListener("click", () => {
        this.setTimer(TIMER_TYPE.LONG_BREAK);
        this.setBackgroundTimer(TIMER_TYPE.LONG_BREAK);
      });

    document.getElementById("reset-button").addEventListener("click", () => {
      this.resetTimer();
      this.resetBackgroundTimer();
    });

    this.dismissButton.addEventListener("click", () => {
      this.resetTimer();
      this.resetBackgroundTimer();
      this.stopNotificationSound();
    });

    document.getElementById("stats-link").addEventListener("click", () => {
      browser.tabs.create({ url: "/stats/stats.html" });
    });
  }

  resetTimer() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }

    this.timer = {
      interval: null,
      timeLeft: 0,
    };

    this.setCurrentTimeText(0);
    this.setCurrentTimerStatus("")
  }

  resetTimerToRing() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }

    this.timer = {
      interval: setInterval(() => {
        this.setCurrentTimerStatus(TIMER_TYPE.RINGING)
        this.showDismissButton();
      }, getSecondsInMilliseconds(1)),
      timeLeft: 0,
    };

    this.setCurrentTimerStatus(TIMER_TYPE.RINGING)
    this.showDismissButton();
  }


  getTimer() {
    return this.timer;
  }

  setTimer(type) {
    this.settings.getSettings().then((settings) => {
      const milliseconds = getTimerTypeMilliseconds(type, settings);
      this.setDisplayTimer(type, milliseconds);
    });
  }

  setDisplayTimer(type, milliseconds) {
    if (type === TIMER_TYPE.RINGING) {
      this.setCurrentTimerStatus(type)
      this.showDismissButton();
      this.resetTimerToRing();
    } else {
      this.resetTimer();
      this.setCurrentTimeText(milliseconds);
      this.setCurrentTimerStatus(type)

      this.timer = {
        interval: setInterval(() => {
          const timer = this.getTimer();

          timer.timeLeft -= getSecondsInMilliseconds(1);
          this.setCurrentTimeText(timer.timeLeft);
          this.setCurrentTimerStatus(type);

          if (timer.timeLeft <= 0) {
            this.resetTimerToRing();
          }
        }, getSecondsInMilliseconds(1)),
        timeLeft: milliseconds,
      };
    }
  }

  setCurrentTimerStatus(type) {
    this.currentTimerStatus.textContent = getTimerStatusText(type);
    this.currentTimerStatus.style.color = BADGE_BACKGROUND_COLOR_BY_TIMER_TYPE[type] === undefined ? "black" : BADGE_BACKGROUND_COLOR_BY_TIMER_TYPE[type];
  }

  setCurrentTimeText(milliseconds) {
    this.currentTimeText.textContent = getMillisecondsToTimeText(milliseconds);
  }

  showDismissButton() {
    this.dismissButton.style.display = "block"
  }

  resetBackgroundTimer() {
    browser.runtime.sendMessage({
      action: RUNTIME_ACTION.RESET_TIMER,
    });
  }

  setBackgroundTimer(type) {
    browser.runtime.sendMessage({
      action: RUNTIME_ACTION.SET_TIMER,
      data: {
        type,
      },
    });
  }

  stopNotificationSound() {
    browser.runtime.sendMessage({
      action: RUNTIME_ACTION.STOP_NOTIFICATION_SOUND,
    });
  }

}

document.addEventListener("DOMContentLoaded", () => {
  new Panel();
});
