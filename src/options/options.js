import "bootstrap/dist/css/bootstrap.min.css";
import "./options.css";

import Settings from "../utils/settings";
import { SETTINGS_KEY } from "../utils/constants";
import { getHoursAndMinutesAndSecondsToMilliseconds, getMillisecondsToHoursAndMinutesAndSeconds } from "../utils/utils";

export default class Options {
  constructor() {
    this.settings = new Settings();

    this.domHoursInTomato = document.getElementById("hours-in-tomato");
    this.domMinutesInTomato = document.getElementById("minutes-in-tomato");
    this.domSecondsInTomato = document.getElementById("seconds-in-tomato");

    this.domHoursInShortBreak = document.getElementById("hours-in-short-break");
    this.domMinutesInShortBreak = document.getElementById("minutes-in-short-break");
    this.domSecondsInShortBreak = document.getElementById("seconds-in-short-break");

    this.domHoursInLongBreak = document.getElementById("hours-in-long-break");
    this.domMinutesInLongBreak = document.getElementById("minutes-in-long-break");
    this.domSecondsInLongBreak = document.getElementById("seconds-in-long-break");

    this.domNotificationSoundCheckbox = document.getElementById("notification-sound-checkbox");
    this.domToolbarBadgeCheckbox = document.getElementById("toolbar-badge-checkbox");


    this.setOptionsOnPage();
    this.setEventListeners();
  }

  setOptionsOnPage() {
    this.settings.getSettings().then((settings) => {
      const {
        millisecondsInTomato,
        millisecondsInShortBreak,
        millisecondsInLongBreak,
        isNotificationSoundEnabled,
        isToolbarBadgeEnabled,
      } = settings;

      const { hours: hoursInTomato, minutes: minutesInTomato, seconds: secondsInTomato } = getMillisecondsToHoursAndMinutesAndSeconds(millisecondsInTomato);
      const { hours: hoursInShortBreak, minutes: minutesInShortBreak, seconds: secondsInShortBreak } = getMillisecondsToHoursAndMinutesAndSeconds(millisecondsInShortBreak);
      const { hours: hoursInLongBreak, minutes: minutesInLongBreak, seconds: secondsInLongBreak } = getMillisecondsToHoursAndMinutesAndSeconds(millisecondsInLongBreak);

      this.domHoursInTomato.value = hoursInTomato;
      this.domMinutesInTomato.value = minutesInTomato;
      this.domSecondsInTomato.value = secondsInTomato;

      this.domHoursInShortBreak.value = hoursInShortBreak;
      this.domMinutesInShortBreak.value = minutesInShortBreak;
      this.domSecondsInShortBreak.value = secondsInShortBreak;

      this.domHoursInLongBreak.value = hoursInLongBreak;
      this.domMinutesInLongBreak.value = minutesInLongBreak;
      this.domSecondsInLongBreak.value = secondsInLongBreak;

      this.domNotificationSoundCheckbox.checked = isNotificationSoundEnabled;
      this.domToolbarBadgeCheckbox.checked = isToolbarBadgeEnabled;

    });
  }

  saveOptions() {
    const hoursInTomato = parseInt(this.domHoursInTomato.value);
    const minutesInTomato = parseInt(this.domMinutesInTomato.value);
    const secondsInTomato = parseInt(this.domSecondsInTomato.value);

    const hoursInShortBreak = parseInt(this.domHoursInShortBreak.value);
    const minutesInShortBreak = parseInt(this.domMinutesInShortBreak.value);
    const secondsInShortBreak = parseInt(this.domSecondsInShortBreak.value);

    const hoursInLongBreak = parseInt(this.domHoursInLongBreak.value);
    const minutesInLongBreak = parseInt(this.domMinutesInLongBreak.value);
    const secondsInLongBreak = parseInt(this.domSecondsInLongBreak.value);

    const isNotificationSoundEnabled = this.domNotificationSoundCheckbox.checked;
    const isToolbarBadgeEnabled = this.domToolbarBadgeCheckbox.checked;

    const millisecondsInTomato = getHoursAndMinutesAndSecondsToMilliseconds(hoursInTomato, minutesInTomato, secondsInTomato);
    const millisecondsInShortBreak = getHoursAndMinutesAndSecondsToMilliseconds(hoursInShortBreak, minutesInShortBreak, secondsInShortBreak);
    const millisecondsInLongBreak = getHoursAndMinutesAndSecondsToMilliseconds(hoursInLongBreak, minutesInLongBreak, secondsInLongBreak);


    this.settings.saveSettings({
      [SETTINGS_KEY.MILLISECONDS_IN_TOMATO]: millisecondsInTomato,
      [SETTINGS_KEY.MILLISECONDS_IN_SHORT_BREAK]: millisecondsInShortBreak,
      [SETTINGS_KEY.MILLISECONDS_IN_LONG_BREAK]: millisecondsInLongBreak,
      [SETTINGS_KEY.IS_NOTIFICATION_SOUND_ENABLED]: isNotificationSoundEnabled,
      [SETTINGS_KEY.IS_TOOLBAR_BADGE_ENABLED]: isToolbarBadgeEnabled,
    });
  }

  setEventListeners() {
    document.getElementById("options-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveOptions();
    });

    document.getElementById("reset-options").addEventListener("click", () => {
      this.settings.resetSettings().then(() => {
        this.setOptionsOnPage();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Options();
});
