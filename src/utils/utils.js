import {DATE_UNIT, MONTH_NAMES, TIMER_STATUS_TEXT, TIMER_TYPE} from "./constants";

export function getSecondsInMilliseconds(seconds) {
  return seconds * 1000;
}
export function getMinutesInMilliseconds(minutes) {
  return minutes * 60000;
}

export function getMillisecondsToHoursAndMinutesAndSeconds(milliseconds) {
  return {
    hours: parseInt((milliseconds / (1000 * 60 * 60)) % 60),
    minutes: parseInt((milliseconds / (1000 * 60)) % 60),
    seconds: parseInt((milliseconds / 1000) % 60),
  };
}

export function getHoursAndMinutesAndSecondsToMilliseconds(hours, minutes, seconds) {
  let milliseconds = hours * 1000 * 60 * 60;
  milliseconds += minutes * 1000 * 60;
  milliseconds += seconds * 1000;

  return milliseconds
}

export function getMillisecondsToTimeText(milliseconds) {
  const hours = parseInt((milliseconds / (1000 * 60 * 60)) % 60);
  const minutes = parseInt((milliseconds / (1000 * 60)) % 60);
  const seconds = parseInt((milliseconds / 1000) % 60);
  const hoursString = hours < 10 ? `0${hours}` : hours.toString();
  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${hoursString}:${minutesString}:${secondsString}`;
}

export function getZeroArray(length) {
  const zeroArray = [];

  for (let i = 0; i < length; i++) {
    zeroArray[i] = 0;
  }

  return zeroArray;
}

export function getDateMonthName(date) {
  return MONTH_NAMES[date.getMonth()];
}

export function getDateLabel(date, dateUnit) {
  switch (dateUnit) {
    case DATE_UNIT.DAY:
      return date.toDateString();
    case DATE_UNIT.MONTH:
      return getDateMonthName(date);
    default:
      return null;
  }
}

export function getDateRangeStringArray(startDate, endDate, dateUnit) {
  const dateStringArray = [];

  const currentStartDate = new Date(startDate);
  while (currentStartDate <= endDate) {
    dateStringArray.push(getDateLabel(currentStartDate, dateUnit));

    switch (dateUnit) {
      case DATE_UNIT.DAY:
        currentStartDate.setDate(currentStartDate.getDate() + 1);
        break;
      case DATE_UNIT.MONTH:
        currentStartDate.setMonth(currentStartDate.getMonth() + 1);
        break;
    }
  }

  return dateStringArray;
}

export function getTimerStatusText(type) {
  switch (type) {
    case TIMER_TYPE.TOMATO:
      return TIMER_STATUS_TEXT.TOMATO;
    case TIMER_TYPE.SHORT_BREAK:
      return TIMER_STATUS_TEXT.SHORT_BREAK;
    case TIMER_TYPE.LONG_BREAK:
      return TIMER_STATUS_TEXT.LONG_BREAK;
    case TIMER_TYPE.RINGING:
      return TIMER_STATUS_TEXT.RINGING;
    default:
      return TIMER_STATUS_TEXT.DEFAULT;
  }
}

export function getTimerTypeMilliseconds(type, settings) {
  switch (type) {
    case TIMER_TYPE.TOMATO:
      return settings.millisecondsInTomato;
    case TIMER_TYPE.SHORT_BREAK:
      return settings.millisecondsInShortBreak;
    case TIMER_TYPE.LONG_BREAK:
      return settings.millisecondsInLongBreak;
    default:
      return;
  }
}
