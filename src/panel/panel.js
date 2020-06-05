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

    this.tomatoButton = document.getElementById("tomato-button");
    this.shortBreakButton = document.getElementById("short-break-button");
    this.longBreakButton = document.getElementById("long-break-button");
    this.resetButton = document.getElementById("reset-button");
    this.dismissButton = document.getElementById("dismiss-button");

    this.statsLink = document.getElementById("stats-link");

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
    this.tomatoButton.addEventListener("click", () => {
      this.setTimer(TIMER_TYPE.TOMATO);
      this.setBackgroundTimer(TIMER_TYPE.TOMATO);
    });

    this.shortBreakButton.addEventListener("click", () => {
        this.setTimer(TIMER_TYPE.SHORT_BREAK);
        this.setBackgroundTimer(TIMER_TYPE.SHORT_BREAK);
      });

    this.longBreakButton.addEventListener("click", () => {
        this.setTimer(TIMER_TYPE.LONG_BREAK);
        this.setBackgroundTimer(TIMER_TYPE.LONG_BREAK);
      });

    this.resetButton.addEventListener("click", () => {
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
    this.enableControls();

  }

  resetTimerToRing() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }

    this.timer = {
      interval: setInterval(() => {
        this.setCurrentTimerStatus(TIMER_TYPE.RINGING)
        this.showDismissButton();
        this.disableControlsExceptDismiss()
      }, getSecondsInMilliseconds(1)),
      timeLeft: 0,
    };

    this.setCurrentTimerStatus(TIMER_TYPE.RINGING)
    this.showDismissButton();
    this.disableControlsExceptDismiss()
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
      this.disableControlsExceptDismiss()
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

  enableControls() {
    this.tomatoButton.removeAttribute("disabled")
    this.shortBreakButton.removeAttribute("disabled")
    this.longBreakButton.removeAttribute("disabled")
    this.resetButton.removeAttribute("disabled")
  }

  disableControlsExceptDismiss() {
    this.tomatoButton.setAttribute("disabled", "disabled")
    this.shortBreakButton.setAttribute("disabled", "disabled")
    this.longBreakButton.setAttribute("disabled", "disabled")
    this.resetButton.setAttribute("disabled", "disabled")
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
