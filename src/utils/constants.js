export const NOTIFICATION_ID = "tomatoClockNotification";

export const STORAGE_KEY = {
  TIMELINE: "timeline",
  SETTINGS: "settings",
};

export const SETTINGS_KEY = {
  MILLISECONDS_IN_TOMATO: "millisecondsInTomato",
  MILLISECONDS_IN_SHORT_BREAK: "millisecondsInShortBreak",
  MILLISECONDS_IN_LONG_BREAK: "millisecondsInLongBreak",
  IS_NOTIFICATION_SOUND_ENABLED: "isNotificationSoundEnabled",
  IS_TOOLBAR_BADGE_ENABLED: "isToolbarBadgeEnabled",
};

export const DEFAULT_SETTINGS = {
  [SETTINGS_KEY.MILLISECONDS_IN_TOMATO]: 3600000,
  [SETTINGS_KEY.MILLISECONDS_IN_SHORT_BREAK]: 900000,
  [SETTINGS_KEY.MILLISECONDS_IN_LONG_BREAK]: 1500000,
  [SETTINGS_KEY.IS_NOTIFICATION_SOUND_ENABLED]: true,
  [SETTINGS_KEY.IS_TOOLBAR_BADGE_ENABLED]: true,
};

export const TIMER_TYPE = {
  TOMATO: "tomato",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
  RINGING: "ringing",
};

export const TIMER_STATUS_TEXT = {
  TOMATO: "Tomatoing",
  SHORT_BREAK: "Short Breaking",
  LONG_BREAK: "Long Breaking",
  RINGING: "Ringing",
  DEFAULT: "Tomato Clock",
};

export const BADGE_BACKGROUND_COLOR_BY_TIMER_TYPE = {
  [TIMER_TYPE.TOMATO]: "#dc3545",
  [TIMER_TYPE.SHORT_BREAK]: "#666",
  [TIMER_TYPE.LONG_BREAK]: "#1e7e34",
  [TIMER_TYPE.RINGING]: "#17a2b8",
};

export const RUNTIME_ACTION = {
  SET_TIMER: "setTimer",
  RESET_TIMER: "resetTimer",
  GET_TIMER_SCHEDULED_TIME: "getTimerScheduledTime",
  GET_TIMER_TYPE: "getTimerType",
  STOP_NOTIFICATION_SOUND: "stopNotificationSound",
};

export const DATE_UNIT = {
  DATE: "day",
  MONTH: "month",
};

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
